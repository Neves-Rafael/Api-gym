export class MaxNumbersOfCheckInsError extends Error {
  constructor() {
    super("Max number of Check-ins reached.");
  }
}
