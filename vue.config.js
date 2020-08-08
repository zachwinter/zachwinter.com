module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/sass/global.scss";`
      }
    }
  }
}