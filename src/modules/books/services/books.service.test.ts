import { BooksService } from './books.service';

describe('BooksService', () => {
  let service: BooksService;

  beforeEach(() => {
    service = new BooksService();
  });

  describe('getBooks', () => {
    it('should return all books', async () => {
      await service.createBook({ name: 'Book 1', author: 'Author 1', publishedYear: 2020 });
      await service.createBook({ name: 'Book 2', author: 'Author 2', publishedYear: 2021 });

      const books = await service.getBooks();

      expect(books.length).toBeGreaterThanOrEqual(2);
      expect(books[books.length - 2]).toMatchObject({ name: 'Book 1', author: 'Author 1' });
      expect(books[books.length - 1]).toMatchObject({ name: 'Book 2', author: 'Author 2' });
    });
  });

  describe('getBookById', () => {
    it('should return a book when found', async () => {
      const created = await service.createBook({ name: 'Test Book', author: 'Test Author', publishedYear: 2022 });

      const book = await service.getBookById(String(created.id));

      expect(book).toMatchObject({ name: 'Test Book', author: 'Test Author', publishedYear: 2022 });
    });

    it('should return null when book not found', async () => {
      const book = await service.getBookById('999999');

      expect(book).toBeNull();
    });
  });

  describe('createBook', () => {
    it('should create a new book', async () => {
      const bookData = { name: 'New Book', author: 'New Author', publishedYear: 2023 };

      const result = await service.createBook(bookData);

      expect(result).toMatchObject(bookData);
      expect(result.id).toBeDefined();
    });
  });

  describe('updateBook', () => {
    it('should update an existing book', async () => {
      const created = await service.createBook({ name: 'Old Name', author: 'Old Author', publishedYear: 2020 });

      const result = await service.updateBook(String(created.id), { name: 'Updated Name' });

      expect(result).toMatchObject({ name: 'Updated Name', author: 'Old Author', publishedYear: 2020 });
    });

    it('should return null when book not found', async () => {
      const result = await service.updateBook('999999', { name: 'Updated' });

      expect(result).toBeNull();
    });
  });

  describe('deleteBook', () => {
    it('should delete an existing book', async () => {
      const created = await service.createBook({ name: 'To Delete', author: 'Author', publishedYear: 2020 });

      const result = await service.deleteBook(String(created.id));

      expect(result).toEqual({ message: 'Book deleted successfully' });

      const book = await service.getBookById(String(created.id));
      expect(book).toBeNull();
    });

    it('should return null when book not found', async () => {
      const result = await service.deleteBook('999999');

      expect(result).toBeNull();
    });
  });
});
