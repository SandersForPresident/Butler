# Butler

Our welcoming Slack bot.


## Conversation

The conversation flow can be edited in `src/dialog.js`

## Installation

Install dependencies:
```
npm install
```

Add environment configuration
```
touch .config.env.json
```

Add a slack token
```json
{
  "slack" : {
    "key": "XXX"
  }
}
```

## Running

```
node .
```
