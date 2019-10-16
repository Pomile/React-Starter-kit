const path = require('path');
const webpack = require('./node_modules/webpack');
const HtmlWebpackPlugin = require('./node_modules/html-webpack-plugin');
const UglifyJSPlugin = require('./node_modules/uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('./node_modules/mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('./node_modules/clean-webpack-plugin');


const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
    mode: process.env.NODE_ENV,
    context: path.resolve(__dirname, 'src'),
    entry: {
        main: './index.js',
    },
    devtool: devMode ? 'inline-source-map' : '',
    devServer: {
        contentBase: __dirname,
        port: 8080,
        hot: true
    },
    optimization: devMode ? {} : {
        minimizer: [
            new UglifyJSPlugin({
                sourceMap: true,
            }),
        ],
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'build'),
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            modules: true,
                            localsConvention: 'asIs'
                        },
                    },
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            importLoaders: 1,
                            modules: true,
                            localsConvention: 'asIs'
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpg|gif|ico)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: devMode ? '[name].bundle.[ext]' : '[hash].[ext]',
                            outputPath: 'images',
                        },
                    },
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader'],
            },
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                },
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        }),
        new HtmlWebpackPlugin({
            title: 'Home',
            filename: 'index.html',
            template: 'index.html',
        }),
        new CleanWebpackPlugin(),
        devMode ? new webpack.NamedModulesPlugin() : '',
        devMode ? new webpack.HotModuleReplacementPlugin() : '',
    ],
};
