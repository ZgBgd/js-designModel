const {each,removeBlock} = require('./util')
var p5 = require('parse5');
const {reactTransOptions}  = require('./propsOptions')
var elementToObject = (element) => {
    var result;
    if (element.nodeName === '#text') {
        result = element.value;
    } else {
        result = {
            props: [],
            children: []
        };
        result.tag = (element.nodeName || element.tagName).toLowerCase();
        var onlyNameAttrs = [];
        if (element.attrs && element.attrs.length > 0) {
            Object.keys(element.attrs).forEach(name => {
                var attr = element.attrs[name];
                if (name.length === attr.endOffset - attr.startOffset) {
                    onlyNameAttrs.push(name);
                }
            });
            each(element.attrs, attr => {
                let val = attr.name === 'src' ? `require('${attr.value}')`:attr.value
                if (onlyNameAttrs.indexOf(attr.name) === -1) {
                    result.props.push({
                        name: reactTransOptions[attr.name] || attr.name,
                        value:   `${removeBlock(val,true)}`
                    })
                } else {
                    result.props.push({
                        name: attr.name,
                        onlyName: true
                    })
                }
            });
        }
        if (element.childNodes && element.childNodes.length > 0) {
            each(element.childNodes, item => {
                result.children.push(elementToObject(item));
            });
        }
    }
    return result;
}

var toObject = (wxmlContent) => {
    var result = [],
        dom = p5.parse(wxmlContent, {
            locationInfo: true
        }),
        
        body = dom.childNodes[0].childNodes[1];
       
    each(body.childNodes, item => {
        console.log(elementToObject(item))
        result.push(elementToObject(item));
    });
    return result;
    
}

module.exports = toObject