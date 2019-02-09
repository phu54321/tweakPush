const ldid = require('./libldid')

ldid().then((ldid) => {
  const fopen = ldid.cwrap('fopen', 'number', ['string', 'string'])
  const fclose = ldid.cwrap('fclose', 'number', ['number'])
  const fwrite = ldid.cwrap('fwrite', 'number', ['number', 'number', 'number', 'number'])
  const fread = ldid.cwrap('fread', 'number', ['number', 'number', 'number', 'number'])

  const ptr = ldid._malloc(4)
  ldid.HEAPU8.set([1, 2, 3, 4], ptr)
  const fp = fopen('test.txt', 'wb')
  fwrite(ptr, 4, 1, fp)
  fclose(fp)
  ldid._free(ptr)

  const ptr2 = ldid._malloc(4)
  const fp2 = fopen('test.txt', 'rb')
  fread(ptr2, 4, 1, fp2)
  fclose(fp2)
  const data = ldid.HEAPU8.slice(ptr2, ptr2 + 4)

  console.log(data)
})
