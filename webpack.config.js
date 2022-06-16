const path = require('path');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const build_folder = "./src/"
const production_folder = "./prod/"

const config = {
	entry: {
		variation_1: `${build_folder}variation_1/index.js`,
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, production_folder)
	},
	mode: 'production',
	devtool: false,
	optimization: {
        minimize: true,
		minimizer: [
			new TerserPlugin()
		]
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.html$/,
				use: {
					loader: 'html-loader'
				}
			},
			{
				test: /\.svg$/,
				use: {
					loader: 'svg-inline-loader'
				}
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader',
					'postcss-loader'
				]
			},
			{
				test: /\.scss$/,
				use: [
					'css-loader',
					'sass-loader',
					'postcss-loader'
				]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin()
	]
};

module.exports = config;