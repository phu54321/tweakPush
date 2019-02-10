module.exports = {
  transformer: {
    babelTransformerPath: require.resolve('./vueTransformerPlugin.js')
  },
  resolver: {
    sourceExts: ['vue', 'js', 'json', 'ts', 'tsx', 'jsx']
  }
}
