import { BookRepository } from "./BookRepository";
import { IBook, IBookList, IInputBook } from "./types";

export default class BookService {
  readonly #repository: BookRepository;

  public constructor(repository: BookRepository) {
    this.#repository = repository;
  }

  /**
   * Get a list of books.
   *
   * @param {number} [offset=0] The offset to start at.
   * @param {number} [limit=10] The number of books to return.
   * @returns {Promise<IBook[]>} A promise that resolves with an array of books.
   */
  public async list(offset?: number, limit?: number): Promise<IBookList> {
    return this.#repository.findAll(offset, limit);
  }

  /**
   * Get a book by its ID.
   *
   * @param {string} id The ID of the book.
   * @returns {Promise<IBook | null>} A promise that resolves with the book if found, or null if not.
   */
  public async get(id: string): Promise<IBook | null> {
    return this.#repository.findById(id);
  }

  /**
   * Create a new book.
   *
   * @param {IInputBook} data The data of the book to create.
   * @returns {Promise<IBook>} A promise that resolves with the created book.
   */
  public async add(data: IInputBook): Promise<IBook> {
    return this.#repository.create(data);
  }

  /**
   * Counts the total number of books in the repository.
   * @returns {Promise<number>} A promise that resolves with the total count.
   */
  public async count(): Promise<number> {
    return this.#repository.count();
  }

  /**
   * Update a book by its ID.
   *
   * @param {string} id The ID of the book to update.
   * @param {IInputBook} data The data to update the book with.
   * @returns {Promise<IBook | null>} A promise that resolves with the updated book if found, or null if not.
   */
  public async modify(id: string, data: IInputBook): Promise<IBook | null> {
    return this.#repository.update(id, data);
  }

  /**
   * Remove a book by its ID.
   *
   * @param {string} id The ID of the book to remove.
   * @returns {Promise<IBook | null>} A promise that resolves when the book is removed.
   */
  public async remove(id: string): Promise<IBook | null> {
    return this.#repository.delete(id);
  }
}
