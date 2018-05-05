import moment from 'moment';

/**
 * Wrap times of day in <time> elements.
 */
const hoursHtml = (operatingHours) => {
	const regex = /(\d{1,2})\:(\d\d)\s(am|pm)/g;

	return (operatingHours || '').
		replace(regex, (match) => {
			const date = moment(match, 'h:mm A').format('HH:mm');
			return `<time datetime="${date}">${match}</time>`; }).
		replace(' - ', '<span class="sr-only"> through </span><span aria-hidden="true"> - </span>');
};

const headerRow = () => {
	const row = document.createElement('tr');
	row.className = 'sr-only';

	const dayCol = document.createElement('th');
	dayCol.innerHTML = 'Day';
	row.appendChild(dayCol);

	const timeCol = document.createElement('th');
	timeCol.innerHTML = 'Hours of Operation';
	row.appendChild(timeCol);

	return row;
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
export const fillHoursHtml = (document, root, operatingHours) => {

	root.appendChild(headerRow());

	for (let key in operatingHours) {
		if (operatingHours.hasOwnProperty(key)) {
			const row = document.createElement('tr');

			const day = document.createElement('td');
			day.innerHTML = key;
			row.appendChild(day);

			const time = document.createElement('td');
			time.innerHTML = hoursHtml(operatingHours[key]);
			row.appendChild(time);

			root.appendChild(row);
		}
	}

};
