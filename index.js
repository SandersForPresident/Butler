var Slack = require('slack-client'),
    Bot = require('./src/bot');

(function () {
  var token = process.env.SLACK_TOKEN,
      slack,
      bot;

  if (!token) {
    throw new Error('Slack token is required. Please provide SLACK_TOKEN as an environment variable');
  }

  slack = new Slack(config.slack.key, true);
  bot = new Bot(slack);
}).call(this);
