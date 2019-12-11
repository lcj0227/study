var sha1 = require("sha1"); //引入加密模块

// 构造函数
function WeChat(config) {
  // 传入配置文件
  this.config = config;
  this.token = config.token;
  this.appID = config.appID;
  this.appScrect = config.appScrect;
}

// 微信授权验证方法
WeChat.prototype.auth = function(req, res, next) {

  // 获取微信服务器发送的数据
  var signature = req.query.signature,
    timestamp = req.query.timestamp,
    nonce = req.query.nonce,
    echostr = req.query.echostr;

  // token、timestamp、nonce三个参数进行字典序排序
  var arr = [this.token, timestamp, nonce].sort().join('');
  // sha1加密
  var result = sha1(arr);

  if(result === signature){
    res.send(echostr);
  }else{
    res.send('mismatch');
  }
}