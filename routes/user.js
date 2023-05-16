const express = require('express');
const router = express.Router();
const UserRepository = require('../services/userRepository');
const Joi = require('joi');
const validateRequest = require('../utils/validate-request');
const authorize = require('../utils/authorize');
const DefaultResponse = require('../utils/default');
// routes user
router.get('/', authorize(), getAll);
router.get('/current', authorize(), getCurrent);
router.post('/register', registerSchema, register);
router.post('/login', loginSchema, login);

// routes roles
router.get('/roles', authorize(), getAllRoles);

module.exports = router;
//functions

function getAll(req, res, next) {
	const userRepository = new UserRepository();
	userRepository.overrideGetAll()
		.then(users => res.json(users))
		.catch(next);
}

function getAllRoles(req, res, next) {
	const userRepository = new UserRepository();
	userRepository.getAllRoles()
		.then(roles => res.json(roles))
		.catch(next);
}

function registerSchema(req, res, next) {
	const schema = Joi.object({
		username: Joi.string().required(),
		password: Joi.string().min(6).required(),
		role_id: 1,
		first_name: Joi.string(),
		last_name: Joi.string(),
		email: Joi.string().email(),
		phone: Joi.string(),
	});

	validateRequest(req, next, schema);
}

function register(req, res, next) {
	const { username, password, first_name, last_name, email, phone } = req.body;
	const userRepository = new UserRepository();
	const result = userRepository.register({ username, password, first_name, last_name, email, phone })
		.catch(next);
	delete result.password;
	res.json(new DefaultResponse(result, 'Success'));
}

function loginSchema(req, res, next) {
	const schema = Joi.object({
		username: Joi.string().required(),
		password: Joi.string().required()
	});
	validateRequest(req, next, schema);
}

function login(req, res, next) {
	const { username, password } = req.body;
	const userRepository = new UserRepository();
	userRepository.authenticate({ username, password }).then(user => {
		if (user.deleted_at == null) {
			delete user.deleted_at;
		}
		delete user.role_id;
		res.json(new DefaultResponse(user, 'Success'));
	})
		.catch(next);
}

function getCurrent(req, res, next) {
	const userRepository = new UserRepository();
	userRepository.getById(req.user.id).then(user => {
		if (user.deleted_at == null) {
			delete user.deleted_at;
		}
		delete user.password;
		delete user.role_id;
		res.json(new DefaultResponse(user, 'Success'));
	})
		.catch(next);
}







