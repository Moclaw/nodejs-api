const bcrypt = require('bcrypt');
const db = require('../context/dbcontext');
const { where } = require('sequelize');
const config = require('../config.json');
const jwt = require('jsonwebtoken');
class Utils {
	constructor() {
		this.model = db.Users;
	}

	async hashPassword(password) {
		return await bcrypt.hash(password, 8);
	}

	async isPasswordMatch(password, hash) {
		return await bcrypt.compare(password, hash);
	}

	async generateJwtToken(user) {
		return jwt.sign({ sub: user.id }, config.Jwt.secret, { expiresIn: config.Jwt.expiresIn });
	}

}

module.exports = new Utils();