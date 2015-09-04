var Promise = require('bluebird'),
    request = require('request-promise'),
    _ = require('lodash');

module.exports = (function () {
  var ENDPOINT = 'http://googledoctoapi.forberniesanders.com/1zKQZGGdKvDudZKKyds33vZMPwxt7I8soKt9qZ0t1LhE';

  function ProjectDataService () {

  }

  ProjectDataService.prototype.getProjects = function () {
    return request(ENDPOINT).then(JSON.parse).then(function (projects) {
      return _.filter(projects, function (project) {
        return project && project.project && project.slack_name && project.slack_channel && project.used_tech;
      });
    });
  };

  return ProjectDataService;
}).call(this);
