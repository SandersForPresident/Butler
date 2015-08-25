var Node = require('./node'),
    states = require('./dialog'),
    _ = require('lodash'),
    nodes;

nodes = _.map(states, function (state, index) {
  return new Node(index, state.message, state.options, state.type);
});

module.exports = {
  getRootNode: function () {
    return Node.get(0);
  }
};
