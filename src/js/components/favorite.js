import '../../styles/buttons.css';
import '../../styles/favorite.css';
import { debug } from 'util';

const render = (document, container, id, value, getClassName, onChange) => {

    const label = document.createElement('label'); {
        label.className = 'container';
        container.append(label);

        const descriptor = document.createElement('span');
        descriptor.className = 'sr-only';
        descriptor.innerHTML = 'Favorite';
        descriptor.setAttribute('for', id);
        label.append(descriptor);

        const widgetId = `${id}-widget`;

        const widget = document.createElement('svg');
        widget.setAttribute('aria-hidden', 'true');
        widget.id = widgetId;
        widget.className = getClassName(value);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = value;
        checkbox.id = id;
        checkbox.addEventListener('change', event => {
            const newVal = checkbox.checked; 
            document.getElementById(widgetId).setAttribute('class', getClassName(newVal));
            onChange(newVal);
        });
        label.append(checkbox);

        label.append(widget);
    }
};

export default render;
