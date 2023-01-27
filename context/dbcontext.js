//viết kết nối db và những function liên quan đến sqlite
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.db', (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to database.');
}
);

initialize();

async function initialize() {
	await createTableInforConnect();
}

async function createTableInforConnect() {

	db.run(`CREATE TABLE IF NOT EXISTS inforconnect (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT,
		location TEXT,
		ip TEXT,
		time_log DATETIME DEFAULT CURRENT_TIMESTAMP
	)`);
}

module.exports = db;
