/**
 * Utility functions for homogenizing the handling and formatting error messages. 
 * 
 * This module provides a function to extract and format error messages from a network response object.
 * It ensures that:
 * - error messages are properly capitalized 
 * - handles cases where the message might be an array or a single string.
 */


/**
 * Formats an error message by capitalizing the first letter.
 * 
 * @param message - The error message to format.
 * @returns The formatted error message with the first letter capitalized.
 */
const formatErrorMessage = (message: string): string => {
  return message.charAt(0).toUpperCase() + message.slice(1);
};


/**
 * Extracts and formats the error message from a response object.
 * 
 * @param response - The response object that contains the error message.
 * @returns The formatted error message. If the message is an array, it formats the first element.
 *          If the message is not present, it returns a default "Unknown error occurred." message.
 */
export const getErrorMessage = (response: any): string => {
  if (response.message) {
    if (Array.isArray(response.message)) {
      return formatErrorMessage(response.message[0]);
    }
    return formatErrorMessage(response.message);
  }
  return "Unknown error occurred.";
};




