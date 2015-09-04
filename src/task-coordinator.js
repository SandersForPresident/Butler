var _ = require('lodash');

module.exports = (function () {
  function TaskCoordinator (delegate) {
    this.delegate = delegate;
  }

  TaskCoordinator.prototype.requestHelp = function (user, message, channel) {
    var key = 'help:user:' + user.id;

    this.delegate.redisClient.hmsetAsync(key, {
      user: user.id,
      channel: channel.id,
      message: message.text
    });

    this.delegate.redisClient.lremAsync('help', 0, key).finally(function () {
      return this.delegate.redisClient.lpush('help', key);
    }.bind(this));
    channel.send('We\'ll find you some help!');
  };

  TaskCoordinator.prototype.provideHelp = function (user, message, channel) {
    channel.send('Let me find you someone who could use your help');
    this.delegate.redisClient.lrangeAsync('help', 0, 10).then(function (keys) {
      var lookups = _.map(keys, function (key) {
        return this.delegate.redisClient.hgetallAsync(key);
      }.bind(this));
      return Promise.all(lookups);
    }.bind(this)).then(function (helpRequests) {
      var message = _.map(helpRequests, function (request) {
        return 'User ' + request.user + ' needed help in ' + request.channel;
      });
      channel.send(message.join('\n'));
    }).catch(function (error) {
      console.log('error', error);
    })
  };

  return TaskCoordinator;
}).call(this);
