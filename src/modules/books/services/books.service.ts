import type { Book } from '../types';
import type { CreateBookDto, UpdateBookDto } from './interfaces/books.service.interface';

const database: Array<Book> = [];

export class BooksService {
  constructor() {}

  async getBooks(): Promise<Array<Book>> {
    return database;
  }

  async getBookById(userId: string): Promise<Book | null> {
    const book = database.find((book) => book.id === Number.parseInt(userId, 10));

    if (!book) return null;

    return book;
  }

  async createBook(book: CreateBookDto): Promise<Book> {
    const newBook = {
      id: database.length + 1,
      name: book.name,
      author: book.author,
      publishedYear: book.publishedYear,
    };

    database.push(newBook);

    return newBook;
  }

  async updateBook(userId: string, user: UpdateBookDto): Promise<Book | null> {
    const parsedId = Number.parseInt(userId, 10);
    const bookIndex = database.findIndex((book) => book.id === parsedId);

    if (bookIndex === -1) return null;

    database[bookIndex] = { ...database[bookIndex], ...user } as Book;

    return database[bookIndex];
  }

  async deleteBook(userId: string) {
    const parsedId = Number.parseInt(userId, 10);
    const bookIndex = database.findIndex((book) => book.id === parsedId);

    if (bookIndex === -1) return null;

    database.splice(bookIndex, 1);

    return { message: 'Book deleted successfully' };
  }
}
