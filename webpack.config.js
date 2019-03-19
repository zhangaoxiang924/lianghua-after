const {resolve} = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackBar = require('webpackbar')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const autoprefixer = require('autoprefixer')
const OpenBrowserWebpackPlugin = require('open-browser-webpack-plugin')

const ROOT_PATH = resolve(__dirname)
const SRC_PATH = resolve(ROOT_PATH, 'src')
const DIST_PATH = resolve(ROOT_PATH, 'dist')
const LIBS_PATH = resolve(ROOT_PATH, 'libs')
const TEM_PATH = resolve(LIBS_PATH, 'template')

const interfaces = require('os').networkInterfaces()
let IPAddress = ''
for (let devName in interfaces) {
    let iface = interfaces[devName]
    for (let i = 0; i < iface.length; i++) {
        let alias = iface[i]
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
            IPAddress = alias.address
        }
    }
}

module.exports = {
    devtool: 'eval-source-map',
    entry: {
        index: resolve(SRC_PATH, 'index.jsx')
    },
    output: {
        path: DIST_PATH,
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/,
                include: SRC_PATH,
                use: [
                    'babel-loader',
                    'eslint-loader'
                ]
            }, {
                test: /\.(css|scss)?$/,
                include: ROOT_PATH,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [autoprefixer()]
                        }
                    },
                    'sass-loader'
                ]
            }, {
                test: /\.(png|jpg|jpeg|gif|svg|svgz)?$/,
                include: SRC_PATH,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: '[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.scss']
    },
    externals: {
        zepto: '$',
        jquery: '$'
    },
    plugins: [
        new WebpackBar(),
        new StyleLintPlugin(),
        new webpack.ProvidePlugin({
            $: 'zepto' || 'jquery',
            zepto: 'zepto',
            jQuery: 'jquery',
            'window.zepto': 'zepto',
            'window.jQuery': 'jquery'
        }),
        new HtmlWebpackPlugin({
            title: '量化大赛管理后台',
            filepath: DIST_PATH,
            template: resolve(TEM_PATH, 'index.html'),
            chunks: ['index'],
            filename: 'index.html',
            inject: 'body'
        }),
        new OpenBrowserWebpackPlugin({url: `http://${IPAddress}:3010`})
    ],
    devServer: {
        inline: true,
        hot: true,
        historyApiFallback: true,
        contentBase: ROOT_PATH,
        host: IPAddress,
        port: '3010',
        proxy: {
            '/**':{
                target:'http://www.cryptoquanter.com',
                secure: true,
                changeOrigin: true
                // pathRewrite: {
                //  '^/help': ''
                // }
            }
            // '/**':{
            //     target:'http://192.168.84.14:8008',
            //     secure: true,
            //     changeOrigin: true,
            //     pathRewrite: {
            //      '^/mgr': ''
            //     }
            // }
        }
    }
}
