import express from 'express';
import request from 'supertest';
import type { ConfiguredExpress } from '../../../common/types';
import type { BooksService } from '../services/books.service';
import { API_URLS, StatusCodes } from '../../../common/constants';
import { BooksController } from './books.controller';

jest.mock('../../../middlewares/joi-body.middleware', () => ({
  joiBodyMiddleware: jest.fn(() => (_req: any, _res: any, next: any) => next()),
}));

describe('BooksController', () => {
  let app: ConfiguredExpress;
  let mockBooksService: jest.Mocked<BooksService>;

  beforeEach(() => {
    app = express() as ConfiguredExpress;
    app.use(express.json());

    app.logger = {
      info: jest.fn(),
      error: jest.fn(),
    } as any;

    mockBooksService = {
      getBooks: jest.fn(),
      getBookById: jest.fn(),
      createBook: jest.fn(),
      updateBook: jest.fn(),
      deleteBook: jest.fn(),
    } as any;

    const controller = new BooksController(app, mockBooksService);
    controller.registerRoutes();
  });

  describe('GET /api/books', () => {
    it('should return all books', async () => {
      const mockBooks = [
        { id: 1, name: 'Book 1', author: 'Author 1', publishedYear: 2020 },
        { id: 2, name: 'Book 2', author: 'Author 2', publishedYear: 2021 },
      ];

      mockBooksService.getBooks.mockResolvedValue(mockBooks);

      const response = await request(app).get(API_URLS.books);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(mockBooks);
      expect(mockBooksService.getBooks).toHaveBeenCalled();
      expect(app.logger.info).toHaveBeenCalledWith(`GET ${API_URLS.books} - fetching books`);
    });
  });

  describe('GET /api/books/:bookId', () => {
    it('should return a book when found', async () => {
      const mockBook = { id: 1, name: 'Test Book', author: 'Test Author', publishedYear: 2022 };

      mockBooksService.getBookById.mockResolvedValue(mockBook);

      const response = await request(app).get(`${API_URLS.books}/1`);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(mockBook);
      expect(mockBooksService.getBookById).toHaveBeenCalledWith('1');
    });

    it('should return 404 when book not found', async () => {
      mockBooksService.getBookById.mockResolvedValue(null);

      const response = await request(app).get(`${API_URLS.books}/999`);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toEqual({ message: 'Book not found' });
      expect(app.logger.error).toHaveBeenCalledWith('Book not found', '999');
    });
  });

  describe('POST /api/books', () => {
    it('should create a new book', async () => {
      const bookData = { name: 'New Book', author: 'New Author', publishedYear: 2023 };
      const mockCreatedBook = { id: 1, ...bookData };

      mockBooksService.createBook.mockResolvedValue(mockCreatedBook);

      const response = await request(app).post(API_URLS.books).send(bookData);

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toEqual(mockCreatedBook);
      expect(mockBooksService.createBook).toHaveBeenCalledWith(bookData);
    });
  });

  describe('PUT /api/books/:bookId', () => {
    it('should update an existing book', async () => {
      const updateData = { name: 'Updated Name' };
      const mockUpdatedBook = { id: 1, name: 'Updated Name', author: 'Author', publishedYear: 2020 };

      mockBooksService.updateBook.mockResolvedValue(mockUpdatedBook);

      const response = await request(app).put(`${API_URLS.books}/1`).send(updateData);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(mockUpdatedBook);
      expect(mockBooksService.updateBook).toHaveBeenCalledWith('1', updateData);
    });

    it('should return 404 when book not found', async () => {
      mockBooksService.updateBook.mockResolvedValue(null);

      const response = await request(app).put(`${API_URLS.books}/999`).send({ name: 'Updated' });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toEqual({ message: 'Book not found' });
      expect(app.logger.error).toHaveBeenCalledWith('Book not found', '999');
    });
  });

  describe('DELETE /api/books/:bookId', () => {
    it('should delete an existing book', async () => {
      mockBooksService.deleteBook.mockResolvedValue({ message: 'Book deleted successfully' });

      const response = await request(app).delete(`${API_URLS.books}/1`);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual({ message: 'Book deleted successfully' });
      expect(mockBooksService.deleteBook).toHaveBeenCalledWith('1');
    });

    it('should return 404 when book not found', async () => {
      mockBooksService.deleteBook.mockResolvedValue(null);

      const response = await request(app).delete(`${API_URLS.books}/999`);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toEqual({ message: 'Book not found' });
      expect(app.logger.error).toHaveBeenCalledWith('Book not found', '999');
    });
  });
});
