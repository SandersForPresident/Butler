var channels = {};

var states = [
  // 0 - Initial Greeting
  {
    message: [
      "Hey, I'm Mr. Butler. I'm currently under development, but I'm going to be greeting new members and helping them find their way around here.\n",
      "Let's get started! Is this the first time you've used Slack?"
    ],
    type: Boolean,
    options: [
      {
        word: 'Yes',
        state: 1,
        regex: /[y]+(es|e|a)*$/i
      }, {
        word: 'No',
        state: 2,
        regex: /[n]/i
      }
    ]
  },

  // 1 - Newcomer
  {
    message: [
      "No problem, Slack is a great tool for teams. You can find a lot of documentation here on slack.com\n",
      "To start, what are you interested in?"
    ],
    options: [
      {
        word: 'Development',
        state: 3,
        regex: /[d]+(ev)+/i
      }, {
        word: 'Design',
        state: 4,
        regex: /[d]+(es)+/i
      }, {
        word: 'Managing',
        state: 5,
        regex: /(man)+/i
      }, {
        word: 'Other',
        state: 6,
        regex: /(other)+/i
      }
    ],
    type: String
  },

  // 2 - Experienced
  {
    message: [
      "Great, you know your way around here then\n",
      "To start, what are you interested in?"
    ],
    type: String,
    options: [
      {
        word: 'Development',
        state: 3,
        regex: /[d]+(ev)+/i
      }, {
        word: 'Design',
        state: 4,
        regex: /[d]+(es)+/i
      }, {
        word: 'Managing',
        state: 5,
        regex: /(man)+/i
      }, {
        word: 'Other',
        state: 6,
        regex: /(other)+/i
      }
    ]
  },

  // 3 - Developer
  {
    message: [
      "Awesome, we have plenty of projects for developers.",
      "You can find some cool projects over in #sites-for-sanders, #bernie-app\n",
      "You can say 'restart' to start our conversation over again"
    ],
    type: String
  },

  // 4 - Designer
  {
    message: [
      "Awesome, we have plenty of projects for designers",
      "Off hand, #car-pool could use some help right now\n",
      "You can say 'restart' to start our conversation over again"
    ],
    type: String
  },

  // 5 - Management
  {
    message: [
      "Awesome, you'll want to coordinate with @jahaz. Give him a shout!\n",
      "You can say 'restart' to start our conversation over again"
    ],
    type: String
  },

  // 6 - Other
  {
    message: [
      "Cool, give @jahaz a shout to see where you can come in!\n",
      "You can say 'restart' to start our conversation over again"
    ],
    type: String
  }
];

module.exports = states;
