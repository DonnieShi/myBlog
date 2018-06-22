var express = require('express');
var router = express.Router();
const fs = require('fs');

/* GET users listing. */
router.get('/set', function(req, res, next) {
  // 输出 JSON 格式
   var response = {
       "first_name":"MrSSSS",
       "last_name":"missSSSSSSSSSSSS"
   };
   console.log(response);
   res.jsonp(response)
   // res.send("nnnnnnnnnnnnnn")  
});





module.exports = router;
