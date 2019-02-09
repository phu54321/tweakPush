cmake_minimum_required (VERSION 2.6)
project (ldid-cmake)

add_executable(ldid ldid.cpp lookup2.c sha1.c)
add_executable(ldid2 ldid2.cpp lookup2.c sha1.c sha224-256.c)
