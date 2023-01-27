const express = require('express');
const router = express.Router();
const geoip = require('geoip-lite');
const db = require('../context/dbcontext');

router.get('/', getIP, (req, res) => {
	res.send('Không có gì đâu');
});

module.exports = router;

function getIP(req, res, next) {
	let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	let name = req.headers['user-agent'];
	let geo = geoip.lookup(ip);
	console.log(geo);
	console.log(ip);
	console.log(name);
	//insert to db
	db.run(`INSERT INTO inforconnect (name, location, ip) VALUES (?, ?, ?)`, [name, geo, ip], function (err) {
		if (err) {
			return console.log(err.message);
		}
		// get the last insert id
		console.log(`A row has been inserted with rowid ${this.lastID}`);
	});

	next();
}