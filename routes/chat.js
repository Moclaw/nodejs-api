const routes = require('express')
const route = routes.Router();

route.get('/', (req, res) => {
	res.send('Hello World!');
}
);

route.post('/create', (req, res) => {
	res.send('Got a POST request');
}
);

module.exports = route;