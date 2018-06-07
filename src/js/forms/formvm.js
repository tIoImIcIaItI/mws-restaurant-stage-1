// Derived from my earlier project at https://github.com/tIoImIcIaItI/Restaurant-Reviews-App, converted to ES6.
import '../utils/dom';

// Base form class, providing convenience functions and
// standardizing the way this app will handle validation, autofocus, etc.

export default class FormViewModel {

    constructor(alert, formElement) {
        this.alert = alert;
        this.el = formElement;

        this.onSubmitValid = null;
        this.preFormSubmit = null;
        this.postFormSubmit = null;

        this.initializeValidation();
        this.initializeSubmitHook();
    };

    // Return an array filled with all the likely DOM input elements in this form
    allInputs = () => {
        return Array.from(this.el.getElementsByTagName('input')).concat(
            Array.from(this.el.getElementsByTagName('textarea')));
    };

    clearInput = (input) => input.value = '';

    // Removes any value and validation errors from the given DOM input element
    resetInput = (input) => {
        this.clearInput(input);
        this.clearValidationErrorState(input);
    };

    // Removes all values and validation errors from all the known input elements in this form
    reset = () => 
        this.allInputs().
            forEach(
                this.resetInput);

    // Returns the label in this form whose 'for' attribute points to the given input element's id
    labelFor = (input) => 
        this.el.querySelector(
            '#' + this.el.id + ' label[for=\'' + input.id + '\']');

    // Returns all the DOM elements in this form declared as being an error annotation
    // for the given DOM input element.
    // To associate an error with an input, place the 'data-error-for' attribute
    // on the error element and give it a value of the id of the input element.
    errorElementsFor = (input) => 
        Array.from(this.el.getElementsByClassName('validation-error')).
            filter(el => el.getAttribute('data-error-for') === input.id);

    // Pushes an input element's validation message into any associated error elements' textContent,
    // adds the 'aria-invalid' attribute to the input element,
    // and adds the 'has-error' class to the input element's parent.
    setValidationErrorState = (input) => {
        this.errorElementsFor(input).forEach(error => {
            error.removeAttribute('aria-hidden');
            //error.setAttribute('aria-live', 'assertive');
            error.textContent = this.getValidationMessage(input);
            error.classList.remove('invisible');
        });

        input.setAttribute('aria-invalid', 'true');

        input.parentNode.classList.remove('has-error');
        input.parentNode.classList.remove('has-warning');
        input.parentNode.classList.remove('has-success');

        input.parentNode.classList.add('has-error');
    };
    
    setValidationSuccessState = (input) => {
        this.errorElementsFor(input).forEach(error => {
            //error.removeAttribute('aria-live');
            error.setAttribute('aria-hidden', 'true');
            error.textContent = '';
            error.classList.add('invisible');
        });

        input.removeAttribute('aria-invalid');

        input.classList.remove('dirty');

        input.parentNode.classList.remove('has-error');
        input.parentNode.classList.remove('has-warning');
        input.parentNode.classList.remove('has-success');

        input.parentNode.classList.add('has-success');
    };

    // Un-does what setValidationErrorState() does
    clearValidationErrorState = (input) => {

        this.errorElementsFor(input).forEach(error => {
            //error.removeAttribute('aria-live');
            error.setAttribute('aria-hidden', 'true');
            error.textContent = '';
            error.classList.add('invisible');
        });

        input.removeAttribute('aria-invalid');

        input.classList.remove('dirty');

        input.parentNode.classList.remove('has-error');
        input.parentNode.classList.remove('has-warning');
        input.parentNode.classList.remove('has-success');
    };

    // Wrapper function for setCustomValidity() with fallback
    setValidity = (input, msg) => {
        input.setCustomValidity !== undefined ?
            input.setCustomValidity(msg) :
            input.setAttribute('data-validity-customValidity', msg);
    };

    // Wrapper function for validity.valid property with fallback
    isValid = (input) => 
        input.validity !== undefined ?
            input.validity.valid :
            !input.getAttribute('data-validity-customValidity');

    // Wrapper function for validationMessage property with fallback
    getValidationMessage = (input) => 
        input.validationMessage !== undefined ?
            input.validationMessage :
            input.getAttribute('data-validity-customValidity');

    // Sets or clears the input element's custom error state based on its current validity
    updateValidationErrorState = (input, isInitial = true) => {
        if (!this.isValid(input))
            this.setValidationErrorState(input);
        else if (!isInitial)
            this.setValidationSuccessState(input);
        else
            this.clearValidationErrorState(input);
    };

    // Convenience method to clear all validation and error state
    passInput = (input) => {
        this.setValidity(input, '');
        this.updateValidationErrorState(input, false);
        return true;
    };

    // Convenience method to set failed validation and error state
    failInput = (input, msg) => {
        this.setValidity(input, msg);
        this.updateValidationErrorState(input, false);
        return false;
    };

    initializeValidation = () => {

        const addDirtyClass = (evt) => 
            evt.target.classList.add('dirty');

        const validate = (evt) => 
            this.updateValidationErrorState(evt.target);

        // Returns a space-delimited list of ids from the given elements
        const idListFrom = (els) => 
            els.map(el => el.id).join(' ');

        // Prepare all inputs, except those opting-out with a 'data-novalidate' attribute
        this.allInputs().
            filter(input => 
                !input.hasAttribute('data-novalidate')).
            forEach(input => {

                var errorElements =
                    this.errorElementsFor(input);

                // Allow AT to associate and announce the error messages with the input field
                errorElements.forEach(error => 
                    error.setAttribute('aria-live', 'assertive'));

                if (!input.getAttribute('aria-describedby'))
                    input.setAttribute('aria-describedby', idListFrom(errorElements));

                // Add the 'required' class to the label of any required input
                if (input.hasAttribute('required')) {

                    var label = this.labelFor(input);

                    if (label) {

                        // Allow styling required labels
                        label.classList.add('required');

                        // Ensure screen readers will annouce that this field is required
                        var ariaLabel = newTextElement('span', label.textContent + ' required');
                        ariaLabel.id = input.id + '-aria-label';
                        ariaLabel.classList.add('sr-only');

                        label.appendChild(ariaLabel);
                        input.setAttribute('aria-labelledby', ariaLabel.id);

                        // Add a visual annotation to required field labels
                        var splat = newLabelGlyph('fa-asterisk', 'required', 'required-annotation');
                        splat.setAttribute('aria-hidden', 'true');

                        label.appendChild(splat);
                    }
                }

                /* ADAPTED FROM: https://developers.google.com/web/fundamentals/design-and-ui/input/forms/provide-real-time-validation?hl=en */
                input.addEventListener('blur', addDirtyClass);
                // input.addEventListener('invalid', addDirtyClass);
                // input.addEventListener('valid', addDirtyClass);

                input.addEventListener('blur', validate);

            });
    };

    // Returns the first descendant element of the form
    // with a 'data-autofocus' attribute present
    getInitialFocusElement = () => 
        this.el.querySelector('#' + this.el.id + ' [data-autofocus]');

    // Attempts to set focus to the element designated to receive initial focus.
    // Returns true if focus was set.
    setInitialFocus = () => {

        var focusElement = this.getInitialFocusElement();

        if (focusElement) {
            focusElement.focus();

            return focusElement === document.activeElement;
        }

        return false;
    };

    // Wire up the form's submit event to provide some default handling of
    // invalid forms (preventing submission, showing an alert),
    // and perform custom application logic via a callback for valid form submits.
    // Calling code should assign a function to onSubmitValid to register the callback.
    // If the callback returns falsey (or no callback is registered), the form submittal is cancelled.
    initializeSubmitHook = () => {

        this.el.addEventListener('submit', evt => {

            if (this.preFormSubmit && !this.preFormSubmit()) {
                evt.preventDefault();
                return false;
            }

            if (this.el.checkValidity() === false) {

                // FALLBACK for browsers that don't block invalid form submittal
                this.el.reportValidity();

                this.alert('Please correct the form and try again'); // TODO: make this a callback

                if (this.postFormSubmit)
                    this.postFormSubmit();

                evt.preventDefault();
                return false;

            } else {

                // Callback to any submit listener
                var cancel = !this.onSubmitValid || !this.onSubmitValid(this.el);

                if (this.postFormSubmit)
                    this.postFormSubmit();

                // Cancel form submittal if instructed
                if (cancel) {
                    evt.preventDefault();
                    return false;
                }
            }

            return true;
        });
    };
}
