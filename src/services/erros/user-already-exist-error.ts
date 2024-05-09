export class UseAlreadyExistError extends Error {
  constructor() {
    super("E-mail already exists.");
  }
}
