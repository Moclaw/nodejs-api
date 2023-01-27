const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
	const attributes = {
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		ip: { type: DataTypes.STRING, allowNull: true },
		name: { type: DataTypes.STRING, allowNull: true },
		location: { type: DataTypes.STRING, allowNull: true },
		time_log: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
	};

	const options = {
		// disable default timestamp fields (createdAt and updatedAt)
		timestamps: false,
		createdAt: false,
		updatedAt: false,
	};

	return sequelize.define('get_infor', attributes, options);
}