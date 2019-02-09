const ldid = require('./libldid')

ldid().then((ldid) => {
  const fopen = ldid.cwrap('fopen', 'number', ['string', 'string'])
  const fclose = ldid.cwrap('fclose', 'number', ['number'])
  const fwrite = ldid.cwrap('fwrite', 'number', ['array', 'number', 'number', 'number'])
  const fread = ldid.cwrap('fread', 'number', ['array', 'number', 'number', 'number'])
  
  const data = new Uint8Array([1, 2, 3, 4])
  let fp = fopen('test.txt', 'wb')
  fwrite(data, 4, 1, fp)
  fclose(fp)
  fp = null

  const fp2 = fopen('test.txt', 'rb')
  const data2 = new Uint8Array(4)
  fread(data2, 4, 1, fp2)
  fclose(fp2)

  console.log(data, data2)
})
