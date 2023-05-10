const routes = require('express')
const route = routes.Router();

route.get('/', (req, res) => {
	res.send('Hello World!');
}
);

module.exports = route;




