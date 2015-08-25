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
  if (message === "restart") {
    console.log('rewinding!');
    return Node.get(0);
  }

  var transitionNode = _.find(this.options, function (option) {
    console.log('comparing', option.word, 'to', message, option.word === message);
    return option.word.toLowerCase() === message.toLowerCase();
  });
  console.log('match', transitionNode);
  if (transitionNode) {
    return Node.get(transitionNode.state);
  } else {
    return false;
  }
};

Node.prototype.prompt = function (channel) {
  channel.send(this.message);
};

Node.prototype.retry = function (channel) {
  channel.send('Try again, I did not understand');
};


var nodes = _.map(states, function (state, index) {
  return new Node(index, state.message, state.options, state.type);
});

module.exports = {
  getRootNode: function () {
    return Node.get(0);
  }
};
