var express = require('express');
var router = express.Router();
//登录时需要md5加密
var crypto = require('crypto')
var mysql = require('./../database')

/* GET home page. */
router.get('/', function(req, res, next) {
  var query = 'SELECT *FROM article'
  mysql.query(query,function(err,rows,fields){
  	var articles = rows;

  	// 时间格式处理
  	articles.forEach(function(ele){
  		var year = ele.articleTime.getFullYear()
  		var month = ele.articleTime.getMonth() + 1 > 10 ? ele.articleTime.getMonth() : '0' + (ele.articleTime.getMonth() + 1)
  		var date = ele.articleTime.getDate() > 10 ? ele.articleTime.getDate() : '0' + ele.articleTime.getDate()
  		ele.articleTime = year + '-' + month + '-' + date
  	});

  	res.render("index",{articles:articles})
  })

});

router.get('/login',function(req,res,next){
	res.render('login',{ message:''})
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
		}else{
			res.render('login',{message:'用户名或者密码错误'});
			return;
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
