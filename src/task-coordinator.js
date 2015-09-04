module.exports = (function () {
  function TaskCoordinator (delegate) {
    this.delegate = delegate;
  }

  TaskCoordinator.prototype.requestHelp = function (user, message, channel) {
    channel.send('What do you need help with?');
  };

  TaskCoordinator.prototype.provideHelp = function (user, message, channel) {
    channel.send('Let me find you someone who could use your help');
  };

  return TaskCoordinator;
}).call(this);
