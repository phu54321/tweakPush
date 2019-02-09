const untar = require('./untar')

const xzdec = require('./xzdec')
const { inflate: gzdec } = require('pako')
const { decompress: lzmadec } = require('lzma/src/lzma_worker-min').LZMA

module.exports = function (tarName, tarData) {
  let dataTarContent
  if (tarName.endsWith('/')) {
    tarName = tarName.substr(0, tarName.length - 1)
  }
  if (tarName === 'data.tar') {
    dataTarContent = tarData
  } else if (tarName.endsWith('.xz')) {
    dataTarContent = xzdec(tarData)
  } else if (tarName.endsWith('.lzma')) {
    dataTarContent = lzmadec(tarData)
  } else if (tarName.endsWith('.gz')) {
    dataTarContent = gzdec(tarData)
  }
  return untar.untar(dataTarContent)
}
