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

  service.escapeChannelByName = function (name, client) {
    var channel = client.getChannelByName(name);
    if (!channel || !channel.id) {
      logger.warn('no channel found for filter', name);
      return name;
    }
    return [
      TOKEN.OPEN,
      TOKEN.CHANNEL,
      channel.id,
      TOKEN.SEPARATOR,
      name,
      TOKEN.CLOSE
    ].join('');
  };

  service.escapeUserByName = function (name, client) {
    var user = client.getUserByName(name);
    if (!user || !user.id) {
      logger.warn('no user found for filter', name);
      return name;
    }
    return [
      TOKEN.OPEN,
      TOKEN.USER,
      user.id,
      TOKEN.SEPARATOR,
      name,
      TOKEN.CLOSE
    ].join('');
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
