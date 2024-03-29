const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
const config = require('../config.json');

module.exports = db = {};

initialize();

async function initialize() {
	// create db if it doesn't already exist
	const { host, port, user, password, database } = config.database;
	const connection = await mysql.createConnection({ host, port, user, password });
	await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

	// connect to db
	const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });
	// init models and add them to the exported db object
	db.Users = require('../models/user')(sequelize);
	db.Chat = require('../models/chat')(sequelize);
	db.LoginHistory = require('../models/login-history')(sequelize);
	db.Roles = require('../models/roles')(sequelize);
	db.UserRole = require('../models/user-role')(sequelize)

	// define relationships
	db.Users.hasMany(db.Chat, { foreignKey: 'user_id' });
	db.Chat.belongsTo(db.Users, { foreignKey: 'user_id' });
	db.LoginHistory.belongsTo(db.Users, { foreignKey: 'user_id' });
	db.UserRole.belongsTo(db.Users, { foreignKey: 'user_id' })
	db.Roles.hasMany(db.UserRole, { foreignKey: 'role_id' })

	// sync all models with database
	await sequelize.sync({ alter: true });
}