const routes = require('express')
const route = routes.Router();
const DefaultResponse = require('../utils/default');
const models = require('../models/user');
const UserService = require('../services/user.service');
const userService = new UserService(models);
const QueryFlag = require('../utils/queryflag');

route.get('/', (req, res) => {
	const result = userService.getAll(QueryFlag.Flag.NONE);
	res.json(new DefaultResponse({ message: 'Success', data: result }));
});

route.post('/create', (req, res) => {
	res.send('Got a POST request');
}
);

module.exports = route;




