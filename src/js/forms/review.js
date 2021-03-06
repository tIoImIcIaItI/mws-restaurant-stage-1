import FormViewModel from './formvm';
import { setBoolAttr, keyValuesToObject } from './utils';

export default class ReviewForm extends FormViewModel {

	constructor(document, alert, formElement) {
		super(alert, formElement);

		this.document = document;

		this.submit = document.getElementById('new-review-btn-submit');

		this.name = document.getElementById('new-review-name');
		this.rating = document.getElementById('new-review-rating');
		this.comments = document.getElementById('new-review-comments');

		this.fields = {
			name: {
				element: this.name,
				getValue: (e) => e.value,
				isValid: (v) => v.length > 0,
				errorMsg: 'Please provide your name'
			},
			rating: {
				element: this.rating,
				getValue: (e) => Number.parseInt(e.value, 10),
				isValid: (v) => v >= 1 && v <= 5,
				errorMsg: 'Please select a rating from 1 to 5'
			},
			comments: {
				element: this.comments,
				getValue: (e) => e.value,
				isValid: (v) => v.length > 0,
				errorMsg: 'Please provide some comments about your experience'
			}
		};

		Object.entries(this.fields).forEach(entry => {
			const field = entry[0];
			const element = entry[1].element;
			element.addEventListener('blur', () => this.updateValidity([field]));
			element.addEventListener('input', () => this.updateValidity([field]));
		});
	}

	updateFieldValidity = (entry, isValid) => {
		if (isValid)
			this.passInput(entry.element);
		else
			this.failInput(entry.element, entry.errorMsg);
	};

	// Validate the entire form
	// Update the validation state of the requested fields only
	updateValidity = (fields) => {

		const isValid = Object.entries(this.fields).reduce(
			(p, c) => {
				const [field, entry] = c;
				const value = entry.getValue(entry.element);
				const isValid = entry.isValid(value);

				if (fields && fields.includes(field))
					this.updateFieldValidity(entry, isValid);

				return p && isValid;
			},
			true);

		setBoolAttr(this.submit, 'disabled', isValid);

		return isValid;
	};

	// Returns an object with key/value pairs of the fields, ex:
	// { email: 'a@b.com', name: 'John Hancock' }
	getFormData = () =>
		keyValuesToObject(
			Object.entries(this.fields).
				map(e => [e[0], e[1].getValue(e[1].element)]));
}
