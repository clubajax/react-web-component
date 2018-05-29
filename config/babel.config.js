const path = require('path');

const libs = 'no-dash,date-picker,data-table,base-component,react-web-component'.split(',');
const libsToBabelize = new RegExp(libs.filter(lib => !/test/.test(lib)).join('|'));


module.exports = (isProd, ROOT) => {

	const included = libs.map((lib) => {
		let filepath;
		if (/test/.test(lib)) {
			filepath = `./${lib}`;
		} else {
			filepath = `./node_modules/@clubajax/${lib}`;
		}
		return path.join(ROOT, filepath);
	});

	return {
		test: /\.jsx?$/,
		exclude (filepath) {
			if (/node_modules/.test(filepath) && !libsToBabelize.test(filepath)) {
				return true;
			}
			return false;
		},
		// include: included,
		loaders: 'babel-loader',
		query: {
			plugins: [
				'react-hot-loader/babel',
				'@babel/plugin-syntax-dynamic-import',
				'@babel/plugin-proposal-object-rest-spread'
			],
			presets: [
				'@babel/react',
				'@babel/preset-env'
			]
		}
	};
};
