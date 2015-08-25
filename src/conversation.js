var NodeFactory = require('./node-factory'),
    logger = require('log4js').getLogger('conversation');

module.exports = (function () {
  /**
   * A conversation object tracking the current dialog node with a given user
   */
  function Conversation (delegate, channel) {
    // the bot
    this.delegate = delegate;
    // the DM channel
    this.channel = delegate.service.getDMByID(channel);
    // the current dialog node
    this.node = null;
  }

  /**
   * Receive a message from the user and interact with the current node
   */
  Conversation.prototype.push = function (message) {
    var transitionNode,
        response = 'Try again, I did not understand';

    logger.info(message.user, 'sent', message.text, 'in response to node', this.node ? this.node.state : 'initial node');
    if (this.node === null) {
      // the converation has not yet started, grab the root (welcome) node
      this.node = NodeFactory.getRootNode();
      // respond with the root node message
      response = this.node.getValue();
    } else if (transition = this.node.interact(message.text)) {
      // the message has transitioned to a new node in the conversation
      this.node = transition;
      // respond with the next node message
      response = this.node.getValue();
    }
    // send the node's message to the user
    this.channel.send(response);
  };

  return Conversation;
}).call(this);
