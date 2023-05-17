const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
	const attributes = {
		user_id: { type: DataTypes.INTEGER, allowNull: false },
		login_time: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
		ip_address: { type: DataTypes.STRING, allowNull: false },
		is_disabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
	};

	const options = {
		timestamps: false,
		createdAt: false,
		updatedAt: false,
	};

	return sequelize.define('login_history', attributes, options);
}