var _ = require('lodash'),
    moment = require('moment'),
    logger = require('log4js').getLogger('task-coordinator'),
    Filter = require('./filters');

module.exports = (function () {
  var HELP_LIST_KEY = 'help',
      HELP_USER_HASHMAP_KEY_PREFIX = HELP_LIST_KEY + ':' + 'user:',
      HELP_LIST_LIMIT_LOWER = 0,
      HELP_LIST_LIMIT_UPPER = 10;

  function TaskCoordinator (delegate) {
    this.delegate = delegate;
  }

  /**
   * Create a help request
   * @param  {Object} user    The user creating the help request
   * @param  {Object} message The message the user posted
   * @param  {Object} channel The channel the help request was created in
   * @return {Object}         Promise
   */
  TaskCoordinator.prototype.requestHelp = function (user, message, channel) {
    var key = HELP_USER_HASHMAP_KEY_PREFIX + user.id,
        promises = [];

    // store the help request keyed by the user
    promises.push(this.delegate.redisClient.hmsetAsync(key, {
      user: user.id,
      channel: channel.id,
      message: message.text,
      date: moment().unix()
    }));

    // remove any existing help requests by the user in the help collection.
    // prevents any duplicated hashmap keys in the collection
    promises.push(this.delegate.redisClient.lremAsync(HELP_LIST_KEY, 0, key).finally(function () {
      // add the help request hashmap key
      return this.delegate.redisClient.lpush(HELP_LIST_KEY, key);
    }.bind(this)));

    // wait for all redis transactions to complete
    return Promise.all(promises).then(function () {
      // transactions completed successfully, acknoweldge
      channel.send('I\'ll let someone know the next time they ask!');
      logger.info('help request stored for user', user.id, '(' + user.name + ')')
    }).catch(function (error) {
      // transactions failed, acknoweldge
      channel.send('Sorry! having an issue right now processing help requests');
      logger.error('problem storing help request for user', user.id, '('+ user.name + ')', error);
    });
  };

  /**
   * [provideHelp description]
   * @param  {[type]} user    [description]
   * @param  {[type]} message [description]
   * @param  {[type]} channel [description]
   * @return {[type]}         [description]
   */
  TaskCoordinator.prototype.provideHelp = function (user, message, channel) {
    this.delegate.redisClient.lrangeAsync(HELP_LIST_KEY, HELP_LIST_LIMIT_LOWER, HELP_LIST_LIMIT_UPPER)
    .then(function (keys) {
      var lookups = _.map(keys, function (key) {
        return this.delegate.redisClient.hgetallAsync(key);
      }.bind(this));
      return Promise.all(lookups);
    }.bind(this)).then(function (helpRequests) {
      var messages = _.map(helpRequests, function (request) {
        return [
          Filter.escapeUserById(request.user, this.delegate.service),
          'needed help in',
          Filter.escapeChannelById(request.channel, this.delegate.service),
          moment.unix(request.date).from(moment()) + '.',
          '\n',
          '>',
          request.message.replace('<@' + this.delegate.service.self.id + '>', '')
        ].join(' ');
      }.bind(this));
      channel.send(messages.join('\n'));
      logger.info('help requests reported for user', user.id, '(' + user.name + ')');
    }.bind(this)).catch(function (error) {
      console.log('error', error);
      logger.error('problem fetching help requests for user', user.id, '(' + user.name + ')', error);
      channel.send('I had some trouble looking up help requests');
    })
  };

  return TaskCoordinator;
}).call(this);
