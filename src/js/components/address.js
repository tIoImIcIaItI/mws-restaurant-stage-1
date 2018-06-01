/**
 * Wrap restaurant address in semantic element and microdata.
 */

const partsFrom = (address) => {
	// 171 E Broadway, New York, NY 10002
	var parts = (address || '').split(', ');
	const last = parts[2].split(' ');

	var [street, city] = parts;
	var [state, zip] = last;

	return {
		street, city, state, zip
	};
};

const render = (address) => {

	const { street, city, state, zip } = partsFrom(address);

	return (
		`<address itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">
		<span itemprop="streetAddress">${street}</span>, 
		<span itemprop="addressLocality">${city}</span>, 
		<span itemprop="addressRegion">${state}</span>
		<span itemprop="postalCode">${zip}</span>
		</address>`
	);
};

export default render;
