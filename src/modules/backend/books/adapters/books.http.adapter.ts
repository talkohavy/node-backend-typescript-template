import type { CreateBookDto, UpdateBookDto } from '../../../books/services/interfaces/books.service.interface';
import type { Book } from '../../../books/types';
import type { HttpClient } from '../../logic/http-client';
import type { IBooksAdapter } from './books.adapter.interface';
import { API_URLS } from '../../../../common/constants';
import { ServiceNames } from '../../../../configurations';

export class BooksHttpAdapter implements IBooksAdapter {
  constructor(private readonly httpClient: HttpClient) {}

  async getBooks(): Promise<Array<Book>> {
    return this.httpClient.get<Array<Book>>({
      serviceName: ServiceNames.Books,
      route: API_URLS.books,
    });
  }

  async getBookById(bookId: string): Promise<Book | null> {
    const route = `${API_URLS.books}/${bookId}`;
    return this.httpClient.get<Book | null>({
      serviceName: ServiceNames.Books,
      route,
    });
  }

  async createBook(data: CreateBookDto): Promise<Book> {
    return this.httpClient.post<Book>({
      serviceName: ServiceNames.Books,
      route: API_URLS.books,
      body: data,
    });
  }

  async updateBook(bookId: string, data: UpdateBookDto): Promise<Book | null> {
    const route = `${API_URLS.books}/${bookId}`;
    return this.httpClient.patch<Book | null>({
      serviceName: ServiceNames.Books,
      route,
      body: data,
    });
  }

  async deleteBook(bookId: string): Promise<{ message: string } | null> {
    const route = `${API_URLS.books}/${bookId}`;
    return this.httpClient.delete<{ message: string } | null>({
      serviceName: ServiceNames.Books,
      route,
    });
  }
}
