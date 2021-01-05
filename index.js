const wxmlToHtml = require('./transform')
const path = require('path')
const sourcePath = path.resolve(__dirname, './test/wxpage')
const savePath = path.resolve(__dirname, './test/dist')
// Promise
wxmlToHtml(sourcePath, savePath)
  .then(savePaths => {
    console.log(`success: ${savePaths}`)
  })
  .catch(err => {
    console.error(`output file failed: ${err}`)
  })
