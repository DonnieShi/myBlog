var express = require('express');
var router = express.Router();
//登录时需要md5加密
var crypto = require('crypto')
var mysql = require('./../database')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login',function(req,res,next){
	res.render('login')
});

/* 登录信息验证*/

router.post('/login',function(req,res,next){
	var name = req.body.name;
	var password = req.body.password;

	// var hash = crypto.createHash('md5')  这里暂时不做MD5加密 因为没有注册功能 数据库存储的密码没有加密 无法进行对比
	// hash.update(password)
	// password = hash.digest('hex')

	var query = 'SELECT * FROM author WHERE authorName= ' + mysql.escape(name) + 'AND authorPassword=' + mysql.escape(password);
	// var query = 'SELECT * FROM author'
	// escape 防止sql 注入攻击
 
	mysql.query(query,function(err,rows,fields){
		if (err) {
			console.log(err)
			return;
		}
		var user = rows[0];

		if (user) {
			res.redirect('/')
		}
	}) 
})

// md5 加密
function md5Encrypt(encryptString){
	var hash = crypto.createHash('md5')
	hash.update(encryptString,'utf-8') // 防止中文加密前后端不一致的问题
	encryptString = hash.digest('hex')
	return encryptString
}

module.exports = router;
