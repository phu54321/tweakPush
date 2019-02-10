// vueTransformerPlugin.js
var semver = require('semver')
var vueNaiveScripts = require('vue-native-custom-transformer-plugin')
var reactNativeVersionString = require('react-native/package.json').version
var reactNativeMinorVersion = semver(reactNativeVersionString).minor

let upstreamTransformer
if (reactNativeMinorVersion >= 56) {
  upstreamTransformer = require('metro/src/reactNativeTransformer')
} else if (reactNativeMinorVersion >= 52) {
  upstreamTransformer = require('metro/src/transformer')
} else if (reactNativeMinorVersion >= 47) {
  upstreamTransformer = require('metro-bundler/src/transformer')
} else if (reactNativeMinorVersion === 46) {
  upstreamTransformer = require('metro-bundler/build/transformer')
} else {
  // handle RN <= 0.45
  var oldUpstreamTransformer = require('react-native/packager/transformer')
  upstreamTransformer = {
    transform ({ src, filename, options }) {
      return oldUpstreamTransformer.transform(src, filename, options)
    }
  }
}
var vueExtensions = ['vue'] // <-- Add other extensions if needed.

module.exports.transform = function ({ src, filename, options }) {
  if (vueExtensions.some(ext => filename.endsWith('.' + ext))) {
    return vueNaiveScripts.transform({ src, filename, options })
  }
  return upstreamTransformer.transform({ src, filename, options })
}