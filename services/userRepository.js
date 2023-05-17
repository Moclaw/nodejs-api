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
	async authenticate({ username, password, ip }) {
		const user = await db.Users.findOne({ where: { username } });
		if (!user || !(await Utils.isPasswordMatch(password, user.password)))
			throw 'Username or password is incorrect';
		const result = {
			...user.get(),
			token: await Utils.generateJwtToken(user),
		};

		db.LoginHistory.create({ user_id: user.id, ip_address: ip });


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

	async logout({ user_id }) {
		const user = await db.Users.findOne({ where: { id: user_id } });
		if (!user)
			throw 'User not found';
		db.LoginHistory.update({ is_disabled: true }, { where: { user_id: user_id } });
		user.refresh_token = null;
		await user.save();
	}

}

module.exports = userRepository;