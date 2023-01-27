const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
const config = {
	host: '103.200.23.179',
	user: 'moclamco_admin_db',
	password: '862002Cong$',
	database: 'moclamco_database',
	port: 3306,
}
module.exports = db = {};

initialize();

async function initialize() {
	// create db if it doesn't already exist

	const connection = await mysql.createConnection(config);

	await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`);

	// connect to db
	const sequelize = new Sequelize(config.database, config.user, config.password, {
		host: config.host,
		dialect: 'mysql',
		logging: false,
	});
	// init models and add them to the exported db object
	db.GetInfor = require('../models/getinfor.model')(sequelize);

	// sync all models with database
	await sequelize.sync({ alter: true });
}