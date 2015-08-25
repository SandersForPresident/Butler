var Slack = require('slack-client'),
    Conversation = require('./conversation'),
    logger = require('log4js').getLogger('bot'),
    _ = require('lodash');

module.exports = (function () {

  function Bot (slackClient) {
    this.service = slackClient;
    this.conversations = {};


    // this.service.on('open', this.initialize.bind(this));
    this.service.on('message', this.dispatch.bind(this));
    this.service.on('user_change', this.userJoined.bind(this));
    this.service.on('open', this.connected.bind(this));
    this.service.login();
  }

  Bot.prototype.dispatch = function (message) {
    var messageObject = this.service.getChannelGroupOrDMByID(message.channel);
    if (messageObject.getType() === 'DM') {
      if (!(message.user in this.conversations)) {
        logger.info('new user conversation', message.user);
        this.conversations[message.user] = new Conversation(this, message.channel);
      }
      this.conversations[message.user].push(message);
    } else if (_.contains(message.text, '<@U09J43MQ9>')) {
      logger.info(message.user, 'pinged from', messageObject.getType(), 'with message', messageObject.text);
      messageObject.send('I only respond to DMs right now');
    }
  };

  Bot.prototype.connected = function () {
    // leave all channels that the bot may have been added to
    logger.info('connection successful');
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
