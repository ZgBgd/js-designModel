const { each, extendKm,removeBlock } = require('./util');
const toObject = require('./object');
const {defaultTransformOptions}  = require('./options')
const {EXCLUDEATTR} = require('./exclude')
var propsStringify = (props) => {
    var html = "";

    each(props, prop => {

        if (prop.onlyName) {
            html += ` ${prop.name}`;
        } else {
            if(!EXCLUDEATTR.includes(prop.name)){
                html += ` ${prop.name}="${prop.value}"`;
            }
            
        }
    });
    return html;
}

var childrenStringify = (children, options) => {
    return (children || []).map(item => {
        return elementStringify(item, options);
    }).join('');
}

var createElement = (tagName, props, innerHtml) => {
    const propsStr = propsStringify(props)
    return `<${tagName}${propsStr}>${innerHtml}</${tagName}>`;
}

var defaultHelper = {
    propsStringify: propsStringify,
    childrenStringify: childrenStringify,
    elementStringify: elementStringify
};
// var reactif = (transform,elementSpec,options,createElement) =>{
//     const props = elementSpec.props
//     let str = ''
//     each(props, prop => {
//         str = ''
//         if(prop.name === 'wx:if' || prop.name === 'wx:elif'){
//             str+=`{${removeBlock(prop.value)} ? ${createElement(transform, propsStringify(elementSpec.props), childrenStringify(elementSpec.children, options))} :null}`
//         }else {
//             str+=createElement(transform, propsStringify(elementSpec.props), childrenStringify(elementSpec.children, options))
//         }
//     })
//     return str
// }
var elementStringify = (elementSpec, options) => {
    if (typeof elementSpec === 'string') return elementSpec;
    var elementHtml = "",
        wxmlTagName = elementSpec.tag;
    if (options.mapping && options.mapping[wxmlTagName]) {
        var transform = options.mapping[wxmlTagName];
        if (typeof transform === 'string') {
            elementHtml += createElement(transform, elementSpec.props , childrenStringify(elementSpec.children, options))
        } else if (typeof transform === 'function') {
            elementHtml += transform(elementSpec, defaultHelper);
        } else {
            elementHtml += createElement(wxmlTagName, elementSpec.props, childrenStringify(elementSpec.children, options));
        }
    } else {
        elementHtml += createElement(wxmlTagName, elementSpec.props, childrenStringify(elementSpec.children, options));
    }
    return elementHtml;
}

module.exports = (wxmlContent, options) => {
    options = options || {};
    options = extendKm(true, {}, defaultTransformOptions, options);
    var html = "",
        wxmlObject = toObject(wxmlContent);
    each(wxmlObject, item => {
        html += elementStringify(item, options);
    });
    // console.log(html)
    return html;
};