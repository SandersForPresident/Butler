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

  redis = Redis.createClient({detect_buffers: true});

  // promisify lists
  redis.lpushAsync = Promise.promisify(redis.lpush);
  redis.lrangeAsync = Promise.promisify(redis.lrange);
  redis.lremAsync = Promise.promisify(redis.lrem);

  // promisify hashes
  redis.hmsetAsync = Promise.promisify(redis.hmset);
  redis.hmgetAsync = Promise.promisify(redis.hmget);
  redis.hgetallAsync = Promise.promisify(redis.hgetall);

  // promisify all
  redis.getAsync = Promise.promisify(redis.get);
  redis.setAsync = Promise.promisify(redis.set);

  slack = new Slack(token, true);
  bot = new Bot(slack, redis);

  http.createServer(function (req, res) {
    res.end('Talk to me through slack');
  }).listen(process.env.PORT || 5000);
}).call(this);
