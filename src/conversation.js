module.exports = (function () {

  function Conversation (delegate, channel) {
    this.delegate = delegate;
    this.channel = delegate.service.getDMByID(channel);
    this.messages = [];
  }

  Conversation.prototype.push = function (message) {
    this.channel.send('response');
  };

  return Conversation;
}).call(this);
