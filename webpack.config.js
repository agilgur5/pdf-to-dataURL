module.exports = {
  entry: './index.es6',
  output: {
    path: './build',
    filename: 'index.js',
    library: 'pdfToDataURL',
    libraryTarget: 'umd'
  },
  // don't bundle non-relative packages
  externals: /^[^.]/,
  module: {
    loaders: [{
      test: /\.es6$/, loader: 'babel-loader',
      query: {presets: ['es2015', 'stage-2']}
    }]
  }
}
