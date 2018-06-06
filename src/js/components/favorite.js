import '../../styles/buttons.css';
import '../../styles/favorite.css';
import { debug } from 'util';

const className = (newVal) => newVal ? 
    'btn btn-icon favorite is-favorite fas fa-heart' : 
    'btn btn-icon favorite is-not-favorite far fa-heart';

const render = (document, container, id, isFav, onChange) => {

    const label = document.createElement('label'); {
        label.className = 'container';
        container.append(label);

        const descriptor = document.createElement('span');
        descriptor.className = 'sr-only';
        descriptor.innerHTML = 'Favorite';
        descriptor.setAttribute('for', id);
        label.append(descriptor);

        const widgetId = `${id}-widget`;

        const widget = document.createElement('span');
        widget.setAttribute('aria-hidden', 'true');
        widget.id = widgetId;
        widget.className = className(isFav);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = isFav;
        checkbox.id = id;
        checkbox.addEventListener('change', event => {
            const newVal = checkbox.checked; 
            document.getElementById(widgetId).setAttribute('class', className(newVal));
            onChange(newVal);
        });
        label.append(checkbox);

        label.append(widget);
    }
};

export default render;
