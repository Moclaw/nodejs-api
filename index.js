const express = require('express');
const cors = require('cors');
const { glob } = require('glob');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const path = require('path');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { updateSwaggerDocument } = require('./swaggerServices');

updateSwaggerDocument();

require('./route')(app);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 4000;
const URL = process.env.URL || 'http://localhost:';
io.on('connection', (socket) => {
	console.log('a user connected');
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});
http.listen(PORT, () => {
	console.log('Server is running on' + URL + PORT + '/api-docs');
}
);


