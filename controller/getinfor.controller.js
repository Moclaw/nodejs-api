const express = require('express');
const router = express.Router();
const geoip = require('geoip-lite');
const db = require('../context/dbcontext');
//yahoo smtp server send mail
const nodemailer = require('nodemailer');
let smtpTransport = nodemailer.createTransport({
	host: 'smtp.mail.yahoo.com',
	port: 587,
	secure: false,
	auth: {
		user: 'duta08042000@yahoo.com',
		pass: 'hwacrsibjdfzwdjh',
	},
	tls: {
		rejectUnauthorized: false,
	},
});

let mailOptions = {
	from: 'duta08042000@yahoo.com',
	to: 'mocduonglam86@gmail.com',
	subject: 'Có người check profile',
	text: '',
};




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
	//send mail
	mailOptions.text = `IP: ${ip} \n Name: ${name} \n
	Location: ${geo.country} - ${geo.region} - ${geo.city} - ${geo.ll} - ${geo.metro} - ${geo.area}
	`;
	smtpTransport.sendMail(mailOptions, (error, response) => {
		if (error) {
			console.log(error);
		} else {
			console.log('Message sent: ' + response.message);
		}
		smtpTransport.close();
	});

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