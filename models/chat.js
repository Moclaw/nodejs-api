const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
	const attributes = {
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		user_id: { type: DataTypes.INTEGER, allowNull: false },
		message: { type: DataTypes.STRING(2000), allowNull: false },
		created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
		updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
		is_disabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
	};

	const options = {
		timestamps: false,
		createdAt: false,
		updatedAt: false,
	};

	return sequelize.define('chat', attributes, options);
}