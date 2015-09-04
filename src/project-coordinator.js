var ProjectDataService = require('./services/project-data'),
    _ = require('lodash');

module.exports = (function () {
  function ProjectCoordinatorService (delegate) {
    this.delegate = delegate;
    this.service = new ProjectDataService();
  }

  ProjectCoordinatorService.prototype.parseSkills = function (message) {

  };

  ProjectCoordinatorService.prototype.lookupProject = function (user, message, channel) {
    return this.service.getProjects().then(function (projects) {
      var projectMessages = _.map(projects, function (project) {
        return project.project + ', in ' + project.slack_channel + ' lead by ' + project.slack_name;
      }).join('\n- ');
      var message = [
        'I\'ve found the following projects:\n',
        projectMessages
      ];
      channel.send(message.join(' '));
      console.log('messages', message.join(' '));;
    });
  };

  return ProjectCoordinatorService;
}).call(this);
