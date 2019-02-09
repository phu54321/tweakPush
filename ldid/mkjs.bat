emcc ldid.cpp lookup2.c sha1.c sha224-256.c ^
  -s EXPORTED_FUNCTIONS="['_ldid_S', '_ldid_e', '_fopen', '_fclose', '_fwrite', '_fread', '_ftell', '_fseek']" ^
  -s "EXTRA_EXPORTED_RUNTIME_METHODS=['cwrap']" ^
  -s TOTAL_MEMORY=256MB ^
  -s MODULARIZE=1 ^
  -s DISABLE_EXCEPTION_CATCHING=0 ^
  -o libldid.js
