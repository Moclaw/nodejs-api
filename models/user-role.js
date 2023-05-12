const { DataTypes } = require('sequelize')

module.exports = model;

function model(sequelize) {
	const attributes = {
		user_id: { type: DataTypes.INTEGER, allowNull: false },
		role_id: { type: DataTypes.INTEGER, allowNull: false },
		created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
		is_disabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
	};

	const options = {
		timestamps: false,
		createdAt: false,
		updatedAt: false,
	};

	return sequelize.define('user_role', attributes, options);
}