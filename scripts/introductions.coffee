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
  getWelcomeMessage = (channelID) ->
    [
      'Hey, welcome to our Slack group!',
      'My name is Butler, and I try to make it easier for everyone to find what they\'re looking for.',
      'You can ask me things like:',
      '- Are there any projects that need &lt;phrase&gt;?',
      'To list projects from a channel you can say:',
      '- butler list projects',
      'Or DM me directly:',
      '- list projects',
      '\n',
      'For now, you should introduce yourself in the <#' + channelID + '> channel and browse some of our projects!'
    ].join('\n')


  # Introduce the robot to new users
  robot.adapter.client.on 'userChange', (user) ->
    if user.id && !user.deleted && ! user.is_bot
      setTimeout ->
        introChannel = robot.adapter.client.getChannelByName('introduction')
        robot.send {room: user.name}, getWelcomeMessage(introChannel.id)
      , SAFE_TTL

  #
  # robot.respond /(.*?)/g, (res) ->
  #   if res.message.user.name == res.message.user.room
  #     res.send 'I am responding'
