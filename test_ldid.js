const ldid = require('./ldid')

ldid().then((runtime) => {
  runtime.writeFile(new Uint8Array([1, 2, 3, 4]), 'test')
  const data = runtime.readFile('test')
  console.log(data)
})
