const path = require('path');
const DtsBundleWebpack = require('dts-bundle-webpack');

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, './dist'),
    libraryTarget: 'commonjs2',
  },
  plugins: [
    new DtsBundleWebpack({
      name: "discord-message-handler",
      main: './src/index.d.ts',
      out: '../dist/index.d.ts',
      removeSource: true,
      outputAsModuleFolder: false
    })    
  ]
};