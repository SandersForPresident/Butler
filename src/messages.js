var _ = require('lodash'),
    Responses = require('./bot-responses');

module.exports = (function () {
  var service;

  // take the messages JSON file and construct an object, modeled off the JSON structure
  // and provide function endpoints for each leaf to sample the available messages
  function recusivelyBuildServiceResponses (value) {
    if (_.isObject(value) && !_.isArray(value)) {
      return _.reduce(value, function (childObject, value, property) {
        childObject[_.camelCase(property)] = recusivelyBuildServiceResponses(value);
        return childObject;
      }, {});
    } else {
      return function () {
        if (_.isArray(value)) {
          return _.sample(value);
        } else {
          return value;
        }
      };
    }
  }

  service = recusivelyBuildServiceResponses(Responses);

  return service;
}).call(this);
