const express = require('express');
const router = express.Router();
const getInforService = require('../services/getinfor.services');






router.get('/', getIP, (req, res) => {
	res.send('Không có gì đâu');
});

module.exports = router;

async function getIP(req, res, next) {

	getInforService.infor(req, res, next);



	next();
}