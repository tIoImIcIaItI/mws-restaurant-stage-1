export const setBoolAttr = (element, name, value) => {
    if (value)
        element.removeAttribute(name);
    else
        element.setAttribute(name, '');
}

// Converts an array of arrays of key/value pairs to properties on an object
// [ [a,1], [b,2] ] ==> { a:1, b:2 }
export const keyValuesToObject = (kvps) => // TODO: Object.assign
    kvps.reduce((p,c) => {
        p[c[0]] = c[1];
        return p;
    }, {});
