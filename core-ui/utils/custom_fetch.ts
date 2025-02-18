/**
 * Handles sending requests (e.g. POST) to the specified URL with the given payload.
 *
 * @param url - The URL to which the POST request is sent. Must be a string starting with "http://localhost" or "https://".
 * @param payload - The data to be sent to the server. Must be a non-null object.
 * @returns A promise that resolves to a Response object. If the request fails, the Response object will contain an 'error' attribute with the error message.
 *
 * @remarks
 * These custom network request functions are intended to be used instead of built-in functions like `fetch`.
 * 
 * Rationale: the use of this abstracted function offers a number of benefits over directly using built-in functions like fetch: 
 * - **Simplification*
 *    The low-level universal network request APIs like fetch() can be complex and verbose, requiring multiple steps to perform a simple request.
 *    Custom functions can simplify the process by encapsulating the common steps into a single specialized function call. For instance, for a post
 *    request we want to be able to simply call a function with the URL and payload, and get back a response object. This simplification can make 
 *    the code more readable and easier to maintain.
 * 
 * - **Error Handling**
 *    Errors can occur at different locations in the network request process. This includes bad requests and client-side errors, as well as server-side
 *    errors and network errors. Custom functions can provide consistent error handling across the application. By abstracting the network request logic
 *    into a custom function, we can ensure that errors are handled in a consistent manner, regardless of where they occur.
 *
 * - **Input Validation**: 
 *    Not all requests can be processed by the server. Invalid requests can lead to unexpected behavior or even security vulnerabilities.
 *    Rather than simply throwing a request at the server, and leaving it to the server to try and execute it and/or formulate a response, 
 *    this abstracted function allows us to validate the request first and provide a meaningful error message if the request is invalid.
 *    Specifically, the post() function ensures that the URL is a string, starts with the correct protocol (http/https), and that the payload is a non-null object.
 * 
 * - **Abstraction Layer**: 
 *    fetch() functions are intended to be used in conjunction with a specific network protocol (HTTP/HTTPS). By abstracting the fetch call into a custom function,
 *    we can create a single point of change for network requests. This makes it easier to modify the underlying implementation without affecting the rest of the codebase.   
 * 
 * - **Response Formatting**: 
 *    Creates a standardized response object, ensuring that all responses have a consistent structure.
 *    This can simplify error handling and response processing in the calling code (e.g. display errors, regardless of their types and origins, in Toasts on the UI). 
 * 
 * - **Code Reusability**: 
 *    The custom `post()` function can be reused across different parts of the application, reducing code duplication and improving maintainability.
 *
 *  
 * @post 
 * The post function is used to send data (aka payload) to the server in the form of a JSON object.
 * The function performs the following steps:
 * - Validates the input parameters; Returns an error response if the input is invalid.
 * - Sends a POST request with the payload converted to JSON.
 * - Handles the response by checking if the request was successful.
 *  -- If the request fails, it returns a Response object with a homogenized error message.
 *  -- If the request succeeds, it returns the original Response object.
 * - Checks for specific fields in the response object (e.g. set-cookie) and formats/provisions them in a standardized way.
 *
 * @example
 * ```typescript
 * const response = await post('https://api.example.com/data', { key: 'value' });
 * const responseBody = await response.json();
 * if (responseBody.error) {
 *   console.error('Error:', responseBody.error);
 * } else {
 *   console.log('Success:', responseBody);
 * }
 * ```
 */


import { getErrorMessage } from "./errors";

// Define & impose an interface/type for the response body
interface StandardResponse {
  status: number;
  headers: Record<string, string>; // Tip: Record<string, string> is equivalent to { [key: string]: string }
  body: unknown;
  error?: string;
};

// Helper function to create a response object
const createResponse = (
  status: number,
  content: { body?: unknown; error?: string },
  headers: Headers = new Headers({ "Content-Type": "application/json" })
): Response => {
  const responseBody: StandardResponse = {
    status,
    headers: Object.fromEntries(headers.entries()),
    body: content.body ?? {}, // Tip: if content.body is null or undefined, the body property will be assigned an empty object {}. Otherwise, it will be assigned the value of content.body.
    error: content.error,
  };
  return new Response(JSON.stringify(responseBody), {
    status,
    headers,
  });
};

// ----------------------------- //
// === The custom post function ===
// ----------------------------- //
// Remit: Send a network request with an attached payload to the specified URL
// Get back a response object with a standardized structure containing:
// - The status of the request
// - The headers of the response (including cookies to be set)
// - The body of the response
// - An error message if the request fails

export const post = async (
  url: string,
  payload: object
): Promise<Response> => {

  // --- Validation Checks ---

  // URL must be a string
  if (typeof url !== "string") {
    return createResponse(400, { error: "URL must be a string" });
  }

  // URL must start with http://localhost or https://
  //  Rationale: 
  //  - Further, not including the protocol in the URL can lead to errors that have been shown to be hard to diagnose and debug
  //  - Since we may be posting sensitive data (e.g. credentials) we want to ensure that the data is sent securely or, for development, to a local host only
  if (
    !url.startsWith("http://localhost") &&
    !url.startsWith("https://")
  ) {
    return createResponse(400, {
      error: "URL must start with http://localhost or https://",
    });
  }

  // Payload must be a non-null object
  // Rationale: 
  // - The purpose of a post request is to send data to the server. If there is no data to send, the request is invalid
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return createResponse(400, { error: "Invalid payload format" });
  }


  // --- Execute Request & Handle Response ---
  try {
    const fetchResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: 'include', // (!) Include credentials to handle cookies (!)
    });
    
    // Handle HTTP errors
    if (!fetchResponse.ok) {
      let errorMessage: string;
      try {
        const errorData = await fetchResponse.json();
        errorMessage = getErrorMessage(errorData); // (error.ts: getErrorMessage() Extracts the error message from the error data and formats it)
      } catch {
        errorMessage = "An unknown error occurred";
      }
      // Clone headers and set Content-Type
      const headers = new Headers(fetchResponse.headers);
      headers.set("Content-Type", "application/json");
      return createResponse(fetchResponse.status, { error: errorMessage }, headers);
    }

    // Handle success response
    const responseText = await fetchResponse.text();
    try {
      const responseData = JSON.parse(responseText);
      const headers = new Headers(fetchResponse.headers);
      headers.set("Content-Type", "application/json");
      return createResponse(fetchResponse.status, { body: responseData }, headers);
    } catch {
      const headers = new Headers(fetchResponse.headers);
      headers.set("Content-Type", "application/json");
      return createResponse(fetchResponse.status, { body: responseText }, headers);
    }
  // Handle all other errors  
  } catch (error) {
    return createResponse(500, {
      error: "An unknown error occurred",
    });
  }
};