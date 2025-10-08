import type { Application, Request, Response } from 'express';
import type { ControllerFactory } from '../../../lib/lucky-server';
import type { BooksService } from '../services/books.service';
import { API_URLS, StatusCodes } from '../../../common/constants';
import { logger } from '../../../core';
import { joiBodyMiddleware } from '../../../middlewares/joi-body.middleware';
import { createBookSchema } from './dto/books.dto';

export class BooksController implements ControllerFactory {
  constructor(
    private readonly app: Application,
    private readonly booksService: BooksService,
  ) {}

  private getBooks() {
    this.app.get(API_URLS.books, async (_req, res) => {
      logger.info(`GET ${API_URLS.books} - fetching books`);

      const books = await this.booksService.getBooks();

      res.json(books);
    });
  }

  private getBookById() {
    this.app.get(API_URLS.bookById, async (req: Request, res: Response) => {
      logger.info(`GET ${API_URLS.bookById} - fetching book by ID`);

      const bookId = req.params.bookId!;

      const book = await this.booksService.getBookById(bookId);

      if (!book) {
        logger.error('Book not found', bookId);

        return void res.status(StatusCodes.NOT_FOUND).json({ message: 'Book not found' });
      }

      res.json(book);
    });
  }

  private createBook() {
    this.app.post(API_URLS.books, joiBodyMiddleware(createBookSchema), async (req: Request, res: Response) => {
      logger.info(`POST ${API_URLS.books} - creating new book`);

      const { body } = req;

      const newBook = await this.booksService.createBook(body);

      res.status(StatusCodes.CREATED).json(newBook);
    });
  }

  private updateBook() {
    this.app.put(API_URLS.bookById, async (req: Request, res: Response) => {
      logger.info(`PUT ${API_URLS.bookById} - updating book by ID`);

      const bookId = req.params.bookId!;
      const book = req.body;
      const updatedBook = await this.booksService.updateBook(bookId, book);

      if (!updatedBook) {
        logger.error('Book not found', bookId);

        return void res.status(StatusCodes.NOT_FOUND).json({ message: 'Book not found' });
      }

      res.json(updatedBook);
    });
  }

  private deleteBook() {
    this.app.delete(API_URLS.bookById, async (req: Request, res: Response) => {
      logger.info(`DELETE ${API_URLS.bookById} - deleting book by ID`);

      const bookId = req.params.bookId!;
      const deletedBook = await this.booksService.deleteBook(bookId);

      if (!deletedBook) {
        logger.error('Book not found', bookId);

        return void res.status(StatusCodes.NOT_FOUND).json({ message: 'Book not found' });
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
