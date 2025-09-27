import { Application } from 'express';
import { StatusCodes } from '../../../common/constants';
import { logger } from '../../../core';
import { ControllerFactory } from '../../../lib/controller-factory/controller-factory';
import { joiBodyMiddleware } from '../../../middlewares/joiBodyMiddleware';
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
    this.app.get('/books', async (_req, res) => {
      logger.info('GET /books - fetching books');

      const books = await this.booksService.getBooks();

      res.json(books);
    });
  }

  getBookById() {
    this.app.get('/books/:id', async (req, res): Promise<any> => {
      logger.info('GET /books/:id - fetching book by ID');

      const bookId = req.params.id;

      const book = await this.booksService.getBookById(bookId);

      if (!book) {
        logger.error('Book not found', bookId);

        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Book not found' });
      }

      res.json(book);
    });
  }

  createBook() {
    this.app.post('/books', joiBodyMiddleware(createBookSchema), async (req, res) => {
      logger.info('POST /books - creating new book');

      const { body } = req;

      const newBook = await this.booksService.createBook(body);

      res.status(StatusCodes.CREATED).json(newBook);
    });
  }

  updateBook() {
    this.app.put('/books/:id', async (req, res): Promise<any> => {
      logger.info('PUT /books/:id - updating book by ID');

      const bookId = req.params.id;
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
    this.app.delete('/books/:id', async (req, res): Promise<any> => {
      logger.info('DELETE /books/:id - deleting book by ID');

      const bookId = req.params.id;
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
