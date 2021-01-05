require('babel-polyfill')
let babel = require('babel-core');

let visitorFuc = require('./visitor')

module.exports = (jsCode,htmlCode) =>{
  let visitor = visitorFuc(htmlCode)
  let result= babel.transform(jsCode, {
    ast:true,
    plugins: [
      { visitor }
    ]
  });
 let transCode = result.code.replace(/;/g,'')
 return transCode
}
