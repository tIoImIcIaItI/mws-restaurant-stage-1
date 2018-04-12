// webpack.config.js
import path from 'path'
import webpack from 'webpack'
import process from 'process'

//console.log(process.env);

const isProduction = (process.env.NODE_ENV === 'production')

let config = {
	mode: 'development',//process.env.NODE_ENV,
	//entry: './js/index.js',
	entry: isProduction ?
		{
			main: './js/index.js'
		} :
		{
			main: [
				'./js/index.js',
				'webpack/hot/dev-server',
				'webpack-hot-middleware/client',
			]
		},

	output: {
		filename: './js/bundle.js',
		path: path.resolve(__dirname, '../dist')
	},

	context: path.resolve(__dirname, '../src'),

	plugins: isProduction ?
		[new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }), new webpack.optimize.UglifyJsPlugin()] :
		[new webpack.HotModuleReplacementPlugin()],

	module: {
		rules: [
			// {
			// 	test: /\.js$/,
			// 	exclude: /node_modules/,
			// 	use: ['eslint-loader']
			// },
			{
				test: /\.js$/, exclude: /node_modules/, loader: "babel-loader",
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

	// //mode: 'development',
	// entry: "./src/index.js",
	// output: {
	// 	path: __dirname,
	// 	filename: "bundle.js"
	// },
	// module: {
	// 	rules: [
	// 		// {
	// 		// 	test: /\.js$/,
	// 		// 	exclude: /node_modules/,
	// 		// 	use: ['eslint-loader']
	// 		// },
	// 		{
	// 			test: /\.js$/, exclude: /node_modules/, loader: "babel-loader",
	// 			query: {
	// 				presets: ['es2015', 'stage-2']
	// 			}
	// 		},
	// 		{
	// 			test: /\.css$/,
	// 			use: ['style-loader', 'css-loader']
	// 		}
	// 	]
	// },
	// devServer: {
	// 	port: 8000
	// },
};

module.exports = { config, scripts };
