export default class Observer {

    constructor(callback, options) {
        this._callback = callback;
        this._obs = new IntersectionObserver(callback, options);
    }

    observe = (target) => {
        this._obs.observe(target);
    };

    unobserve = (target) => {
        this._obs.unobserve(target);
    };
}
