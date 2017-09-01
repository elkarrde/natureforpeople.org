var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var options = {
	entry: {
		'app': './js/main.js',
		'styles': './scss/main.scss'
	},
	output: {
		path: path.dirname(__dirname) + '/assets/static/gen',
		filename: '[name].js'
	},
	devtool: '#cheap-module-source-map',
	resolve: {
		extensions: ['.js'],
		alias: {
			'vue$': 'vue/dist/vue.js' // 'vue/dist/vue.common.js' for webpack 1
		}
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader!sass-loader'})
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader'})
			},
			{
				test: /\.woff2?$|\.ttf$|\.eot$|\.svg$|\.png|\.jpe?g\|\.gif$/,
				loader: 'file'
			}
		]
	},
	plugins: [
		new ExtractTextPlugin({filename: 'styles.css',
			allChunks: true
		}),
 		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"',
				KB_URL: JSON.stringify(process.env.KB_URL || "http://127.0.0.1:3000")
			}
		}),
 		new webpack.optimize.UglifyJsPlugin()
	]
};

module.exports = options;
