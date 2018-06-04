/**
 * Add restaurant name to the breadcrumb navigation menu
 */
const render = (document, container, restaurant) => {
	const breadcrumb = document.getElementById('breadcrumb');

	const li = document.createElement('li');
	li.innerHTML = restaurant.name;
	breadcrumb.appendChild(li);
};

export default render;
