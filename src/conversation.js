var ConversationNodes = require('./conversation-nodes');

module.exports = (function () {

  function Conversation (delegate, channel) {
    this.delegate = delegate;
    this.channel = delegate.service.getDMByID(channel);
    this.node = null;
  }

  Conversation.prototype.push = function (message) {
    var transitionNode;

    if (this.node === null) {
      this.node = ConversationNodes.getRootNode();
      this.node.prompt(this.channel);
    } else {
      transition = this.node.interact(message.text);
      if (transition) {
        this.node = transition;
        this.node.prompt(this.channel);
      } else {
        this.node.retry(this.channel);
      }
    }
  };

  return Conversation;
}).call(this);
