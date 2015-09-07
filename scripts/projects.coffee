# Description
#   Allows users to find any open projects by skillset
#
# Commands
#   hubot do any projects need <phrase> - Finds any projects that require a skillset of <phrase>

_ = require 'lodash'

projectTypes =
  'website': ['html', 'css', 'javascript', 'js'],
  'web_app': ['html', 'css', 'javascript', 'js'],
  'mobile_app': ['ios', 'android', 'iphone', 'java', 'objc', 'objective c', '']

module.exports = (robot) ->
  robot.hear /projects (?!need|want|have|looking for).* (?:need|want|have|looking for) (\w+)/i, (msg) ->
    skill = msg.match[1].toLowerCase()

    msg.http('http://googledoctoapi.forberniesanders.com/1zKQZGGdKvDudZKKyds33vZMPwxt7I8soKt9qZ0t1LhE/')
    .header('User-Agent', 'Mozilla/5.0')
    .get() (err, res, body) ->
      if err
        msg.send 'I was unable to look up the projects'
        robot.emit 'error', err, res
        return

      console.log 'checking projects for ' + skill
      projects = JSON.parse(body);
      projects = _.filter projects, (project) ->
        project.slack_name && project.project_type && project.slack_channel && project.used_tech
      .map (project) ->
        project =
          'name': project.project,
          'channel': project.slack_channel,
          'leaders': project.slack_name,
          'tech': project.used_tech.toLowerCase(),
          'description': project.description,
          'type': _.snakeCase project.project_type
      .filter (project) ->
        (project.type of projectTypes && _.contains projectTypes[project.type], skill) || _.contains project.tech, skill

      if projects.length == 0
        msg.send 'We could not find any projects for ' + skill
      else
        msg.send _.map projects, (project) ->
          project.name + ' - ' + project.type + ', ' + project.tech
        .join '\n'
