module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/sass/global.scss";`
      }
    }
  },
  configureWebpack: {
    optimization: {
      splitChunks: false
    }
  },
  chainWebpack: config => {
    // This exists to make the devserver work in safari. It was caching changes like a bitch.
    if (process.env.NODE_ENV === 'development') {
      config.output.filename('[name].[hash].js').end() 
    }

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
  }
}  