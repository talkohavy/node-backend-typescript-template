import { Application } from 'express';
import { API_URLS, StatusCodes } from '../../../common/constants';
import { logger } from '../../../core';
import { ControllerFactory } from '../../../lib/lucky-server';
import { joiBodyMiddleware } from '../../../middlewares/joi-body.middleware';
import { BooksService } from '../services/books.service';
import { createBookSchema } from './dto/books.dto';

export class BooksController implements ControllerFactory {
  app: Application;
  booksService: BooksService;

  constructor(app: Application, booksService: BooksService) {
    this.app = app;
    this.booksService = booksService;
  }

  getBooks() {
    this.app.get(API_URLS.books, async (_req, res) => {
      logger.info(`GET ${API_URLS.books} - fetching books`);

      const books = await this.booksService.getBooks();

      res.json(books);
    });
  }

  getBookById() {
    this.app.get(API_URLS.bookById, async (req, res): Promise<any> => {
      logger.info(`GET ${API_URLS.bookById} - fetching book by ID`);

      const bookId = req.params.bookId!;

      const book = await this.booksService.getBookById(bookId);

      if (!book) {
        logger.error('Book not found', bookId);

        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Book not found' });
      }

      res.json(book);
    });
  }

  createBook() {
    this.app.post(API_URLS.books, joiBodyMiddleware(createBookSchema), async (req, res) => {
      logger.info(`POST ${API_URLS.books} - creating new book`);

      const { body } = req;

      const newBook = await this.booksService.createBook(body);

      res.status(StatusCodes.CREATED).json(newBook);
    });
  }

  updateBook() {
    this.app.put(API_URLS.bookById, async (req, res): Promise<any> => {
      logger.info(`PUT ${API_URLS.bookById} - updating book by ID`);

      const bookId = req.params.bookId!;
      const book = req.body;
      const updatedBook = await this.booksService.updateBook(bookId, book);

      if (!updatedBook) {
        logger.error('Book not found', bookId);

        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Book not found' });
      }

      res.json(updatedBook);
    });
  }

  deleteBook() {
    this.app.delete(API_URLS.bookById, async (req, res): Promise<any> => {
      logger.info(`DELETE ${API_URLS.bookById} - deleting book by ID`);

      const bookId = req.params.bookId!;
      const deletedBook = await this.booksService.deleteBook(bookId);

      if (!deletedBook) {
        logger.error('Book not found', bookId);

        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Book not found' });
      }

      res.json({ message: 'Book deleted successfully' });
    });
  }

  attachRoutes() {
    this.getBooks();
    this.getBookById();
    this.createBook();
    this.updateBook();
    this.deleteBook();
  }
}
