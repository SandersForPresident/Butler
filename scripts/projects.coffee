# Description
#   Allows users to find any open projects by skillset
#
# Commands
#   hubot do any projects need <phrase> - Finds any projects that require a skillset of <phrase>

_ = require 'lodash'

module.exports = (robot) ->
  robot.hear /any projects need css/i, (msg) ->
    msg.http('http://googledoctoapi.forberniesanders.com/1zKQZGGdKvDudZKKyds33vZMPwxt7I8soKt9qZ0t1LhE/')
    .header('User-Agent', 'Mozilla/5.0')
    .get() (err, res, body) ->
      if err
        msg.send 'I was unable to look up the projects'
        robot.emit 'error', err, res
        return

      projects = JSON.parse(body);
      projects = _.filter projects, (project) ->
        project.slack_name && project.project_type && project.slack_channel && project.used_tech

      msg.send _.map projects, (project) ->
        project.project
      .join '\n'

      console.log projects;
