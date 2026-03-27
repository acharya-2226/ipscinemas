/**
 * Utility function to extract error message from API response
 * Handles multiple error response formats
 */
export function getErrorMessage(error) {
  if (typeof error === 'string') {
    return error;
  }

  if (error.detail) {
    return error.detail;
  }

  // Handle non_field_errors (from serializers)
  if (error.non_field_errors && Array.isArray(error.non_field_errors)) {
    return error.non_field_errors[0];
  }

  // Handle field-level errors
  for (const [key, value] of Object.entries(error)) {
    if (Array.isArray(value)) {
      return `${key}: ${value[0]}`;
    }
  }

  // Handle generic error object
  if (error.error) {
    return error.error;
  }

  // Fallback
  return "An error occurred. Please try again.";
}
