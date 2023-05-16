const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { updateSwaggerDocument } = require('./swaggerServices');
const config = require('./config.json');
const errorHandler = require('./utils/error-handler');
const swaggerDocument = require('./swagger.json');
const bodyParser = require('body-parser')

updateSwaggerDocument();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(errorHandler);
require('./route')(app);

const URL = config.server.url;
const PORT = config.server.port;

io.on('connection', (socket) => {
	console.log('a user connected');
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
}

);

http.listen(PORT, () => {
	console.log(`Server is running on ${URL}/api-docs`);
}
);

