var express = require("express");
var app = express();
var sha1 = require("sha1");

var config = {
  "appID": "wx6f825fb6d48addcc",
  "appsecret": "8a7753138c55f733f2058eee871a3168",
  "token": "spring"
}

app.get("/wechat", (req, res, next)=> {

  // 获取微信服务器发送的数据
  var signature = req.query.signature,
    timestamp = req.query.timestamp,
    nonce = req.query.nonce,
    echostr = req.query.echostr;

  // token、timestamp、nonce三个参数进行字典序排序
  var arr = [config.token, timestamp, nonce].sort().join('');
  // sha1加密
  var result = sha1(arr);

  if(result === signature){
    res.send(echostr);
  }else{
    res.send('mismatch');
  }
});

app.listen(3000);
