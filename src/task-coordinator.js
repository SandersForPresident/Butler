var _ = require('lodash'),
    moment = require('moment'),
    Filter = require('./filters');

module.exports = (function () {
  function TaskCoordinator (delegate) {
    this.delegate = delegate;
  }

  TaskCoordinator.prototype.requestHelp = function (user, message, channel) {
    var key = 'help:user:' + user.id,
        promises = [];

    promises.push(this.delegate.redisClient.hmsetAsync(key, {
      user: user.id,
      channel: channel.id,
      message: message.text,
      date: moment().unix()
    }));

    promises.push(this.delegate.redisClient.lremAsync('help', 0, key).finally(function () {
      return this.delegate.redisClient.lpush('help', key);
    }.bind(this)));

    Promise.all(promises).then(function () {
      channel.send('I\'ll let someone know the next time they ask!');
    }).catch(function (error) {
      channel.send('Sorry! having an issue right now processing help requests');
      console.log('error requesting help', error);
    });
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
        return [
          Filter.escapeUserById(request.user, this.delegate.service),
          'neeeded help in',
          Filter.escapeChannelById(request.channel, this.delegate.service),
          moment.unix(request.date).from(moment()) + '.',
          '\n',
          '>',
          request.message.replace('<@' + this.delegate.service.self.id + '>', '')
        ].join(' ');
      }.bind(this));
      channel.send(messages.join('\n'));
    }.bind(this)).catch(function (error) {
      console.log('error', error);
      channel.send('I had some trouble looking up help requests');
    })
  };

  return TaskCoordinator;
}).call(this);
