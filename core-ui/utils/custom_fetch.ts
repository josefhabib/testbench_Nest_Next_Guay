/**
 * Sends a POST request to the specified path with the given payload.
 *
 * @param path - The part of the URL after the domain name.
 * @param payload - The data to be sent to the server, must be a non-null object.
 * @returns A promise that resolves to a Response object. If the request fails, the Response object will contain an 'error' attribute with the error message.
 *
 * @remarks
 * This function is intended for sending data from the web app server to the target server after form-data has been received by the web app server from the client.
 * 
 * The function performs the following steps:
 * - Validates the input parameters.
 * - Sends a POST request with the payload converted to JSON.
 * - Handles the response by checking if the request was successful.
 * - If the request fails, it returns a Response object with a homogenized error message.
 * - If the request succeeds, it returns the original Response object.
 * 
 * By abstracting the fetch request into a custom function, we can ensure that common pre- and post-processing steps are applied consistently across the codebase.
 * This includes: 
 * - Preliminary checks: Ensuring that the input parameters are of the correct type and content.
 * - Error handling: Ensuring that error messages are formatted consistently.
 * In addition it also serves as an abstraction layer for network requests, making it easier to change the underlying implementation in the future. For instance
 *  if we use a different network protocol we can create a new function that handles the new protocol without having to modify the remaining code.
 *
 * @example
 * ```typescript
 * const response = await post('/api/data', { key: 'value' });
 * const responseBody = await response.json();
 * if (responseBody.error) {
 *   console.error('Error:', responseBody.error);
 * } else {
 *   console.log('Success:', responseBody);
 * }
 * ```
 */
import { getErrorMessage } from "./errors";


export const post = async (path: string, payload: object): Promise<Response>  => {
//export const post = async (path: string, formData: FormData) => {

  // --- Pre-liminary checks 
  // Ensure the path is a string 
  if (typeof path !== 'string') {
    return new Response(JSON.stringify({ error: 'Path must be a string' }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  // Ensure the URL starts with either http:// or https://
  if (!path.startsWith('http://localhost') && !path.startsWith('https://')) {
    return new Response(JSON.stringify({ error: 'Path must start with http://localhost or https://' }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  // Ensure the payload is a non-null object
  if (typeof payload !== 'object' || payload === null) {
    return new Response(JSON.stringify({ error: 'Payload must be a non-null object' }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  
  // --- Send the POST request
  const res = await fetch(`${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // --- Handle responses:
  // If the response is ok, return the response object
  // If the response is not ok, get the error message and format it to a homogenized format. To access it in the calling function:
  //  1- parse the response object (const responseBody = await response.json())
  //  2- then access it under responseBody.error
  if (!res.ok){
    const formattedError = getErrorMessage(await res.json());
    return new Response(JSON.stringify({ error: formattedError }), {
      status: res.status,
      statusText: res.statusText,
      headers: { "Content-Type": "application/json" }
    });
  }
  return res
};