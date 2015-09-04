var Slack = require('slack-client'),
    Conversation = require('./conversation'),
    logger = require('log4js').getLogger('bot'),
    _ = require('lodash');

module.exports = (function () {
  var CHANNEL_TYPE_DM = 'DM',
      BOT_ID = 'U09J43MQ9'; // this will later be dynamic

  function Bot (slackClient) {
    this.service = slackClient;
    this.conversations = {};

    this.service.on('message', this.dispatch.bind(this));
    this.service.on('userChange', this.userJoined.bind(this));
    this.service.on('open', this.connected.bind(this));
    this.service.login();
  }

  Bot.prototype.dispatch = function (message) {
    var messageObject = this.service.getChannelGroupOrDMByID(message.channel);
    if (messageObject.getType() === CHANNEL_TYPE_DM) {
      if (!(message.user in this.conversations)) {
        logger.info('new user conversation', message.user);
        this.conversations[message.user] = new Conversation(this, message.channel);
      }
      this.conversations[message.user].push(message);
    } else if (_.contains(message.text, '<@' + BOT_ID + '>')) {
      logger.info(message.user, 'pinged from', messageObject.getType(), 'by user', message.user, 'with message', message.text);
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
    var userId = event.id;
    if (event.deleted || event.is_bot) {
      // user account deactivation, ignore
      return;
    }

    this.service.openDM(userId, function (response) {
      var channel;
      if (!response.ok) {
        return;
      }
      channel = response.channel;
      this.conversations[userId] = new Conversation(this, channel.id);
      this.conversations[userId].introduce();
      logger.info(userId, 'joined - conversation initialized', channel.id);
    }.bind(this));
  };

  return Bot;
}).call(this);
