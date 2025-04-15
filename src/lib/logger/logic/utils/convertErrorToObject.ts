/**
 * @description
 * This function is needed since javascript's Error doesn't print `stack` or `message` when converting to string.
 * For example, you need to explicitly say "console.log({message: error.message})".
 */
export function convertErrorToObject(error: Error) {
  return { ...error, message: error.message, name: error.name, stack: error.stack };
}
