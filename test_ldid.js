const ldid = require('./ldid')
const fs = require('fs')

ldid().then((runtime) => {
  const content = fs.readFileSync('testdata/Cylinder.dylib')
  runtime.writeFile(content, 'temp.dylib')

  content2 = runtime.readFile('temp.dylib')
  console.log(content2.length, content.length)

  runtime.ldid_S('temp.dylib', null)
})
