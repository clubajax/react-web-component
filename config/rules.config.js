const cssFn = require('./css.config');
const babelConfig = require('./babel.config');

module.exports = (isProd, ROOT) => {

	const css = cssFn(isProd);

	const babel = babelConfig(isProd, ROOT);

	const files = {
		test: /\.(jpg|png|svg)$/,
		loader: 'file-loader',
		options: {
			name: '[name].[ext]',
			context: `${ROOT}`
		}
	};
	return [babel, files];
};