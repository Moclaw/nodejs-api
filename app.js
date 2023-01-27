const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

//set file index.html as default

app.use(express.static('public'));
app.use('/profile', require('./controller/getinfor.controller'));
//listen on heroku port or 3000
app.listen(process.env.PORT || 3000, () => {
	console.log('Server started on port http://localhost:3000');
});
