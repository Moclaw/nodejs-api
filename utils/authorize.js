const { expressjwt: expressJwt } = require('express-jwt');
const { secret } = require('../config.json');
const db = require('../context/dbcontext');
const config = require('../config.json');


function authorize() {
	return [
		// authenticate JWT token and attach decoded token to request as req.user
		expressJwt({
			secret: config.Jwt.secret, algorithms: ['HS256'],
			getToken: function fromHeaderOrQuerystring(req) {
				if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
					return req.headers.authorization.split(' ')[1];
				} else if (req.query && req.query.token) {
					return req.query.token;
				}
				return null;
			},
			maxAge: config.Jwt.expiresIn


		}),

		// attach full user record to request object
		async (req, res, next) => {
			// get user with id from token 'sub' (subject) property
			const user = await db.Users.findByPk(req.auth.sub);

			// check user still exists
			if (!user)
				return res.status(401).json({ message: 'Unauthorized' });

			// authorization successful
			req.user = user.get();
			next();
		}
	];
}
module.exports = authorize;
