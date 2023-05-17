const routes = require('express')
const route = routes.Router();
const chatRepository = require('../services/chatRepository');
const DefaultResponse = require('../utils/default');
const authorize = require('../utils/authorize');
const db = require('../context/dbcontext');

route.use(authorize());

route.get('/getconversation', getConversation);
route.get('/adminConversation', admingetConversation);
route.post('/create', createConversation);

route.post('/send', sendMessage);

route.get('/conversation/:id', conversation);




function createConversation(req, res, next) {
	const chatRepo = new chatRepository();
	const { user_id, name } = req.body;
	chatRepo.createConversation({ user_id, name })
		.then(chat => res.json(new DefaultResponse(chat, 'Success')))
		.catch(next);
}

function getConversation(req, res, next) {
	const chatRepo = new chatRepository();
	const user_id = req.user.id;
	chatRepo.getAllByUserId(user_id)
		.then(chat => res.json(new DefaultResponse(chat, 'Success')))
		.catch(next);
}

async function sendMessage(req, res, next) {
	const chatRepo = new chatRepository();
	const { conversation_id, message } = req.body;
	const sender_id = req?.user?.id;
	const conversation = await db.Conversations.findOne(
		{
			include: [{
				model: db.Messages,
				attributes: ['id', 'message', 'created_at', 'sender_id', 'receiver_id', 'conversation_id'],
				order: [
					['created_at', 'DESC']
				],
				where: [{ is_disabled: false, }],
			}],
			where: [{ is_disabled: false, id: conversation_id }],
		}
	);
	if (conversation) {
		const receiver_id = conversation?.user_id === sender_id ? conversation?.messages[0]?.receiver_id === sender_id ? conversation?.messages[0]?.sender_id : conversation?.messages[0]?.receiver_id : conversation?.user_id;
		chatRepo.send({ conversation_id, sender_id, message, receiver_id })
			.then(chat => res.json(new DefaultResponse(chat, 'Success')))
			.catch(next);
	}
	else {
		res.json(new DefaultResponse(null, 'Conversation not found'));
	}
}

function conversation(req, res, next) {
	const chatRepo = new chatRepository();
	const { id } = req.params;
	chatRepo.conversation(id)
		.then(chat => res.json(new DefaultResponse(chat, 'Success')))
		.catch(next);
}

function admingetConversation(req, res, next) {
	const chatRepo = new chatRepository();
	chatRepo.getAll()
		.then(chat => res.json(new DefaultResponse(chat, 'Success')))
		.catch(next);
}


module.exports = route;