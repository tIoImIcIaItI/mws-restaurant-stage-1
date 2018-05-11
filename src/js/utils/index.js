export const loadScript = (src, async, integrity, crossorigin) => {
	var child = document.createElement('script');
	child.src = src;

	if (async) child.async = true;
	if (integrity) child.integrity = integrity;
	if (crossorigin) child.crossorigin = crossorigin;

	var parent = document.getElementsByTagName('head')[0];
	parent.appendChild(child);
};
