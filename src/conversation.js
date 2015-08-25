var ConversationNodes = require('./conversation-nodes');

module.exports = (function () {

  function Conversation (delegate, channel) {
    this.delegate = delegate;
    this.channel = delegate.service.getDMByID(channel);
    this.node = null;
  }

  Conversation.prototype.push = function (message) {
    var transitionNode,
        response = 'Try again, I did not understand';

    if (this.node === null) {
      this.node = ConversationNodes.getRootNode();
      response = this.node.getValue();
    } else if (transition = this.node.interact(message.text)) {
      this.node = transition;
      response = this.node.getValue();
    }
    this.channel.send(response);
  };

  return Conversation;
}).call(this);
