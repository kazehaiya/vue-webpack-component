const path = require('path');
// vue-loader 现在需要的插件
const { VueLoaderPlugin } = require('vue-loader');
// 用于清除文件变动时，无用文件残留问题
const CleanWebpackPlugin = require('clean-webpack-plugin');
// 打包压缩项目用的插件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// CSS 单独打包插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 去除 CSS 打包后的 map 文件
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

// 处理路径
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  mode: 'production',
  entry: {
    'my-package': './src/index.js'
  },
  output: {
    path: resolve('lib'),
    publicPath: '',
    filename: '[name].js',
    // 兼容不同的环境，设置 library 属性
    library: 'my-package',
    // 格式设置为 umd 格式，使其同时支持 import 与 require（多格式兼容）
    // 格式包含（var, this, window, umd，见官网）
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src')],
        exclude: [resolve('node_modules')]
      },
      {
        test: /\.(le|sc|sa|c)ss$/,
        use: [
          // 开发环境选择用 vue-style-loader（生产环境使用 MiniCss...）
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ],
        include: [ resolve('src') ]
      },
      {
        test: /\.(png|jpeg|jpg|gif|svg)$/i,
        loader: 'url-loader',
        options: {
          limit: 8192,
          fallback: 'file-loader', // 大于阈值 8K 的自动用 file-loader 处理
          name: '[name].[ext]?[hash]',
          outputPath: 'images/',
          publicPath: ''
        }
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          // 最快压缩模式
          compress: false,
          mangle: true
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    // 提取样式至 css 文件
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    }),
    // 注：放在最后一项，保证在每次打包前最先执行，以免误删（自下而上执行）
    new CleanWebpackPlugin()
  ],
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('./src')
    },
    extensions: ['*', '.js', '.vue']
  },
  // 生产环境的相对最好的压缩方式
  devtool: 'cheap-module-source-map'
};