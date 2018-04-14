/**
 * Wrap restaurant address in semantic element and microdata.
 */
export const addressHtml = (address) => {
	// 171 E Broadway, New York, NY 10002
	var parts = (address || '').split(', ');
	const last = parts[2].split(' ');

	var [street, city] = parts;
	var [state, zip] = last;

	return (
		'<address itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">' +
		`<span itemprop="streetAddress">${street}</span>, ` +
		`<span itemprop="addressLocality">${city}</span>, ` +
		`<span itemprop="addressRegion">${state}</span> ` +
		`<span itemprop="postalCode">${zip}</span>` +
		'</address>');
};
