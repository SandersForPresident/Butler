var states = require('./dialog'),
    _ = require('lodash');

function Node (state, message, options, type) {
  Node.nodes.push(this);

  this.state = state;
  this.message = Array.isArray(message) ? message.join(' ') : message;
  this.options = options;
  this.type = type;
}

Node.nodes = [];

// static accessor
Node.get = function (state) {
  return Node.nodes[state] || false;
};

Node.prototype.interact = function (message) {
  var transitionNode;
  if (message === "restart") {
    console.log('rewinding!');
    return Node.get(0);
  }

  transitionNode = _.find(this.options, function (option) {
    console.log('comparing', option.word, 'to', message);
    if (option.regex) {
      return option.regex.test(message);
    } else {
      option.word.toLowerCase === message.toLowerCase();
    }
  });

  console.log('match', transitionNode);
  if (transitionNode) {
    return Node.get(transitionNode.state);
  } else {
    return false;
  }
};

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

var nodes = _.map(states, function (state, index) {
  return new Node(index, state.message, state.options, state.type);
});

module.exports = {
  getRootNode: function () {
    return Node.get(0);
  }
};
