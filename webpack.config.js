const path=require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');//清除dist文件夹
module.exports = [
  'source-map'
].map(devtool=>({
    mode:'production',
    entry: {
      mpAnalytics:'./src/mpAnalytics.js',//小程序异常收集
      monitor:'./src/analytics.js',//h5异常和性能工具
      analytics:'./lib/index.js',//h5用户行为工具
    },
    output: {
      filename: `[name].js`,
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/dist/',
      library: "[name]",//打包出两个库 行为收集和异常分析
      libraryTarget: 'umd',
      umdNamedDefine: true // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define
    },
    plugins: [
      new CleanWebpackPlugin()
    ],
    devtool,
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }
  
}))