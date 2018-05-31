export const loadScript = (document, src, async, integrity, crossorigin) => {
	var child = document.createElement('script');
	child.src = src;

	if (async) child.async = true;
	if (integrity) child.integrity = integrity;
	if (crossorigin) child.crossOrigin = crossorigin;

	var parent = document.getElementsByTagName('head')[0];
	parent.appendChild(child);
};

export const jsonResponseFrom = (obj) => {
	return new Response(
		new Blob([JSON.stringify(obj)], { type: 'application/json' }), 
		{ "status": 200, "statusText": "ok" });
};

export const idFrom = (url) => {
	const regex = /\/restaurants\/(\d+)$/i;

	const id = (url || '').match(regex);

	return id && id.length >= 2 && id[1] ? 
		parseInt(id[1], 10) : 
		null;
};
