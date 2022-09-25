const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname + '/dist',
        filename: 'index.js'
    },
    //插件
    plugins: [new HtmlWebpackPlugin({template: 'src/index.html'})],
    target: "node-webkit"
}