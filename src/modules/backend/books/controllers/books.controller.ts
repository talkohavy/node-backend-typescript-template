import type { Application, Request, Response } from 'express';
import type { ControllerFactory } from '../../../../lib/lucky-server';
import type { IBooksAdapter } from '../adapters/books.adapter.interface';
import { API_URLS, StatusCodes } from '../../../../common/constants';
import { joiBodyMiddleware } from '../../../../middlewares/joi-body.middleware';
import { createBookSchema } from './dto/createBookSchema.dto';
import { updateBookSchema } from './dto/updateBookSchema.dto';

export class BooksController implements ControllerFactory {
  constructor(
    private readonly app: Application,
    private readonly booksAdapter: IBooksAdapter,
  ) {}

  private createBook() {
    this.app.post(API_URLS.books, joiBodyMiddleware(createBookSchema), async (req: Request, res: Response) => {
      this.app.logger.info(`POST ${API_URLS.books} - creating new book`);

      const { body } = req;

      const newBook = await this.booksAdapter.createBook(body);

      res.status(StatusCodes.CREATED).json(newBook);
    });
  }

  private getBooks() {
    this.app.get(API_URLS.books, async (_req, res) => {
      this.app.logger.info(`GET ${API_URLS.books} - fetching books`);

      const books = await this.booksAdapter.getBooks();

      res.json(books);
    });
  }

  private getBookById() {
    this.app.get(API_URLS.bookById, async (req: Request, res: Response) => {
      this.app.logger.info(`GET ${API_URLS.bookById} - fetching book by ID`);

      const bookId = req.params.bookId!;

      const book = await this.booksAdapter.getBookById(bookId);

      if (!book) {
        this.app.logger.error('Book not found', bookId);

        return void res.status(StatusCodes.NOT_FOUND).json({ message: 'Book not found' });
      }

      res.json(book);
    });
  }

  private updateBook() {
    this.app.put(API_URLS.bookById, joiBodyMiddleware(updateBookSchema), async (req: Request, res: Response) => {
      this.app.logger.info(`PUT ${API_URLS.bookById} - updating book by ID`);

      const bookId = req.params.bookId!;
      const book = req.body;
      const updatedBook = await this.booksAdapter.updateBook(bookId, book);

      if (!updatedBook) {
        this.app.logger.error('Book not found', bookId);

        return void res.status(StatusCodes.NOT_FOUND).json({ message: 'Book not found' });
      }

      res.json(updatedBook);
    });
  }

  private deleteBook() {
    this.app.delete(API_URLS.bookById, async (req: Request, res: Response) => {
      this.app.logger.info(`DELETE ${API_URLS.bookById} - deleting book by ID`);

      const bookId = req.params.bookId!;
      const deletedBook = await this.booksAdapter.deleteBook(bookId);

      if (!deletedBook) {
        this.app.logger.error('Book not found', bookId);

        return void res.status(StatusCodes.NOT_FOUND).json({ message: 'Book not found' });
      }

      res.json({ message: 'Book deleted successfully' });
    });
  }

  registerRoutes() {
    this.getBooks();
    this.getBookById();
    this.createBook();
    this.updateBook();
    this.deleteBook();
  }
}
