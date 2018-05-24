// mysql 连接文件
const mysql = require('mysql')
const config = require('./config')

// 创建连接
const database = mysql.createConnection({
	host:config.host,
	user:config.user,
	port:config.port,
	password:config.password,
	database:config.database
})

// 连接数据库
database.connect(function(err){
	if (err) {
		console.log('error connect:' + err.stack);
		return;
	}
	console.log('connect as id ' + database.threadId)
});

module.exports = database;