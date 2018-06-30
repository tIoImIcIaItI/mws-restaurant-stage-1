// webpack.config.js
import path from 'path'
import webpack from 'webpack'
import process from 'process'

const isProduction = (process.env.NODE_ENV === 'production');

console.log(`ENV: [${process.env.NODE_ENV}] [${isProduction}]`);

let config = {
	mode: process.env.NODE_ENV,
	entry: isProduction ?
		{
			index: './js/pages/index.js',
			restaurant: './js/pages/restaurant.js',
			sw: './js/serviceworker/sw.js'
		} :
		{
			index: [
				'./js/pages/index.js',
				'webpack/hot/dev-server',
				'webpack-hot-middleware/client'
			],
			restaurant: [
				'./js/pages/restaurant.js',
				'webpack/hot/dev-server',
				'webpack-hot-middleware/client'
			],
			sw: './js/serviceworker/sw.js'
		},

	output: {
		publicPath: '/',
		path: path.resolve(__dirname, '../dist'),
		filename: './[name].js',
		globalObject: 'this' // workaround for webpack accessing window in service worker
	},

	context: path.resolve(__dirname, '../src'),

	plugins: isProduction ?
		[new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' })] :
		[new webpack.HotModuleReplacementPlugin()],

	module: {
		rules: [
			// {
			// 	test: /\.js$/,
			// 	exclude: /node_modules/,
			// 	use: ['eslint-loader']
			// },
			{
				test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader',
				query: {
					presets: ['es2015', 'stage-2']
				}
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			}
		]
	}
};

function scripts() {

	return new Promise(resolve => webpack(config, (err, stats) => {
		if (err) console.log('Webpack', err);
		console.log(stats.toString({ /* stats options */ }));
		resolve();
	}));

};

module.exports = { config, scripts };
