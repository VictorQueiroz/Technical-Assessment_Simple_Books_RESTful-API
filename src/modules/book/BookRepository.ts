import { IBook, IBookList, IInputBook } from "./types";

export class BookRepository {
  readonly #books: IBook[] = [];

  /**
   * Retrieves a list of all books, with pagination options.
   *
   * @param {number} [offset=0] The number of books to skip before returning results.
   * @param {number} [limit=10] The maximum number of books to return.
   * @returns {IBookList} A paginated list of books with total count.
   */
  public findAll(offset: number = 0, limit: number = 10): IBookList {
    return {
      books: this.#books.slice(offset, offset + limit),
      total: this.#books.length,
      offset,
      limit
    };
  }

  /**
   * Counts the total number of books in the repository.
   * @returns {number} The total number of books.
   */
  public count(): number {
    return this.#books.length;
  }

  /**
   * Finds a book by id.
   * @param {string} id - The book's id.
   * @return {IBook|null} The book if found, null otherwise.
   */
  public findById(id: string): IBook | null {
    return this.#books.find(b => b.id === id) ?? null;
  }

  /**
   * Creates a new book in the repository.
   *
   * @param {IInputBook} data - The data to create the book with.
   * @returns {IBook} The newly created book.
   */
  public create(data: IInputBook): IBook {
    const newBook: IBook = { id: crypto.randomUUID(), ...data };
    this.#books.push(newBook);
    return newBook;
  }

  /**
   * Updates a book by id.
   *
   * @param {string} id - The book's id.
   * @param {IInputBook} data - The data to update the book with.
   * @return {IBook|null} The updated book if found, null otherwise.
   */
  public update(id: string, data: IInputBook): IBook | null {
    const index = this.#books.findIndex(b => b.id === id);
    if (index === -1) return null;
    const updated = { id, ...data };
    this.#books.splice(index, 1, updated);
    return updated;
  }

  /**
   * Deletes a book by its id.
   *
   * @param {string} id The id of the book to delete.
   * @returns {Promise<IBook|null>} The deleted book if found, null otherwise.
   */
  public async delete(id: string): Promise<IBook | null> {
    const index = this.#books.findIndex(b => b.id === id);

    if (index === -1) {
      return null;
    }

    const book = this.#books[index] ?? null;

    if (book === null) {
      return null;
    }

    // Delete the book from the array
    this.#books.splice(index, 1);

    return book;
  }
}
