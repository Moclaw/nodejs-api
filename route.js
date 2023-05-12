const glob = require('glob');
const path = require('path');

module.exports = function (app) {
	glob.sync('./routes/*.js').forEach(file => {
		const routerName = path.basename(file, '.js');
		const router = require('./routes/' + routerName);
		app.use(`/${routerName}`, router);
	});
};
