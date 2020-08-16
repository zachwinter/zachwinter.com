const webpack = require('webpack')

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/sass/global.scss";`
      }
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        PRODUCTION: JSON.stringify(process.env.NODE_ENV === 'production'),
        DEVELOPMENT: JSON.stringify(process.env.NODE_ENV !== 'production'),
        GOOGLE_ANALYTICS: JSON.stringify(process.env.GOOGLE_ANALYTICS)
      })
    ],
    module: {
      rules: [
        {
          test: /\.worker\.js$/,
          use: { loader: 'worker-loader' }
        }
      ]
    }
  }
}