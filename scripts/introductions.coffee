# Introduce a new user to the Slack group

module.exports = (robot) ->
  robot.adapter.client.on 'message', (user) ->
    # start a new conversation with a new user

  robot.respond /(.*?)/g, (res) ->
    res.send 'I am responding'
