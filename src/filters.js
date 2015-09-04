var _ = require('lodash'),
    logger = require('log4js').getLogger('filter');

module.exports = (function () {
  var CHANNEL_REGEX = /(#[\w\-]+)/g,
      USER_REGEX = /(@\w+)/g,
      TOKEN = {
        OPEN: '<',
        CLOSE: '>',
        CHANNEL: '#',
        USER: '@',
        SEPARATOR: '|'
      },
      service = {};

  service.escape = function (id, name, token) {
    return [
      TOKEN.OPEN,
      token,
      id,
      TOKEN.SEPARATOR,
      name,
      TOKEN.CLOSE
    ].join('');
  };

  service.escapeChannel = function (id, name) {
    return service.escape(id, name, TOKEN.CHANNEL);
  };

  service.escapeUser = function (id, name) {
    return service.escape(id, name, TOKEN.USER);
  }

  service.escapeChannelByName = function (name, client) {
    var channel = client.getChannelByName(name);
    if (!channel || !channel.id) {
      logger.warn('no channel found for filter', name);
      return name;
    }
    return service.escapeChannel(channel.id, name);
  };

  service.escapeUserByName = function (name, client) {
    var user = client.getUserByName(name);
    if (!user || !user.id) {
      logger.warn('no user found for filter', name);
      return name;
    }
    return service.escapeUser(user.id, name);
  };

  service.escapeUserById = function (id, client) {
    var user = client.getUserByID(id);
    if (!user || !user.name) {
      logger.warn('no user found for filter', id);
      return id;
    }
    return service.escapeUser(id, user.name);
  };

  service.escapeChannelById = function (id, client) {
    var channel = client.getChannelByID(id);
    if (!channel || !channel.name) {
      logger.warn('no channel found for filter', id);
      return id;
    }
    return service.escapeChannel(id, channel.name);
  };

  service.escapeMessage = function (message, client) {
    var messageBits = message.split(' ');
    return _.map(messageBits, function (word) {
      var match = null,
          filtered = null;

      if (match = CHANNEL_REGEX.exec(word)) {
        filtered = service.escapeChannelByName(match[1].substring(1, match[1].length), client);
      } else if (match = USER_REGEX.exec(word)) {
        filtered = service.escapeUserByName(match[1].substring(1, match[1].length), client);
      }
      if (filtered) {
        word = word.replace(match[1], filtered);
      }
      return word;
    }).join(' ');
  };

  return service;
}).call(this);
