export type Book = {
  id: number;
  name: string;
  author: string;
  publishedYear: number;
};

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
