var _ = require('lodash');

module.exports = (function () {
  function Node (state, message, options) {
    // append the node to the static tree
    Node.nodes.push(this);

    // the state value of the node
    this.state = state;
    // the node's message
    this.message = Array.isArray(message) ? message.join(' ') : message;
    // the options available to the node
    this.options = options;
  }

  // static collection of nodes
  Node.nodes = [];

  // static node accessor
  Node.get = function (state) {
    return Node.nodes[state] || null;
  };

  /**
   * Handle an interaction with the node.
   * - Return the next state (node) based on the input message
   * - Return the root node in the case of a rewinding
   * - Return `null` if there is no transition
   */
  Node.prototype.interact = function (message) {
    var transitionNode;
    if (message === "restart") {
      return Node.get(0);
    }

    // find the node to transition to based on the options
    transitionNode = _.find(this.options, function (option) {
      if (option.regex) {
        // if the transition has a regex value, match it
        return option.regex.test(message);
      } else {
        // otherwise check if the input matches the option value
        return option.word.toLowerCase() === message.toLowerCase();
      }
    });

    if (transitionNode) {
      // if we have a new node to transition to, return it
      return Node.get(transitionNode.state);
    } else {
      // if no inputs are satisfied, there is no transition
      return null;
    }
  };

  /**
   * Gets the formatted message value of the node. If there are options, they are formatted into a comma delimited list
   */
  Node.prototype.getValue = function () {
    var output = _.map(this.options, function (option) {
      return option.word;
    });
    if (output.length > 1) {
      output[output.length - 1] = 'or ' + output[output.length - 1];
    }
    return [
      this.message,
      '\n',
      output.join(output.length > 2 ? ', ' : ' ')
    ].join(' ');
  };

  return Node;
}).call(this);
