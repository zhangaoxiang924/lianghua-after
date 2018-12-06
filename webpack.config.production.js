const {resolve} = require('path')
const webpack = require('webpack')
// const SftpWebpackPlugin = require('sftp-webpack-plugin')
// const WebpackSftpClient = require('webpack-sftp-client');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const autoprefixer = require('autoprefixer')

const ROOT_PATH = resolve(__dirname)
const SRC_PATH = resolve(ROOT_PATH, 'src')
const DIST_PATH = resolve(ROOT_PATH, 'dist')
const LIBS_PATH = resolve(ROOT_PATH, 'libs')
const TEM_PATH = resolve(LIBS_PATH, 'template')

module.exports = {
    devtool: 'cheap-module-source-map',
    entry: {
        index: resolve(SRC_PATH, 'index.jsx'),
        vendors: [
            'antd',
            'axios',
            'babel-polyfill',
            'react',
            'react-dom',
            'react-redux',
            'react-router',
            'react-router-redux',
            'redux-devtools-extension',
            'redux',
            'redux-thunk'
        ]
    },
    output: {
        path: DIST_PATH,
        filename: 'js/[name]-[hash:8].js',
        chunkFilename: 'js/[name]-[chunkhash:8].js',
        publicPath: '../'
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
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [autoprefixer()]
                            }
                        },
                        'sass-loader'
                    ]
                })
            }, {
                test: /\.(png|jpg|jpeg|gif|svg|svgz)?$/,
                include: SRC_PATH,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'img/[name]-[hash:8].[ext]?'
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
        new StyleLintPlugin(),
        new UglifyJSPlugin({
            compress: {
                warnings: false,
                drop_console: false
            },
            beautify: false,
            comments: false,
            extractComments: false,
            sourceMap: false
        }),
        new CleanWebpackPlugin([DIST_PATH], {
            root: '',
            verbose: true,
            dry: false
        }),
        new webpack.ProvidePlugin({
            $: 'zepto' || 'jquery',
            zepto: 'zepto',
            jQuery: 'jquery',
            'window.zepto': 'zepto',
            'window.jQuery': 'jquery'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production'),
                'BABEL_ENV': JSON.stringify('production')
            }
        }),
        new ExtractTextPlugin({
            filename: 'css/[name]-[contenthash:8].css',
            disable: false,
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            filename: 'js/[name]-[hash:8].js',
            names: ['vendors']
        }),
        new HtmlWebpackPlugin({
            title: '火星财经管理后台',
            keywords: '火星财经管理后台',
            description: '火星财经管理后台',
            filepath: DIST_PATH,
            template: resolve(TEM_PATH, 'index.html'),
            chunks: ['index', 'vendors'],
            filename: 'index.html',
            inject: 'body'
        }),
        /*
        new WebpackSftpClient({
            port: '22',
            host: '47.52.210.208',
            username: 'root',
            password: 'S3]%n8XH]n9n',
            path: './dist/',
            remotePath: '/data/www/mgr.huoxing24.com',
            verbose: true
        })
        */
        /* new WebpackSftpClient({
            port: '22',
            host: '192.168.252.22',
            username: 'liuleipeng',
            password: 'liuleipeng',
            path: './dist/',
            remotePath: '/data/www/admin.linekonguat.com',
            // Show details of uploading for files
            verbose: true
        }) */
        /* new SftpWebpackPlugin({
            port: '22',
            host: '192.168.252.22',
            username: 'liuleipeng',
            password: 'liuleipeng',
            from: DIST_PATH,
            to: '/data/www/'
        }) */
    ]
}
