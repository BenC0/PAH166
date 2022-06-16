const autoprefixer = require('autoprefixer');
const postcssNesting = require('postcss-nesting');
const cssnano = require('cssnano');
const cssnanoConfig = {
    preset: 'default',
}

module.exports = {
	plugins: [
        require('postcss-partial-import')({}),
		postcssNesting(),
		autoprefixer({ grid: true }),
		require('postcss-hocus'),
		cssnano(cssnanoConfig),
	]
}