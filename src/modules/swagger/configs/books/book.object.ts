export const BookObject = {
  type: 'object',
  required: ['id', 'name', 'author', 'publishedYear'],
  properties: {
    id: { type: 'integer', format: 'int64', example: 1 },
    name: { type: 'string', example: 'The Great Gatsby' },
    author: { type: 'string', example: 'F. Scott Fitzgerald' },
    publishedYear: { type: 'integer', example: 1925 },
  },
};
