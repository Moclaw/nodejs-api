const { DataTypes } = require('sequelize');


function model(sequelize) {
	const attributes = {
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		conversation_id: { type: DataTypes.INTEGER, allowNull: false },
		sender_id: { type: DataTypes.INTEGER, allowNull: false },
		receiver_id: { type: DataTypes.INTEGER, allowNull: false },
		message: { type: DataTypes.STRING(2500), allowNull: false },
		created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
		is_disabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
	}

	const options = {
		timestamps: false,
		createdAt: false,
		updatedAt: false,
	};

	return sequelize.define('messages', attributes, options);
}
module.exports = model;
