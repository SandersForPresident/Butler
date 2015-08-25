var Slack = require('slack-client'),
    _ = require('lodash');

module.exports = (function () {

  function Bot (slackClient) {
    this.service = slackClient;


    // this.service.on('open', this.initialize.bind(this));
    this.service.on('message', this.onMessage.bind(this));
    this.service.on('user_change', this.userJoined.bind(this));
    this.service.on('open', this.connected.bind(this));
    this.service.login();
  }

  Bot.prototype.onMessage = function (message) {
    console.log('foobar', message);
  };

  Bot.prototype.connected = function () {
    // leave all channels that the bot may have been added to
    _.filter(this.service.channels, function (channel) {
      return channel.is_member;
    }).forEach(function (channel) {
      channel.leave();
    });
  };

  Bot.prototype.userJoined = function (event) {
    
  };

  return Bot;
}).call(this);
