var _ = require('lodash'),
    moment = require('moment'),
    logger = require('log4js').getLogger('task-coordinator'),
    Filter = require('./filters'),
    TaskCoordinatorDataService = require('./services/task-coordinator-data');

module.exports = (function () {
  function TaskCoordinator (delegate) {
    this.delegate = delegate;
    this.service = new TaskCoordinatorDataService(delegate.redisClient);
  }

  /**
   * Create a help request
   * @param  {Object} user    The user creating the help request
   * @param  {Object} message The message the user posted
   * @param  {Object} channel The channel the help request was created in
   * @return {Object}         Promise
   */
  TaskCoordinator.prototype.requestHelp = function (user, message, channel) {
    return this.service.createHelpRequest(user.id, channel.id, message.text).then(function () {
      channel.send('I\'ll let someone know the next time they ask!');
      logger.info('help request stored for user', user.id, '(' + user.name + ')')
    }).catch(function (error) {
      channel.send('Sorry! having an issue right now processing help requests');
      logger.error('problem storing help request for user', user.id, '('+ user.name + ')', error);
    });
  };

  /**
   * Get open help requests
   * @param  {Object} user    The user requesting open help requests
   * @param  {Object} message The message the user posted
   * @param  {Object} channel The channel the help request was requested in
   * @return {Object}         Promise
   */
  TaskCoordinator.prototype.provideHelp = function (user, message, channel) {
    return this.service.getHelpRequests().then(function (helpRequests) {
      // generate all the responses
      return _.map(helpRequests, function (request) {
        // format the response sentence
        return [
          Filter.escapeUserById(request.user, this.delegate.service),
          'needed help in',
          Filter.escapeChannelById(request.channel, this.delegate.service),
          moment.unix(request.date).from(moment()) + '.',
          '\n>',
          request.message.replace('<@' + this.delegate.service.self.id + '>', '')
        ].join(' ');
      }.bind(this));
    }.bind(this)).then(function (messages) {
      if (messages.length === 0) {
        channel.send('Nobody has recently asked for help. I\'m sure somone could use a hand somewhere!');
      } else {
        channel.send(messages.join('\n') + 'no');
      }
      logger.info('help requests reported for user', user.id, '(' + user.name + ')');
    }).catch(function (error) {
      logger.error('problem fetching help requests for user', user.id, '(' + user.name + ')', error);
      channel.send('I had some trouble looking up help requests');
    });
  };

  /**
   * Remove help request
   * @param  {Object} user    The user requesting to remove their help request
   * @param  {Object} channel The channel the user had posted in
   * @return {Object}         Promise
   */
  TaskCoordinator.prototype.removeHelp = function (user, channel) {
    return this.service.removeHelpRequest(user.id).then(function () {
      channel.send('Thanks for letting me know, I have removed your request.');
      logger.info('help request removed for user', user.id, '(' + user.name + ')');
    }).catch(function (error) {
      channel.send('Hrmm.. Something went wrong trying to remove your request.');
      logger.error('problem removing request for user', user.id, '(' + user.name + ')', error);
    });
  };

  return TaskCoordinator;
}).call(this);
