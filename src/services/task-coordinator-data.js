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

  /**
   * Create a help request
   * @param  {Integer} userId    ID of the user creating the request
   * @param  {Integer} channelId ID of the channel the request was posted in
   * @param  {String}  message   The message that was posted
   * @return {Object}            Promise
   */
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

  /**
   * Get open help requests
   * @return {Object} Promise
   */
  TaskCoordinatorDataService.prototype.getHelpRequests = function () {
    // fetch the collection of help request keys
    return this.redis.lrangeAsync(HELP_LIST_KEY, HELP_LIST_LIMIT_LOWER, HELP_LIST_LIMIT_UPPER).then(function (keys) {
      // fetch each help request by the key
      var lookupPromises = _.map(keys, this.getHelpRequest.bind(this));
      return Promise.all(lookupPromises);
    }.bind(this));
  };

  /**
   * Get an open help request
   * @param  {String} key The key of the help request
   * @return {Object}     Promise
   */
  TaskCoordinatorDataService.prototype.getHelpRequest = function (key) {
    return this.redis.hgetallAsync(key);
  };

  /**
   * Remove a help request
   * @param  {Integer} userId ID of the user to remove the help request of
   * @return {Object}         Promise
   */
  TaskCoordinatorDataService.prototype.removeHelpRequest = function (userId) {
    var key = HELP_USER_HASHMAP_KEY_PREFIX + userId;

    // remove the help request hashmap
    return this.redis.delAsync(key).then(function () {
      // remove the hash map key from the list
      return this.redis.lremAsync(HELP_LIST_KEY, 0, key);
    }.bind(this));
  };

  return TaskCoordinatorDataService;
}).call(this);
