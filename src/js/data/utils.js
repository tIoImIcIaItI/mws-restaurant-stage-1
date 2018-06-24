// SOURCE: https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
export const hash = (str = '') => {
	let hash = 0;

	if (str.length === 0)
		return hash;

	for (let i = 0; i < str.length; i++) {
		const chr = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}

	return hash;
};

export const toArrayOrEmpty = (x) =>
	Array.isArray(x) ? x : x ? [x] : [];

export const whereIsSomething = (xs) =>
	xs.filter(x => !!x);

export const whereExistsIn = (lhs, rhs, predicate) =>
	lhs.filter(x =>
		rhs.find(y => predicate(x, y)));

// SOURCE: http://colin-dumitru.github.io/functional-programming/javascript/tutorial/2014/12/28/functional_operations_in_es6.html
export const partition = (arr, predicate) =>
	arr.reduce(
		(l, r) => ( (predicate(r) ? l[0] : l[1]).push(r),  l ),
		[[],[]] );
