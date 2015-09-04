var states = [
  // 0 - Initial Greeting
  {
    message: [
      "Hey! :wave:\n",
      "Welcome to our Slack group :simple_smile:\n",
      "I'm here to help get you started and point you to the right resources and people.\n",
      "So let's get right to it -- have you used Slack before?"
    ],
    type: Boolean,
    options: [
      {
        word: 'Yes',
        state: 2,
        regex: /[y]+(es|e|a)*$/i
      }, {
        word: 'No',
        state: 1,
        regex: /[n]/i
      }
    ]
  },

  // 1 - Newcomer
  {
    message: [
      "Not a problem! Slack is a great tool for teams. You can find a lot information on their website in how it works https://slack.com.\n",
      "On the left sidebar is where you'll different channels and people. Most of our channels are made up of groups working on different projects.\n",
      "Feel free to poke around and drop by different channels to see what people are working on.\n",
      "In the meantime, I can help point you in the right direction. First, what are you interested in?"
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
      "Great, you know your way around here then!\n",
      "As you can guess, we have a handful of channels. Most of them are split up by project. Feel free to poke around and drop by different channels to see what people are working on.\n",
      "In the meantime, I can help point you in the right direction. First, what are you interested in?"
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
      "Here's a few that I can think of broken down by platform:\n",
      "*Android, iOS, and other mobile platform development*\n",
      "- #bernie-app - The bernie app\n",
      "\n",
      "*Web application development*\n",
      "- #berniestrap - Bernie Sanders theme of the Twitter Bootstrap fork\n",
      "- #bus-rsvp - Reserve seats in busses to travel to a Bernie event\n",
      "- #carpool-app - Organize rides to travel to a Bernie event\n",
      "- #elastic-search-es4bs - ElasticSearch API for all our Bernie apps\n",
      "- #map-berniesanders - The map on https://map.berniesanders.com\n",
      "- #sites-for-bernie - The http://forberniesanders.com project\n",
      "\n\n",
      "Those are just a few of the many projects we have going on. You will find new ideas brewing in #pitch-zone\n",
      "If you'd like to learn more, feel free to reach out to some of our mods @jahaz, @atticusw, @schneidmaster, @rcas, @jonculver, or @validatorian!"
    ],
    type: String
  },

  // 4 - Designer
  {
    message: [
      "Awesome, we have plenty of projects for designers",
      "Here's a few that I can think of broken down by platform:\n",
      "*Android, iOS, and other mobile platform development*\n",
      "- #bernie-app - The bernie app\n",
      "\n",
      "*Web application development*\n",
      "- #berniestrap - Bernie Sanders theme of the Twitter Bootstrap fork\n",
      "- #bus-rsvp - Reserve seats in busses to travel to a Bernie event\n",
      "- #carpool-app - Organize rides to travel to a Bernie event\n",
      "- #elastic-search-es4bs - ElasticSearch API for all our Bernie apps\n",
      "- #map-berniesanders - The map on https://map.berniesanders.com\n",
      "- #sites-for-bernie - The http://forberniesanders.com project\n",
      "\n\n",
      "Those are just a few of the many projects we have going on. You will find new ideas brewing in #pitch-zone\n",
      "If you'd like to learn more, feel free to reach out to some of our mods @jahaz, @atticusw, @schneidmaster, @rcas, @jonculver, or @validatorian!"
    ],
    type: String
  },

  // 5 - Management
  {
    message: [
      "Awesome, you'll want to coordinate with @jahaz. Give him a shout!\n"
    ],
    type: String
  },

  // 6 - Other
  {
    message: [
      "Cool, give @jahaz a shout to see where you can come in!\n"
    ],
    type: String
  }
];

module.exports = states;
