emcc -O3 ldid.cpp lookup2.c sha1.c sha224-256.c ^
  -s EXPORTED_FUNCTIONS="['_sign', '_dumpEntitlement', '_fopen', '_fclose', '_fwrite', '_fread']" ^
  -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']" ^
  -s MODULARIZE=1 ^
  -o libldid.js
