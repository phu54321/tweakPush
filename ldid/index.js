module.exports = function () {
  return new Promise(resolve => {
    const libldid = require('./libldid')
    libldid().then(ldid => {
      resolve({
        ldid,

        // memory-related
        HEAPU8: ldid.HEAPU8,
        malloc: ldid._malloc,
        free: ldid._free,

        // file-related
        fopen: ldid.cwrap('fopen', 'number', ['string', 'string']),
        fclose: ldid.cwrap('fclose', 'number', ['number']),
        fwrite: ldid.cwrap('fwrite', 'number', ['number', 'number', 'number', 'number']),
        fread: ldid.cwrap('fread', 'number', ['number', 'number', 'number', 'number']),
        ftell: ldid.cwrap('ftell', 'number', ['number']),
        fseek: ldid.cwrap('fseek', 'number', ['number', 'number', 'number']),

        // file helper
        writeFile(content, path) {
          const ptr = this.malloc(content.length)
          this.HEAPU8.set(content, ptr)
          const fp = this.fopen(path, 'wb')
          this.fwrite(ptr, 1, content.length, fp)
          this.fclose(fp)
          this.free(ptr)
        },

        readFile(path) {
          const fp = this.fopen(path, 'rb')
          this.fseek(fp, 0, 2 /* SEEK_END */)
          const fsize = this.ftell(fp)
          this.fseek(fp, 0, 0 /* SEEK_SET */)

          const ptr = this.malloc(fsize)
          this.fread(ptr, 1, fsize, fp)
          this.fclose(fp)

          const ret = this.HEAPU8.slice(ptr, ptr + fsize)
          this.free(ptr)

          return ret
        }
      })
    })
  })
}
