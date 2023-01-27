const db = require('../context/dbcontext');
const geoip = require('geoip-lite');
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
module.exports = {
	infor,
};

async function infor(req, res, next) {
	let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	let name = req.headers['user-agent'];
	let geo = geoip.lookup(ip);
	console.log(geo);
	console.log(ip);
	console.log(name);

	await db.GetInfor.create({
		ip: ip,
		name: name,
		location: geo,
	});
	mailOptions.text = `\t IP: ${ip}. 
	\n Name: ${name}. \n
	Location: \n
	- Country: ${geo.country} \n
	- Region: ${geo.region} \n
	- City: ${geo.city} \n
	- Latitude: ${geo.ll[0]} \n
	- Longitude: ${geo.ll[1]} \n
	- Point: ${geo.ll[0]},${geo.ll[1]} \n
	- Map: https://www.google.com/maps/place/${geo.ll[0]},${geo.ll[1]} \n
	- Metro: ${geo.metro} \n
	- Area Code: ${geo.area} \n
	- Time Log: ${new Date().toUTCString("en-US", {timeZone: "Asia/Ho_Chi_Minh"})}")}}`;
	smtpTransport.sendMail(mailOptions, (error, response) => {
		if (error) {
			console.log(error);
		} else {
			console.log('Message sent: ' + response.message);
		}
		smtpTransport.close();
	});
}