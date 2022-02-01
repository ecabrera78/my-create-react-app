const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	entry: './index.js',
	output: {
		filename: './dist/bundle.js',
	},
	resolve: {
		extensions: ['.js', '.jsx'],
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader',
					},
				],
			},
			{
				test: /\.css|.styl$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					'css-loader',
					'style-loader',
				],
			},
		],
	},
	devServer: {
		historyApiFallback: true,
		port: 8090,
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: './public/index.html',
			filename: './dist/index.html',
		}),
		new MiniCssExtractPlugin({
			filename: 'assets/[name].css',
		}),
	],
};
