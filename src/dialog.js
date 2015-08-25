var channels = {};

var states = [
  // 0 - Initial Greeting
  {
    message: [
      "Hey, is this the first time you've been here?"
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
      "No problem, Slack is a great tool for teams. You can find a lot of documentation here: <link />\n",
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
      "You can find some cool projects over in #sites-fors-sanders, #bernie-app"
    ],
    type: String
  },

  // 4 - Designer
  {
    message: [
      "Awesome, we have plenty of projects for designers",
      "Off hand, #car-pool could use some help right now"
    ],
    type: String
  },

  // 5 - Management
  {
    message: [
      "Awesome, you'll want to coordinate with @jahaz. Give him a shout!"
    ],
    type: String
  },

  // 6 - Other
  {
    message: [
      "Cool, give @jahaz a shout to see where you can come in!"
    ],
    type: String
  }
];

module.exports = states;
