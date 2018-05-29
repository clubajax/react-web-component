let css;

function createCss (isProd) {

	if (!css) {
		const rules = {
			main: {
				test: /\.s?css$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: { sourceMap: true }
					},
					{
						loader: 'sass-loader',
						options: { sourceMap: true }
					}
				]
			}
		};
		css = {
			rules
		};
	}
	return css;
}

module.exports = function cssConfig (isProd) {
	return createCss(isProd);
};
