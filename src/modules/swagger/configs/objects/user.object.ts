export const UserObject = {
  type: 'object',
  required: ['id', 'email', 'nickname'],
  properties: {
    id: { type: 'integer', format: 'int64', example: 5 },
    email: { type: 'string', format: 'email', example: 'talkohavy@gmail.com' },
    hashed_password: { type: 'string', example: '123456' },
    nickname: { type: 'string', example: 'alin' },
    date_of_birth: {
      type: 'string',
      format: 'date-time',
      example: '2000-08-16T21:00:00.000Z',
    },
    created_at: {
      type: 'string',
      format: 'date-time',
      example: '2025-09-30T14:45:15.301Z',
    },
    updated_at: {
      type: 'string',
      format: 'date-time',
      example: '2025-09-30T14:48:33.419Z',
    },
  },
};
