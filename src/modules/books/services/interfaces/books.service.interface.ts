export type CreateBookDto = {
  name: string;
  author: string;
  publishedYear: number;
};

export type UpdateBookDto = {
  name?: string;
  author?: string;
  publishedYear?: number;
};
