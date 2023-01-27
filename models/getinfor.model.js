const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
	const attributes = {
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		ip: { type: DataTypes.STRING, allowNull: true },
		name: { type: DataTypes.STRING, allowNull: true },
		country: { type: DataTypes.STRING, allowNull: true },
		region: { type: DataTypes.STRING, allowNull: true },
		city: { type: DataTypes.STRING, allowNull: true },
		latitude: { type: DataTypes.STRING, allowNull: true },
		longitude: { type: DataTypes.STRING, allowNull: true },
		point: { type: DataTypes.STRING, allowNull: true },
		map: { type: DataTypes.STRING, allowNull: true },
		metro: { type: DataTypes.STRING, allowNull: true },
		area_code: { type: DataTypes.STRING, allowNull: true },
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