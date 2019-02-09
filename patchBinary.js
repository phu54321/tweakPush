const iconv = require('iconv-lite')

module.exports = function (runtime, fileData) {
  let data = iconv.decode(fileData, 'binary')
  data = data.replace(/\/Library\//g, '/var/LIB/')
  data = data.replace(/\/System\/var\/LIB\//g, '/System/Library/')
  data = data.replace(/%@\/var\/LIB\//g, '%@/Library/')
  data = data.replace(/mobile\/var\/LIB\//g, 'mobile/Library/')
  data = data.replace(/\/usr\/lib\/libsubstrate/g, '/var/ulb/libsubstrate')
  data = data.replace(/\/usr\/lib\/libsubstitute/g, '/var/ulb/libsubstitute')
  data = data.replace(/\/usr\/lib\/libprefs/g, '/var/ulb/libprefs')
  const patchedData = iconv.encode(data, 'binary')

  runtime.writeFile(patchedData, 'temp.dylib')
  if (
    runtime.ldid_S('temp.dylib', null) !== 0 ||
    runtime.ldid2_S('temp.dylib', null) !== 0
  ) {
    console.log('ldid failed! Patcher failed.')
    throw new Error('ldid failed')
  }
  fileData = runtime.readFile('temp.dylib')
  return fileData
}
