let reg = /[\s,:,-]\d*rpx/g
module.exports = (css)=>{
    while(res = reg.exec(css)){
        let index = res.index
        let rpxPix = res[0]
        let num = +rpxPix.replace('rpx','').trim()
        let remPix = `${(num/100).toFixed(2)}rem`
        css = `${css.slice(0,index)} ${remPix}${css.slice(index+rpxPix.length,css.length)}`
    }
    return css
}