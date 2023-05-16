const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {

	const attributes = {
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		name: { type: DataTypes.STRING, allowNull: false },
		created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
		updated_at: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
		is_disabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
	};

	const options = {
		timestamps: false,
		createdAt: false,
		updatedAt: false,
	};

	return sequelize.define('roles', attributes, options);
}