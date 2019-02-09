emcc -O3 ldid.cpp lookup2.c sha1.c sha224-256.c ^
  -s EXPORTED_FUNCTIONS="['_sign', '_dumpEntitlement', '_fopen', '_fclose', '_fwrite', '_fread', '_ftell', '_fseek']" ^
  -s "EXTRA_EXPORTED_RUNTIME_METHODS=['cwrap']" ^
  -s TOTAL_MEMORY=256MB ^
  -s MODULARIZE=1 ^
  -o libldid.js
