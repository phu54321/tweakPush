const ar = require('ar');
const fs = require('fs');
const xzdec = require('./xzdec');

const debContent = fs.readFileSync('testdata/detailedbatteryusage.deb')
const debAr = new ar.Archive(debContent)

const files = debAr.getFiles();
const dataTarXZContent = files
  .find(f => f.name() === 'data.tar.xz')
  .fileData()


const dataTarContent = xzdec(dataTarXZContent)
console.log(dataTarContent.length)

fs.writeFileSync('testdata/test.tar', dataTarContent)