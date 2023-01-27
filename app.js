const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.use('/profile', require('./controller/getinfor.controller'));
app.listen(3000, () => {
	console.log('Server started on port http://localhost:3000');
});
