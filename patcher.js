const ar = require('ar');
const fs = require('fs');
const xzdec = require('./xzdec');
const untar = require('untar.js');
const iconv = require('iconv-lite');
const ldid = require('./ldid');
const jszip = require('jszip')
const { decompress: lzmadec } = require('lzma/src/lzma_worker-min').LZMA
const os = require('os')
const process = require('process')

if (process.argv.length <= 2) {
  console.log(`Usage: ${process.argv[0]} ${process.argv[1]} [.deb file]`)
  process.exit(-1)
}

const ifname = process.argv[2]
if (!ifname.endsWith('.deb')) {
  console.log('Not a deb file')
  process.exit(-1)
}

const ofname = ifname.substr(0, ifname.length - 4) + '.patched.zip'

ldid().then(async runtime => {
  const debContent = fs.readFileSync(ifname)
  const debAr = new ar.Archive(debContent)

  const files = debAr.getFiles();
  files.forEach(f => {
    console.log(f.name(), f.fileSize())
  })
  const dataF = files
    .find(f => f.name().startsWith('data.tar'))
  const dataTarCompressed = dataF.fileData()

  let dataTarContent
  if (dataF.name().endsWith('.xz')) {
    dataTarContent = xzdec(dataTarCompressed)
  } else if (dataF.name().endsWith('.lzma')) {
    dataTarContent = lzmadec(dataTarCompressed)
  }
  const dataFiles = untar.untar(dataTarContent)


  // dylib patch
  const dylibPatchedFiles = dataFiles.map(f => {
    let { name, fileData } = f
    if (name.startsWith('./')) name = name.substr(2)
    console.log(name, fileData.length)
    if (
      (
        (
          name.startsWith('Library/MobileSubstrate/DynamicLibraries/') ||
          name.startsWith('usr/lib/')
         ) &&
        name.endsWith('.dylib')
      ) ||
      name.match(/$Library\/PreferenceBundles\/.+\/.+/)
    ) {
      console.log(` - applying ldid`)

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
      runtime.ldid_S('temp.dylib', null)
      fileData = runtime.readFile('temp.dylib')
    }

    if (name.endsWith('.dylib')) {
      console.log(` - applying ldid2`)

      runtime.writeFile(fileData, 'temp.dylib')
      runtime.ldid2_S('temp.dylib', null)
      fileData = runtime.readFile('temp.dylib')
    }

    return { name, fileData }
  })

  const zip = new jszip()
  dylibPatchedFiles.forEach(({name, fileData}) => {
    zip.file(name, fileData)
  })

  zip
    .generateNodeStream({
      type: 'nodebuffer',
      compression: 'deflate',
      streamFiles: true
  })
    .pipe(fs.createWriteStream(ofname))
    .on('finish', function () {
      console.log("done!");
    });
})
