var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));//视图文件夹位置
app.set('view engine', 'ejs');//设置使用ejs模板引擎

app.use(logger('dev'));//使用日志记录中间件
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 应用session配置
app.use(session({
	name:'test',//这里的name值得是cookie的name，默认cookie的name是：connect.sid
	secret:'123456',//用来对session id相关的cookie进行签名
	cookie:{maxAge:1000*62*24*30}, // 这么长时间后session 和 cookie 失效过期
	resave:true,// 是否每次都重新保存会话，建议false          --如果设为false 有时候  req.session 可能为空
	saveUninitialized:true//// 是否自动保存未初始化的会话，建议false
}));

app.use(express.static(path.join(__dirname, 'public')));// 设置静态文件夹位置

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
  // res.render('404')
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(3000,function(){
	console.log("listen port 3000")

});

module.exports = app;
