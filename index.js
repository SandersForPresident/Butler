var Slack = require('slack-client'),
    Bot = require('./src/bot'),
    config = require('./.config.env.json');

(function () {
  var slack = new Slack(config.slack.key, true),
      bot = new Bot(slack);
}).call(this);
