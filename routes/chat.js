const routes = require('express')
const route = routes.Router();


route.post('/create', (req, res) => {
	res.send('Got a POST request');
}
);

module.exports = route;