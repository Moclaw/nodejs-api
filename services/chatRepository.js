const db = require('../context/dbcontext');
const baseRepository = require('./baseRepository');
const { where } = require('sequelize');
class chatRepository extends baseRepository {
	constructor(model) {
		super(db.Conversations);
		this.model = db.Conversations;
	}
	async adminGetAll() {
		return await db.Conversations.findAll({
			order: [
				['id', 'DESC']
			],
			include: [{
				model: db.Messages,
				attributes: ['id', 'message', 'created_at', 'user_id']
			}],
			where: [{ is_disabled: false }],
		});
	}
	async getAllByUserId(userId) {
		return await db.Conversations.findAll({
			order: [
				['created_at', 'DESC']
			],
			include: [{
				model: db.Messages,
				attributes: ['id', 'message', 'created_at', 'sender_id', 'receiver_id', 'conversation_id'],
				order: [
					['created_at', 'DESC']
				],
				limit: 1,
			}],
			where: [{ is_disabled: false, user_id: userId }],
		});
	}
	async send({ conversation_id, sender_id, message, receiver_id }) {
		console.log(conversation_id, sender_id, message, receiver_id);
		const msg = new db.Messages({ conversation_id, sender_id, message, receiver_id });
		await msg.save();
		return msg;
	}
	async createConversation({ user_id, name }) {
		const conversation = new this.model({ user_id, name });
		await conversation.save();
		return conversation;
	}
	async conversation(id) {
		const result = await db.Conversations.findOne({
			include: [{
				model: db.Messages,
				attributes: ['id', 'message', 'created_at', 'sender_id', 'receiver_id', 'conversation_id'],
				order: [
					['created_at', 'DESC']
				],
				where: [{ is_disabled: false, }],
			}],
			where: [{ is_disabled: false, id: id }],
		});
		return result ? result : null;
	}

}

module.exports = chatRepository;