const user = require('../models/user');
const BaseService = require('./base');

class UserService extends BaseService {
	constructor() {
		super(user);
	}
}

module.exports = UserService;