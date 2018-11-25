const path = require( 'path' )

module.exports = {
	mode: 'development',
	devtool: 'source-map',
	target: 'web',
	entry: path.resolve( __dirname, 'src/main.js' ),
	output: {
		path: path.resolve( __dirname, 'dist' ),
		filename: 'bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
		        use: {
		          loader: 'babel-loader',
		        }
			}
		]
	},
}
