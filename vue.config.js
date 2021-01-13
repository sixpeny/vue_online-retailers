'use strict';
const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    publicPath: process.env.NODE_ENV === "development" ? "" : "/vue_shop/",
    chainWebpack: config => {

        //配置发布环境的入口文件
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('@/main-prod.js')

            //配置绝对路径
            config.resolve.alias.set('@', resolve('src'))

            //配置 externals 加载外部 CDN 资源
            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                echarts: 'echarts',
                'vue-quill-editor': 'VueQuillEditor'
            })

            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
            })
        })

        //配置开发环境的入口文件
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('@/main-dev.js')

            //配置绝对路径
            config.resolve.alias.set('@', resolve('src'))

            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })
    }
}
