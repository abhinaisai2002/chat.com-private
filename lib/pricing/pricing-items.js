const { PLANS } = require("./config/stripe");

export const pricingItems = [
    {
      plan: 'Free',
      tagline: 'For a user with less no.of boards',
      quota: 5,
      features: [
        {
          text: '5 boards per account',
          footnote:
            'The users can have a limit of 5 boards',
        },
        {
          text: 'Can download the images',
          footnote:
            'Users can download the image of the canvas into the device.',
        },
        {
          text: 'Priority support',
          negative: true,
        },
      ],
    },
    {
      plan: 'Pro',
      tagline: 'For a user with more no.of boards',
      quota: PLANS.find((p) => p.slug === 'pro').quota,
      features: [
        {
          text: 'More than 5 boards per account',
          footnote:
            'The users can have more no.of boards than free plan.',
        },
        {
          text: 'Can download the images',
          footnote:
            'Users can download the image of the canvas into the device.',
        },
        {
          text: 'Priority support',
        },
      ],
    },
  ]