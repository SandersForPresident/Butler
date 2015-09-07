# Description:
#   This is a test
#
# Commands:
#   Message hubot to learn about the group
#

module.exports = (robot) ->
  # Have to bypass the typical robot dispatcher as userChange is a private event
  SAFE_TTL = 10000

  # The message to greet new users
  welcomeMessage = [
    'Hey, welcome to our Slack group!',
    'My name is Butler, and I try to make it easier for everyone to find what they\'re looking for.',
    'You can ask me things like:',
    '- Are there any projects that need &lt;phrase&gt;?',
    '- I need help with &lt;phrase&gt;',
    '- Does anyone need help?',
    '\n',
    'For now, you should introduce yourself in the <#introduction> channel and browse some of our projects!'
  ].join('\n')

  # Introduce the robot to new users
  robot.adapter.client.on 'userChange', (user) ->
    if user.id && !user.deleted && ! user.is_bot
      setTimeout ->
        robot.send {room: user.name}, welcomeMessage
      , SAFE_TTL


  robot.respond /(.*?)/g, (res) ->
    if res.message.user.name == res.message.user.room
      res.send 'I am responding'
