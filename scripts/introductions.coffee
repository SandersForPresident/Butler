# Description:
#   This is a test
#
# Commands:
#   Message hubot to learn about the group
#

module.exports = (robot) ->
  robot.adapter.client.on 'message', (user) ->
    # start a new conversation with a new user

  robot.respond /(.*?)/g, (res) ->
    if res.message.user.name == res.message.user.room
      res.send 'I am responding'
