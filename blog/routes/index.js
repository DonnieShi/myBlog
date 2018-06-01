var express = require('express');
var router = express.Router();
//登录时需要md5加密
var crypto = require('crypto')
var mysql = require('./../database')


// 登录页 
router.get('/login',function(req,res,next){
	res.render('login',{ message:''})
});

// 首页
router.get('/', function(req, res, next) {
  var query = 'SELECT *FROM article ORDER BY articleID DESC'
  mysql.query(query,function(err,rows,fields){
  	var articles = rows;

  	// 时间格式处理
  	articles.forEach(function(ele){
  		var year = ele.articleTime.getFullYear()
  		var month = ele.articleTime.getMonth() + 1 > 10 ? ele.articleTime.getMonth() : '0' + (ele.articleTime.getMonth() + 1)
  		var date = ele.articleTime.getDate() > 10 ? ele.articleTime.getDate() : '0' + ele.articleTime.getDate()
  		ele.articleTime = year + '-' + month + '-' + date
  	});

  	res.render("index",{articles:articles,user:req.session.user})
  })

});

// 内容页
router.get('/articles/:articleID',function(req,res,next){
	var articleID = req.params.articleID // 存储路由占位符的真实内容 每篇文章的ID作为路由
	var query = 'SELECT * FROM article WHERE articleID =' + mysql.escape(articleID);
	mysql.query(query,function(err,rows,fields){
		if (err) {
			console.log(err)
			return
		}
		var article = rows[0]
		var query = "UPDATE article SET articleClick= articleClick + 1 WHERE articleID = " + mysql.escape(articleID)
		mysql.query(query,function(err,rows,fields){
			if (err) {
				console.log(err)
				return				
			}
	  		var year = article.articleTime.getFullYear()
	  		var month = article.articleTime.getMonth() + 1 > 10 ? article.articleTime.getMonth() : '0' + (article.articleTime.getMonth() + 1)
	  		var date = article.articleTime.getDate() > 10 ? article.articleTime.getDate() : '0' + article.articleTime.getDate()
	  		article.articleTime = year + '-' + month + '-' + date
	  		res.render('article',{article:article,user:req.session.user})
		})
	})
})

// 发布页
router.get('/edit',function(req,res,next){
	var user = req.session.user;
	if (!user) {
		res.redirect('/login')
		return
	}
	res.render('edit',{user:req.session.user})
})


router.post('/edit',function(req,res,next){
	var title = req.body.title        // req.body 来自视图的内容
	var content = req.body.content
	var author = req.session.user.authorName
	var query = "INSERT article SET articleTitle = " + mysql.escape(title) + ",articleAuthor = " + mysql.escape(author) + ",articleContent =" +
	mysql.escape(content) + ",articleTime = CURDATE()";
	mysql.query(query,function(err,rows,fields){
		if (err) {
			console.log(err)
			return
		}
		res.redirect('/');
	})
})

// 友情链接
router.get('/friends',function(req,res,next){
	res.render('friends',{user:req.session.user})
})

// 关于博客
router.get('/about',function(req,res,next){
	res.render('about',{user:req.session.user})
})

// 登出博客
router.get('/logout',function(req,res,next){
	req.session.user = null
	res.redirect('/')
})

// 修改
router.get('/modify/:articleID',function(req,res,next){
	var articleID = req.params.articleID // 存储路由占位符的真实内容 每篇文章的ID作为路由
	var query = 'SELECT * FROM article WHERE articleID =' + mysql.escape(articleID);
	var user = req.session.user
	if (!user) {
		res.redirect('/login')
		return
	}

	mysql.query(query,function(err,rows,fields){
		if (err) {
			console.log(err)
			return
		}
		var article = rows[0]
		var title = article.articleTitle
		var content = article.articleContent
		res.render('modify',{user:user,title:title,content:content})
	})
})

router.post('/modify/:articleID',function(req,res,next){   //  app.post  接受客户端提交的请求  第一个参数客户端提交的位置  -- form的action 提交到的目的地 不填表示当前路径
	var articleID = req.params.articleID
	var title = req.body.title        // req.body 来自视图的内容
	var content = req.body.content
	var author = req.session.user.authorName
	var query = "UPDATE article SET articleTitle = " + mysql.escape(title) +  ",articleContent =" +
	mysql.escape(content) +"WHERE articleID = "+ mysql.escape(articleID);
	mysql.query(query,function(err,rows,fields){
		if (err) {
			console.log(err)
			return
		}
		res.redirect('/');
	})
})

//删除
router.get('/:articleID',function(req,res,next){
	var articleID = req.params.articleID
	var user = req.session.user
	var query = "DELETE FROM article WHERE articleID = " + mysql.escape(articleID)
	if (!user) {
		res.redirect('/login')
		return
	}
	mysql.query(query,function(err,rows,fields){
		res.redirect('/')
	})
})

// 登录信息验证
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
			req.session.userSign = true
			req.session.userID = user.authorID
			req.session.user = user
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
