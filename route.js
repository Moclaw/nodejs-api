const glob = require('glob');
const path = require('path');

module.exports = function (app) {
	// Load all routes from the `routes` directory
	glob.sync('./routes/*.js').forEach(file => {
		const routerName = path.basename(file, '.js');
		const router = require('./routes/' + routerName);

		// Register the router with the app
		app.use(`/${routerName}`, router);
	});
};
