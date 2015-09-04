var _ = require('lodash'),
    Filter = require('./filters');

module.exports = (function () {
  function TaskCoordinator (delegate) {
    this.delegate = delegate;
  }

  TaskCoordinator.prototype.requestHelp = function (user, message, channel) {
    var key = 'help:user:' + user.id;

    this.delegate.redisClient.hmsetAsync(key, {
      user: user.id,
      channel: channel.id,
      message: message.text,
      date: (new Date()).getTime()
    });

    this.delegate.redisClient.lremAsync('help', 0, key).finally(function () {
      return this.delegate.redisClient.lpush('help', key);
    }.bind(this));
    channel.send('We\'ll find you some help!');
  };

  TaskCoordinator.prototype.provideHelp = function (user, message, channel) {
    this.delegate.redisClient.lrangeAsync('help', 0, 10).then(function (keys) {
      var lookups = _.map(keys, function (key) {
        return this.delegate.redisClient.hgetallAsync(key);
      }.bind(this));
      return Promise.all(lookups);
    }.bind(this)).then(function (helpRequests) {
      var messages = _.map(helpRequests, function (request) {
        console.log('request', request);
        var message = 'User ' + Filter.escapeUserById(request.user, this.delegate.service) + ' needed help in ' + Filter.escapeChannelById(request.channel, this.delegate.service);
        message += '\n';
        message += '> ' + request.message.replace('<@U09KH1WV8>', '');
        return message;
      }.bind(this));
      channel.send(messages.join('\n'));
    }.bind(this)).catch(function (error) {
      console.log('error', error);
      channel.send('I had some trouble looking up help requests');
    })
  };

  return TaskCoordinator;
}).call(this);
