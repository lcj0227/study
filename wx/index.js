const Koa = require('koa');
const koaRouter = require('koa-router');
const static = require('koa-static');
const url = require('url');
const xmlParser = require('koa-xml-body');
const crypto = require('crypto');

const app = new Koa();
const conf = require('./config');

app.use(xmlParser());

const router = new koaRouter();

app.use(static(__dirname, '/'));

router.get('/wechat', ctx => {
  console.log('微信认证===', ctx.url);
  const {
    query
  } = url.parse(ctx.url, true);
  const {
    signature, // 微信加密签名，signature结合了开发者填写的token参数和请求中的
    timestamp, // 时间戳
    nonce, // 随机数
    echostr // 随机字符串
} = query;

  console.log('wechat', query);
  let str = [conf.token, timestamp, nonce].sort().join('');
  console.log('str',str);
  let strSha1 = crypto.createHash('sha1').update(str).digest('hex');
  console.log(`自己加密后的字符串为：${strSha1}`);
  console.log(`微信传入的加密字符串为：${signature}`);
  console.log(`两者比较结果为：${signature === strSha1}`);

  // 签名对比，相同则按照微信要求返回echostr参数值
  if (signature == strSha1) {
    ctx.body = echostr
  } else {
    ctx.body = "你不是微信"
  }

});

// 接受信息
router.post('/wechat', ctx => {
  const {
    xml: msg
  } = ctx.request.body;
  console.log('Receive:', msg);
  const builder = new xml2js.Builder();
  const result = builder.buildObject({
    xml: {
      ToUserName: msg.FromUserName,
      FromUserName: msg.ToUserName,
      CreateTime: Date.now(),
      MsgType: msg.MsgType,
      Content: 'Hello ' + msg.Content
    }
  });
  ctx.body = result
});

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);



