const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cssFn = require('./css.config');
const pkg = require('../package.json');

module.exports = function plugins (isProd, ROOT) {

	const css = cssFn(isProd);

	const ENV = isProd ? 'production' : process.env.API === 'dev' ? 'dev' : process.env.API;

	const hmr = new webpack.HotModuleReplacementPlugin();
	const html = new HtmlWebpackPlugin({
		title: 'Test',
		filename: 'test/index.html',
		template: 'test/index.html'
	});

	return [html, hmr];
};
