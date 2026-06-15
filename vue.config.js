const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    port: 8080,
    open: true
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@use "@/assets/styles/variables.scss" as *;`
      }
    }
  }
})
