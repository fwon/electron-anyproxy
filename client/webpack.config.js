var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var isPro = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),        //真实存放路径
    publicPath: isPro ? 
                path.resolve(__dirname, './dist') : //发布引用路径
                '/dist/',                           //开发引用路径
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
            loaders: {
                css: 'style-loader!css-loader!less-loader'
                // ExtractTextPlugin.extract({
                //     use: ['css-loader', 'less-loader'],
                //     fallback: 'vue-style-loader'
                // })
            }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
        // use: ExtractTextPlugin.extract({
        //   fallback: 'style-loader',
        //   //resolve-url-loader may be chained before sass-loader if necessary 
        //   use: ['css-loader', 'less-loader']
        // })
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'url-loader',
        query: {
            name: '[name].[ext]'
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
        loader: 'file-loader',
        query: {
          name: '/[name].[ext]'
        }
      }
    ]
  },
//   plugins: [
//     new ExtractTextPlugin('style.css')
//   ],
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
    
  ])
}