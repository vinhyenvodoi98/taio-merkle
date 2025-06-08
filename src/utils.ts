/**
 * Validates that a string is not empty
 * @param value - The string to validate
 * @param fieldName - The name of the field for error message
 * @throws {Error} If the string is empty
 */
export function validateNotEmpty(value: string, fieldName: string): void {
  if (!value) {
    throw new Error(`${fieldName} cannot be empty`);
  }
}
