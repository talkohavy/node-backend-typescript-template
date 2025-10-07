export const DEFINITION_REFS = {
  login: '#/definitions/login',
  register: '#/definitions/register',
  verb: '#/definitions/verb',
  user: '#/definitions/User',
};

export const definitions = {
  login: {
    type: 'object',
    properties: {
      email: { type: 'string', example: 'talkohavy2@gmail.com' },
      password: { type: 'string', example: '1' },
    },
  },
  register: {
    type: 'object',
    required: ['isAgreeToTerms', 'password'],
    properties: {
      myGender: { type: 'integer', minimum: 1, maximum: 2, example: 1 },
      email: { type: 'string', example: 'new-email@gmail.com' },
      nickname: { type: 'string', example: 'your-lover-boy' },
      otherGender: { type: 'integer', minimum: 1, maximum: 2, example: 2 },
      inPurposeOf: {
        type: 'array',
        uniqueItems: true,
        items: { type: 'integer', minimum: 0, maximum: 3 },
        example: [1, 3, 2],
      },
      birthYear: { type: 'integer', minimum: 1970, maximum: 2005, example: 1988 },
      birthMonth: { type: 'integer', minimum: 1, maximum: 12, example: 11 },
      birthDay: { type: 'integer', minimum: 1, maximum: 31, example: 28 },
      password: {
        type: 'string',
        format: 'password',
        minLength: 1,
        maxLength: 10,
        example: '123456',
      },
      isAgreeToTerms: { type: 'boolean', example: true },
    },
  },
  verb: {
    type: 'object',
    properties: {
      verbID: {
        type: 'number',
        description: "Choose between: 'iWatched' (1) | 'iBlocked' (2) | 'iLiked' (3) | 'iGranted' (4) .",
        example: 1,
        enum: [1, 2, 3, 4],
      },
    },
  },
  User: {
    type: 'object',
    required: ['nickname', 'email', 'myDetails'],
    properties: {
      userID: { type: 'integer', format: 'int64', example: 1 },
      nickname: { type: 'string', example: 'YourLoveBoy' },
      email: { type: 'string', example: 'talkohavy@gmail.com' },
      countWhoWatchedMe: { type: 'integer', format: 'int64', example: 5 },
      countWhoLikedMe: { type: 'integer', format: 'int64', example: '0' },
      registerDate: {
        type: 'integer',
        format: 'int64',
        example: 44444444,
      },
      lastSeen: {
        type: 'integer',
        format: 'int64',
        example: 1661380650.832,
      },
      myDetails: {
        type: 'object',
        properties: {
          gender: {
            type: 'integer',
            example: 2,
            enum: [1, 2],
          },
          birthDate: { type: 'integer', example: 585003600 },
          city: { type: 'string', example: 'פתח תקווה' },
          inPurposeOf: {
            type: 'array',
            items: { type: 'integer' },
            example: [0, 2, 3],
            enum: [1, 2, 3, 4],
          },
          bodyType: {
            type: 'integer',
            example: 4,
            enum: [1, 2, 3, 4],
          },
          height: {
            type: 'integer',
            example: 0,
            enum: Array.from(Array(201 - 100)).map((num) => 100 + num),
          },
          eyeColor: {
            type: 'integer',
            example: 0,
            enum: Array.from(Array(11)),
          },
          hairColor: {
            type: 'integer',
            example: 4,
            enum: Array.from(Array(6)),
          },
          smokingHabits: {
            type: 'integer',
            example: 1,
            enum: Array.from(Array(6)),
          },
          drinkingHabits: {
            type: 'integer',
            example: 1,
            enum: Array.from(Array(6)),
          },
          relStatus: {
            type: 'integer',
            example: 5,
            enum: Array.from(Array(6)),
          },
          languages: {
            type: 'array',
            items: { type: 'integer' },
            example: [0, 2],
            enum: Array.from(Array(6)),
          },
          describeMe: { type: 'string', example: '' },
          littleAboutMe: {
            type: 'array',
            items: { type: 'integer' },
            example: [0, 2, 8, 10, 16],
            enum: Array.from(Array(6)),
          },
          myLoves: {
            type: 'array',
            items: { type: 'integer' },
            example: [0, 2, 16, 19, 28],
            enum: Array.from(Array(6)),
          },
          turnsMeOn: {
            type: 'array',
            items: { type: 'integer' },
            example: [0, 1, 7, 13, 16, 15],
            enum: Array.from(Array(6)),
          },
          images: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                path: {
                  type: 'object',
                  properties: {
                    xlarge: { type: 'string', example: 'http://xlarge' },
                    large: { type: 'string', example: 'https://large' },
                    medium: { type: 'string', example: 'http://medium' },
                    small: { type: 'string', example: 'https://small' },
                    xsmall: { type: 'string', example: 'http://xsmall' },
                  },
                },
                imageId: { type: 'string', example: 'abcd-abcd-abcd-abcd' },
                isMain: { type: 'integer', example: 1, enum: [0, 1] },
                lastUpdated: { type: 'integer', example: 1651347804 },
              },
            },
          },
          hasImage: { type: 'boolean', example: false },
          age: {
            type: 'integer',
            example: 34,
            enum: Array.from(Array(65 - 18)).map((num) => 18 + num),
          },
        },
      },
    },
    // xml: { name: 'User' },
  },
};
