export interface IBooksConfiguration {
  limit: number;
}

const booksConfiguration: IBooksConfiguration = Object.seal(
  Object.freeze({ limit: 100 })
);

export default booksConfiguration;
