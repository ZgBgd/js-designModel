let jsOptions = require('./jsoptions')
let t = require('@babel/types');
module.exports = function(htmlCode){
    return {
        //输出导入文件参数
        ImportDeclaration(path) {
            const { node } = path
            let { specifiers } = node
            if (specifiers) {
                const { name } = specifiers[0].local
                if (name === 'regeneratorRuntime' || name === 'WxService' || name === 'PointConfig' || name === 'RecordService') {
                    path.remove()
                } else if (name === 'ajax') {
                    node.source.value = '@util/ajax'
                }
            }
        },
        Identifier(path) {
            const { node } = path
            const { name } = node
            let rjsList = Object.keys(jsOptions)
            if (rjsList.includes(name)) {
                node.name = jsOptions[node.name]
            }
        },
        VariableDeclaration(path) {
            const { node } = path
            const doc = node.declarations[0]
            const { callee } = doc.init
            if (callee && callee.name === 'getApp') {
                let arrT = t.importDefaultSpecifier(t.Identifier('globalData'))
                let sources = t.stringLiteral('@config/globalData')
                let imc = t.importDeclaration([arrT], sources)
                path.replaceWith(imc)
            }
        },
        ExpressionStatement(path) {
            const pNode = path.node
            const node = pNode.expression
            if (node.callee && node.callee.name === 'Page') {
                const { properties } = node.arguments[0]
                let dataObj = {}
                for (var i = 0; i < properties.length; i++) {
                    const item = properties[i]
                    const { type } = item
                    if (type === 'ObjectProperty') {
                        dataObj = Object.assign({}, item.value)
                        const params = t.Identifier('props')
                        const kk = Object.assign({}, item.key)
                        kk.name = 'constructor'
                        const body = t.blockStatement([t.expressionStatement(
                            t.CallExpression(t.identifier('super'), [t.identifier('props')])
                        ), t.ExpressionStatement(
                            t.AssignmentExpression('=', t.MemberExpression(
                                t.thisExpression(), t.identifier('state')
                            ), item.value)
                        )])
                        properties[i] = t.classMethod('constructor', kk, [params], body, false, null)
                    } else if (type === 'ObjectMethod') {
                        let ta = t.arrowFunctionExpression(item.params, item.body, item.async)
                        properties[i] = t.classProperty(item.key, ta, null, null)
                    }
                }
                let stateIdf = []
                for (let i = 0; i < dataObj.properties.length; i++) {
                    const pItemName = dataObj.properties[i].key.name
                    stateIdf.push(t.objectProperty(t.identifier(pItemName), t.identifier(pItemName), false, true))
                }
                //新增一个render函数
                const renderKey = t.identifier('render')
                // const {aaa,bbb,cccc} = this.state
                const renderbody = t.VariableDeclaration('const', [
                    t.VariableDeclarator(
                        t.objectPattern(
                            stateIdf
                        ), t.MemberExpression(
                            t.thisExpression(), t.identifier('state')
                        )
                    )]
                )
                //构造结束
                // console.log(htmlCode)
                // 构造return <div>{code}</div>
                const openEle = t.JSXOpeningElement(t.JSXIdentifier('div'),[])
                const closeEle = t.JSXClosingElement(t.JSXIdentifier('div'))
                const jsxChildText = t.JSXText(htmlCode)
                const returnBody = t.ReturnStatement(t.JSXElement(openEle,closeEle,[jsxChildText],false))
                //
                const renderBlockStatement = t.blockStatement([renderbody,returnBody])
                const renderProperty = t.classMethod('method', renderKey, [], renderBlockStatement)
                //构造结束
                properties.push(renderProperty)
                const claBody = t.classBody(properties)
                const className = t.Identifier('PageClass')
                const extendClassName = t.Identifier('Component')
                const cld = t.exportDefaultDeclaration(t.ClassDeclaration(className, extendClassName, claBody, null))
                path.replaceWith(cld)
            }
        }
    }
}
