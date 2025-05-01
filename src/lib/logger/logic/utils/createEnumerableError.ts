/**
 * @description
 * This function is needed since javascript's Error doesn't print `stack` or `message` when converting to string.
 * For example, you need to explicitly say "console.log({message: error.message})".
 */
export function createEnumerableError(error: Error) {
  return { ...error, name: error.name, message: error.message, stack: error.stack };
}
