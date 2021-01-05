let htmlOptions = require('./tag-options')
let t = require('@babel/types');
module.exports = {
    JSXIdentifier(path){
        var {node} = path;
        let keys = Object.keys(htmlOptions)
        if(keys.includes(node.name)){
            node.name = htmlOptions[node.name]
        }
    },
    JSXAttribute(path){
        const {node} = path
        let {name} = node.name
        if(name === 'class' || name === 'my-class'){
            node.name.name ='className'
            if(node.value.value && node.value.value.length>0){
                // class="tags-nav-item {{zz ? 'active' : ''}}" => className={`tags-nav-item ${zz ? 'active' : ''}`}
                let str = node.value.value
                if(/{(.*?)}/g.test(str) ){
                    let c = str.replace(/{(.*?)}/g,'${$1}')
                    node.value = t.JSXExpressionContainer(t.TemplateLiteral([
                        t.TemplateElement({raw:c,cooked:c},false)
                    ],[]))
                }
            }
        }
    },
    // wx:if wx:for wx:elif
    JSXElement(path){
        const {node}=path
        const {children} = node
        const {attributes} = node.openingElement
        // let removeJsxText = children.filter(ele=>ele.type==='JSXElement')
        // for(let j = 0 ; j < removeJsxText.length;j++){
        //     let childItem = removeJsxText[j]
        //     let attrs = childItem.openingElement.attributes
        // }
        for(let i = 0 ; i < attributes.length;i++){
            let item = attributes[i]
            if(item.name.type === 'JSXNamespacedName'){
                const namespace = item.name.namespace.name
                const name = item.name.name.name
                // 对wx:if wx:elif的处理
                if(namespace === 'wx'){
                    let itemName = name === 'for-item'? item.value.value : 'item'
                    if(name === 'if' || name === 'elif'){
                        node.openingElement.attributes.splice(i,1)
                        let val = item.value.value.replace(/{(.*?)}/g,'$1')
                        let rAstTree = t.jSXExpressionContainer( t.ConditionalExpression(t.Identifier(val),
                            t.JSXElement(node.openingElement,node.closingElement,node.children,node.selfClosing)
                            ,t.nullLiteral()))
                        path.replaceWith(rAstTree)
                    }else if(name === 'for'){
                        // 对 wx:for 进行处理
                        node.openingElement.attributes.splice(i,1)
                        let val = item.value.value.replace(/{(.*?)}/g,'$1').trim()
                        let rAstTree = t.JSXExpressionContainer(t.CallExpression(t.MemberExpression(t.Identifier(val),t.Identifier('map'),false,false),
                            [t.ArrowFunctionExpression([t.Identifier(itemName),t.Identifier('index')],t.BlockStatement([
                                t.ReturnStatement(t.JSXElement(node.openingElement,node.closingElement,node.children,node.selfClosing))
                            ]))]))
                        path.replaceWith(rAstTree)
                    }
                }
            }
        }

    },
    JSXNamespacedName(path){
        const {node} = path
    }
}
