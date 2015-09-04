var Promise = require('bluebird'),
    moment = require('moment'),
    _ = require('lodash');

module.exports = (function () {
  var HELP_LIST_KEY = 'help',
      HELP_USER_HASHMAP_KEY_PREFIX = HELP_LIST_KEY + ':' + 'user:',
      HELP_LIST_LIMIT_LOWER = 0,
      HELP_LIST_LIMIT_UPPER = 10;

  function TaskCoordinatorDataService (redis) {
    this.redis = redis;
  }

  TaskCoordinatorDataService.prototype.createHelpRequest = function (userId, channelId, message) {
    var key = HELP_USER_HASHMAP_KEY_PREFIX + userId,
        promises = [];

    // store the help request keyed by the user
    promises.push(this.redis.hmsetAsync(key, {
      user: userId,
      channel: channelId,
      message: message,
      date: moment().unix()
    }));

    // remove any existing help requests by the user in the help collection.
    // prevents any duplicated hashmap keys in the collection
    promises.push(this.redis.lremAsync(HELP_LIST_KEY, 0, key).finally(function () {
      // add the help request hashmap key
      return this.redis.lpush(HELP_LIST_KEY, key);
    }.bind(this)));

    // wait for all redis transactions to complete
    return Promise.all(promises)
  };

  TaskCoordinatorDataService.prototype.getHelpRequests = function () {
    return this.redis.lrangeAsync(HELP_LIST_KEY, HELP_LIST_LIMIT_LOWER, HELP_LIST_LIMIT_UPPER).then(function (keys) {
      var lookupPromises = _.map(keys, this.getHelpRequest.bind(this));
      return Promise.all(lookupPromises);
    }.bind(this));
  };

  TaskCoordinatorDataService.prototype.getHelpRequest = function (key) {
    return this.redis.hgetallAsync(key);
  };

  return TaskCoordinatorDataService;
}).call(this);
