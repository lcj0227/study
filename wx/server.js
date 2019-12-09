const wechat = require('co-wechat');
router.all('/wechat', wechat(conf).middleware(
  async message => {
    console.log('wechart', message);
    return 'Hello world! '+message.Content;
  }
));

