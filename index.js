var Slack = require('slack-client'),
    Redis = require('redis'),
    Promise = require('bluebird'),
    Bot = require('./src/bot'),
    http = require('http');

(function () {
  var token = process.env.SLACK_TOKEN,
      slack,
      redis,
      bot;

  if (!token) {
    throw new Error('Slack token is required. Please provide SLACK_TOKEN as an environment variable');
  }

  slack = new Slack(token, true);
  redis = Redis.createClient({detect_buffers: true});
  redis = Promise.promisifyAll(redis);
  bot = new Bot(slack, redis);

  http.createServer(function (req, res) {
    res.end('Talk to me through slack');
  }).listen(process.env.PORT || 5000);
}).call(this);
