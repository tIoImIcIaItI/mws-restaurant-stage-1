import FormViewModel from "./formvm";

export default class ReviewForm extends FormViewModel {

    constructor(document, alert, formElement) {
        super(alert, formElement);

        this.document = document;

        this.submit = document.getElementById('new-review-btn-submit');
        this.name = document.getElementById('new-review-name');
        this.rating = document.getElementById('new-review-rating');
        this.comments = document.getElementById('new-review-comments');

        this.name.addEventListener('blur', () => this.validateName());
        this.rating.addEventListener('blur', () => this.validateRating());
        this.comments.addEventListener('blur', () => this.validateComments());

        this.name.addEventListener('input', () => this.validateName());
        this.rating.addEventListener('input', () => this.validateRating());
        this.comments.addEventListener('input', () => this.validateComments());
    }

    validateName = () => {
        return this.name.value.length > 0 ? 
            this.passInput(this.name) : 
            this.failInput(this.name, 'Please provide your name');
    };

    validateRating = () => {
        return (this.rating.value >= 1 && this.rating.value <= 5) ? 
            this.passInput(this.rating) : 
            this.failInput(this.rating, 'Please select a rating from 1 to 5');
    };

    validateComments = () => {
        return this.comments.value.length > 0 ? 
            this.passInput(this.comments) : 
            this.failInput(this.comments, 'Please provide some comments about your experience');
    };

    updateValidity = () => {
        let res = true;
        res &= this.validateName();
        res &= this.validateRating();
        res &= this.validateComments();

        if (res)
            this.submit.removeAttribute('disabled');
        else
            this.submit.setAttribute('disabled', '');

        return res;
    };

    getFormData = () => {
        return {
            name: this.name.value,
            rating: this.rating.value,
            comments: this.comments.value
        };
    };
}
