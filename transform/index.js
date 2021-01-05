// const { toHtml } = require('../wxmltohtml')
const wToHtml = require('../wmtohm')
const toCss = require('../wxsstocss')
const toJs = require('../wjstoreactjs')
const path = require('path')
const fs = require('fs-extra')
const findFileExt = require('find-file-ext')
const resolve = file => path.resolve(__dirname, file)
const fileTranOption = {
    'wxml':'html',
    'wxss':'css',
    'js':'js'
}
module.exports = async (sourcePath, savePath) => {
  let rawDirectory = false
  const sourceDir = path.isAbsolute(sourcePath) ? sourcePath : resolve(sourcePath)
  const saveDir = path.isAbsolute(savePath) ? savePath : resolve(savePath)
  const wxmlPaths = await findFileExt([sourceDir], ['wxss','wxml','js'])

  wxmlPaths.forEach(async src => {
    //   console.log(src)
    var extname=path.extname(src).replace('.','')
    const wxmlCon = await fs.readFile(src, 'utf-8')
    let newWxmlCon = ''
    if(extname === 'wxml'){
        // newWxmlCon = wToHtml(wxmlCon)
    }else if(extname === 'wxss'){
        newWxmlCon = toCss(wxmlCon)
    }else if(extname === 'js'){
        const oldhtmlCon = await fs.readFile(src.replace('.js','.wxml'), 'utf-8')
        const nHtmlDom = wToHtml(oldhtmlCon)
        newWxmlCon = toJs(wxmlCon,nHtmlDom)
    }
    const suffixPath = src.replace(sourcePath, '').replace(extname,fileTranOption[extname])
    const savePath = rawDirectory ? path.join(saveDir, path.basename(suffixPath)) : path.join(saveDir, suffixPath)

    // 确保目录存在，否则创建
    await fs.ensureDir(path.dirname(savePath))
    // 写入文件
    await fs.writeFile(savePath, newWxmlCon, 'utf-8')
  })

  return Promise.resolve(wxmlPaths)
}
