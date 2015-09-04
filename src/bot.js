var Slack = require('slack-client'),
    Conversation = require('./conversation'),
    Interpretter = require('./interpretter'),
    TaskCoordinator = require('./task-coordinator'),
    Messages = require('./messages'),
    Promise = require('bluebird'),
    Redis = require('redis'),
    logger = require('log4js').getLogger('bot'),
    _ = require('lodash');

module.exports = (function () {
  var CHANNEL_TYPE_DM = 'DM',
      CHANNEL_TYPE_CHANNEL = 'Channel';

  function Bot (slackClient, redisClient) {
    this.service = slackClient;
    this.redisClient = redisClient;
    this.taskCoordinator = new TaskCoordinator(this)
    this.conversations = {};

    this.service.on('message', this.dispatch.bind(this));
    this.service.on('userChange', this.userJoined.bind(this));
    this.service.on('open', this.connected.bind(this));
    this.service.login();
  }

  Bot.prototype.dispatch = function (message) {
    var messageObject,
        user;
    if (!message.user || !message.channel) {
      return;
    }

    user = this.service.getUserByID(message.user);
    messageObject = this.service.getChannelGroupOrDMByID(message.channel);

    if (messageObject.getType() === CHANNEL_TYPE_DM) {
      this.respondToDM(user, message);
    } else if (messageObject.getType() === CHANNEL_TYPE_CHANNEL &&
      _.contains(message.text, '<@' + this.service.self.id + '>')) {
      this.respondToMention(user, message, messageObject);
    }
  };

  Bot.prototype.respondToDM = function (user, message) {
    if (!(message.user in this.conversations)) {
      logger.info('new user conversation', message.user, '(', user.name, ')');
      this.conversations[message.user] = new Conversation(this, message.channel);
    }
    this.conversations[message.user].push(message);
  };

  Bot.prototype.respondToMention = function (user, message, channel) {
    if (Interpretter.isLookingForHelp(message.text)) {
      this.taskCoordinator.requestHelp(user, message, channel);
    } else if (Interpretter.isAskingForHelp(message.text)) {
      this.taskCoordinator.provideHelp(user, message, channel);
    } else if (Interpretter.isNoLongerLookingForHelp(message.text)) {
      this.taskCoordinator.removeHelp(user, channel);
    } else if (Interpretter.isCheckingForOpenHelpRequest(message.text)) {
      this.taskCoordinator.hasHelpOpen(user, channel);
    } else {
      channel.send(Messages.generic());
    }
    logger.info(message.user, '(', user.name, ') pinged from', channel.getType(), 'with message', message.text);
  };

  Bot.prototype.connected = function () {
    // leave all channels that the bot may have been added to
    logger.info('connection successful');
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
      logger.info(userId, '(', event.name, ') joined - conversation initialized', channel.id);
    }.bind(this));
  };

  return Bot;
}).call(this);
