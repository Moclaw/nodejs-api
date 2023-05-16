const baseRepository = require('./baseRepository');
const db = require('../context/dbcontext');
const { where } = require('sequelize');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const Utils = require('../utils/utills');

class userRepository extends baseRepository {
	constructor(model) {
		super(db.Users);
		this.model = db.Users;
	}

	async overrideGetAll() {
		return await db.Users.findAll({
			order: [
				['id', 'DESC']
			],
			include: [{
				model: db.Roles,
				attributes: ['id', 'name']
			}],
			where: [{ is_disabled: false }],
		});

	}

	async getAllRoles() {
		return await db.Roles.findAll();
	}
	async authenticate({ username, password }) {
		const user = await db.Users.findOne({ where: { username } });
		if (!user || !(await Utils.isPasswordMatch(password, user.password)))
			throw 'Username or password is incorrect';

		const token = await Utils.generateJwtToken(user);
		const result = {
			...user.get(),
			token
		};
		return result;
	}

	async register({ username, password, first_name, last_name, email, phone }) {
		if (await db.Users.findOne({ where: { username: username } })) {
			throw 'Username "' + username + '" is already taken';
		}
		const role = await db.Roles.findOne({ where: { name: 'user' } });

		const roleJson = JSON.stringify(role);
		console.log(roleJson);

		const role_id = role.id || 1;
		const user = new db.Users({ username, first_name, last_name, email, phone, role_id });
		user.password = await Utils.hashPassword(password);

		await user.save();
		const result = {
			...user.get(),
			token: await Utils.generateJwtToken(user)
		};
		return result;
	}

}

module.exports = userRepository;