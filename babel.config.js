module.exports = function(api) {
	api.cache.never()
	return {
		"presets": [
		  [
			"@babel/preset-env",
			{
			  "modules": false
			}
		  ]
		],
		"plugins": [
		  "@babel/plugin-transform-parameters",
		  "@babel/plugin-transform-arrow-functions"
		]
	  };
  }