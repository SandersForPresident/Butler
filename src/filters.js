var _ = require('lodash');

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

  service.escapeChannel = function (name, client) {
    var channel = client.getChannelByName(name);
    if (!channel || !channel.id) {
      console.log('no channel', name);
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

  service.escapeUser = function (name, client) {
    var user = client.getUserByName(name);
    if (!user || !user.id) {
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
        filtered = service.escapeChannel(match[1].substring(1, match[1].length), client);
      } else if (match = USER_REGEX.exec(word)) {
        filtered = service.escapeUser(match[1].substring(1, match[1].length), client);
      }
      if (filtered) {
        word = word.replace(match[1], filtered);
      }
      return word;
    }).join(' ');
  };

  return service;
}).call(this);
