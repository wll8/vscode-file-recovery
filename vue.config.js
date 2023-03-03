const path = require(`path`)

module.exports = {
  runtimeCompiler: false,
  publicPath: process.env.VUE_APP_ENV === `dev` ? `/` : `/`, // 基本路径, 建议以绝对路径跟随访问目录
  outputDir: `./dist`, // 输出文件目录
  pluginOptions: {
    // 第三方插件配置
    'style-resources-loader': {
      preProcessor: `less`,
      patterns: [path.resolve(__dirname, `./src/assets/css/base.less`)], // less所在文件路径
    },
  },
  css: {
    sourceMap: true,
  },
}
