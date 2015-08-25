var channels = {};

var states = [
  // 0 - Initial Greeting
  {
    message: [
      "Hey, is this the first time you've been here?\n",
      "Yes or No"
    ],
    type: Boolean,
    options: [
      {
        word: 'Yes',
        state: 1,
        regex: ''
      }, {
        word: 'No',
        state: 2,
        regex: ''
      }
    ]
  },

  // 1 - Newcomer
  {
    message: [
      "No problem, Slack is a great tool for teams. You can find a lot of documentation here: <link />\n",
      "To start, what are you interested in?\n",
      "Development, Design, Managing, or Other"
    ],
    options: [
      {
        word: 'Development',
        state: 3,
        regex: ''
      }, {
        word: 'Design',
        state: 4,
        regex: ''
      }, {
        word: 'Managing',
        state: 5,
        regex: ''
      }, {
        word: 'Other',
        state: 6,
        regex: ''
      }
    ],
    type: String
  },

  // 2 - Experienced
  {
    message: [
      "Great, you know your way around here then\n",
      "To start, what are you interested in?\n",
      "Development, Design, Managing, or Other"
    ],
    type: String,
    options: [
      {
        word: 'Development',
        state: 3,
        regex: ''
      }, {
        word: 'Design',
        state: 4,
        regex: ''
      }, {
        word: 'Managing',
        state: 5,
        regex: ''
      }, {
        word: 'Other',
        state: 6,
        regex: ''
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
