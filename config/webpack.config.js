const server = require('./server.config');

const ROOT = `${__dirname}/..`;
const PORT = '8081';
const ENV = process.env.API;

console.log('ROOT', ROOT);

const isProd = false;
const appFiles = ['./test/test.jsx'];
const appName = isProd ? '[name].[chunkhash].js' : '[name].js';
let vendorFiles = ['react'];

if (!isProd) {
	vendorFiles = [...vendorFiles,
		'webpack-dev-server/client?http://0.0.0.0:' + PORT
	];

	if (ENV !== 'vm') {
		vendorFiles = [...vendorFiles, 'react-hot-loader/patch', 'webpack/hot/only-dev-server']
	}
}

if (!isProd) {
	process.traceDeprecation = true;
}

const config = {
	mode: 'development',
	context: `${ROOT}`,
	entry: {
		vendor: vendorFiles,
		app: appFiles
	},
	output: {
		filename: appName,
		path: ROOT,
		publicPath: `http://localhost:${PORT}/`
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {
					name: "vendor",
					test: /node_modules/,
					enforce: true
				}
			}
		}
	},

	module: {
		rules: require('./rules.config')(isProd, ROOT)
	},

	plugins: require('./plugins.config')(isProd, ROOT),

	//devtool: 'inline-source-map',

	devServer: server(ROOT)
};

module.exports = config;
