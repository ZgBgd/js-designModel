require('babel-polyfill')
let babel = require('babel-core')
let visitor = require('./visitor')
let {parse} = require('@babel/parser')
var {default: generate} = require('@babel/generator');
var {default: traverse} = require('@babel/traverse');
module.exports = (htmlCode) =>{
    let resetCode = htmlCode.replace(/<!--[\w\W\r\n]*?-->/gmi, '')
    resetCode = resetCode.replace(/<wxs[\w\W\r\n]*?\/>/gmi, '')
    const removeDoubleQute = resetCode.replace(/{(.*?)}/g,'$1')
    let originAST = parse(removeDoubleQute,{plugins:['jsx']})
    traverse(originAST,visitor)
    var targetCode = generate(originAST)
    return targetCode.code
}
