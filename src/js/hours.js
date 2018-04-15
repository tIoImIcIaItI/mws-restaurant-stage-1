import moment from 'moment';

/**
 * Wrap times of day in <time> elements.
 */
const hoursHtml = (operatingHours) => {
	const regex = /(\d{1,2})\:(\d\d)\s(am|pm)/g;

	return (operatingHours || '').replace(regex, (match) => {
		const date = moment(match, 'h:mm A').format('HH:mm');
		return `<time datetime="${date}">${match}</time>`;
	});
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
export const fillHoursHtml = (document, root, operatingHours) => {
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
