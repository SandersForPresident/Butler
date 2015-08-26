# Butler

Our welcoming Slack bot.

This bot will welcome new users to the Slack team by entering a dialog to determine their skillset and direct them to the proper resources.



## Installation

Install dependencies:
```
npm install
```

## Running
Start the application with `SLACK_TOKEN` as an environment variable
```
SLACK_TOKEN=xxx node .
```

## How it works

The bot uses a basic finite state machine to enter a dialog with the user.

The configuration of the state machine is defind in [dialog.js](src/dialog.js) as an array of JSON objects.

[node-factory.js](src/node-factory.js) will construct all the objects into [nodes](src/node.js).

The [bot](src/bot.js) will dispatch messages to specific [conversations](src/conversation.js). A [conversation](src/conversation.js) tracks the current state of a slack conversation with a user.

As of current (800a4ffb8a7fa86d3ccad436b2caf5623ffa7928), the state machine looks as follows:

![fsm](https://cloud.githubusercontent.com/assets/656630/9482684/7fb0be3e-4b64-11e5-98db-9da4496c74b8.jpg)
