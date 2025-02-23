"use server"

/**
 * 
 * Implementation of custom fetch functions: post, get, etc.
 * 
 *
 * @param url - The URL to which the request is sent. Must be a string starting with "http://localhost" or "https://".
 * @param data - Where approriate (e.g. post, put) data payloads can be provided to be sent to the server.  
 * @returns A promise that resolves to a Response object. If the request fails, the Response object will contain an 'error' attribute with the error message.
 *
 * @remarks
 * 
 *  Background & Motivation: 
 *  -----------------------
 *    
 *    Traditionally web applications are built on a client-server architecture: a web app client (browser) sends requests to the server (e.g. Express.js running 
 *    on Node.js), which in turn is responsible for routing and serving up data. Tools and techniques provided for the implementation of web applications often 
 *    tacitly assume this 2-component architecture. For instance, managing state (e.g. cookies, tokens) is typically handled by the web app framework under the
 *    assumption that clients will only communicate with one server (e.g. same-site cookied, allowing request bodies to be read only once, etc.). By implication 
 *    tools and framework functionalities that abstract these details are provided apply these assumptions and restrictions under the hood. 
 * 
 *    Our application is different: the web app server is focussed on routing and rendering only. Functionalities like data access, authentication etc are delegated 
 *    to separate specialized servers (e.g. NestJS, XNAT, REDCap etc). This means that requests and responses must be relayed between the web app client, web app 
 *    servers and the specialized servers. 
 *    
 *    Furthermore, the communication between the web app client and server is not implemented via explicit client requests (e.g. fetch(), axios(), etc.) but rather
 *    via the NextJS framework (server actions, server/client components). This introduces another layer of abstraction that can complicate the customization of 
 *    the network requests. 
 *    
 *    Furthermore, fetch() is a low-level generic API that provides basic functionality for sending network requests. Specialist applications may benefit from 
 *    high level, bespoke functionalities that are not provided by fetch(). For instance, we may wish to implement application specific request validations that 
 *    return sensible error messages if the request is invalid - rather than throwing requests at the server and leaving it up to the server to interpret the errors
 *    and return informative error responses.
 * 
 *    Finally, in a distributed service architecture, the standard http/https protocol may not be optimal: e.g we may wish to use more efficient protocols (e.g.
 *    TCP) or protocols better suited to the specific requirements of the architecture (e.g. gRPC, web sockets, etc.). If we implement multiple custom network requests
 *    using fetch() we would have to modify all the places where fetch() is used if we want to switch to a different protocol.
 * 
 *    In short, the standard fetch() function is too low-level, general purpose and subject to too many assumptions for our application.
 * 
 * 
 *  Purpose & Scope:
 *  ---------------
 *
 *     To implement custom wrapper around the standard fetch() function to provide a more specialized, high-level API for sending network requests; and by abstracting
 *     and decoupling the network request logic into a custom function we can provide a solution with the following advantages:
 *     
 *     -  Network protocol decoupling: 
 *        Decoupling allows us to change the implementation of the network request function without having to modify all the places in the 
 *        application where the function is used. This is particularly useful if we want to switch to a different protocol (e.g. gRPC, web sockets, etc.).
 * 
 *     -  Standardized response object:  
 *        The custom network request function can provide a standardized response object. This can make it easier to handle errors and responses consistently.
 *        
 *     -  Input validation & error handling:
 *        The custom network request function can provide built-in, high-level input validation and error handling before a request. This can help to ensure 
 *        that requests are valid before they are sent to the server and provide meaningful error messages if the request is invalid. Conversely, 'throwing' 
 *        requests at the server and leaving it up to the server to identify, interpret, handle and report errors can lead to non-descriptive, generic error
 *        messages that are hard to diagnose and debug. Moreover, it can lead to the server crashing or failing silently. This can make the interpretation and
 *        handling of errors challenging. It can also lead to security vulnerabilities that can be exploited by malicious actors. For instance, sending sensitive
 *        information over an unencrypted connection (e.g. http instead of https), not validating server responses, not implementing rate limiting or other 
 *        security measures, may not trigger an error response, and can be exploited by malicious actors.
 *        Implementing request validation in a central location (the custom network request function) can help to ensure that requests are valid before they are
 *        sent to the server. If a security vulnerability is identified the validation checks can be implemented and tested in a single location and immediately 
 *        apply application-wide. 
 * 
 *     - Single Responsibility Principle (SRP), DRY:
 *       The custom network request function can adhere to the Single Responsibility Principle (SRP) by doing one thing and doing it well. Rather than
 *       implementing network request logic in multiple places, we can implement it once and reuse it across the application. If a problem/sub-optimality
 *       is identified changes only need to be made in one location: the dedicated network request function.         
 * 
 *     - Code simplification
 *       Rather than relying on low-level, multi-purpose (read: verbose and complex) fetch requests we can use simple high level functions (e.g. post(), get(), etc.)
 *       that encapuslate and thus simplify the network request usage. 
 * 
 *     - Testability
 *       Rather than having to test each network request individually, we can test the custom network request function once and ensure that it works correctly in all cases.
 * 
 *     - Payload data types/transformation
 *       As already alluded to, fetch() is a general-purpose, low-level function. It does not provide built-in support for different types of payloads (e.g. file uploads, 
 *       strings (stringified JSON), FormData, JS objects etc.). By abstracting the identification and transformation of payload data types pertinent to the application 
 *       at hand, we can simply attach the payload to the request and let the custom network request function handle the rest.  
 * 
 *  !  - Custom functionality
 *  !    However, in addition to all of these practical advantages it must be stressed that the main reason for implementing custom network request functions is that
 *  !    remains the adaptation of network request functions the specific architecture and requirements of our application. 
 *    
 * 
 *  Implementation Notes ("How To..." Summary):
 *  --------------------
 * 
 *    - How to... access cookies stored on the client (browser) in a NextJS application:
 *      NextJS does not provide a clientRequest object that can be used to access cookies stored on the client. Instead, we use the NextJS cookies() function to 
 *      access the cookies stored on the browser. This function returns a cookie store object that can be used to access the cookies stored on the client.
 *
 *    - How to... define cookies that are both secure but can still be forwarded to the server:
 *      Cookies have a number of attributes that can be set to make them more secure. This includes the "SameSite" attribute to prevent cookies from being sent
 *      in cross-site requests (i.e. prevent them from being forwardable). 
 *      -> SameSite: off
 *        - "off" (default & selected setting) allows cookies to be sent in cross-site requests; Other settings are 
 *        - "lax": allows cookies to be sent in cross-site requests if the request is a top-level navigation (e.g. clicking a link)
 *        - "strict": prevents cookies from being sent in cross-site requests.
 *      -> Secure: true
 *        - If the "Secure" attribute is set, the cookie will only be sent over HTTPS or using localhost. This allows us to store and send sensitive data 
 *          (e.g. credentials) using cookies.
 *      -> HttpOnly: true
 *        - If the "HttpOnly" attribute is set, the cookie cannot be accessed by JavaScript. This can help to prevent cross-site scripting attacks.
 *  
 *    - How to... attach cookies to the outgoing request:
 *      A custom function (attachClientCookies(headers)) has been implemented to attach the cookies stored on the client to the outgoing request. This function
 *      uses the headers.set() method to attach the cookies to the request.
 *
 * ---------------------------------------------------------------------------- 
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
 * ----------------------------------------------------------------------------
 * 
 * @get
 * The get function is used to retrieve data from the server.
 * The function performs the following steps:
 * - Validates the input parameters; Returns an error response if the input is invalid.
 * - Sends a GET request to the specified URL.
 * - Handles the response by checking if the request was successful.
 *  -- If the request fails, it returns a Response object with a homogenized error message.
 *  -- If the request succeeds, it returns the original Response object.
 * - Checks for specific fields in the response object (e.g. set-cookie) and formats/provisions them in a standardized way.
 *
 * @example
 * ```typescript
 * const response = await get('https://api.example.com/data');
 * const responseBody = await response.json();
 * if (responseBody.error) {
 *   console.error('Error:', responseBody.error);
 * } else {
 *   console.log('Success:', responseBody);
 * }
 * ```
 * ----------------------------------------------------------------------------
 */

import { getErrorMessage } from "./errors";       // Standardized error message handling & formatting
import { cookies } from "next/headers";           // NextJS cookies handling (adapt to custom app architecture) - since NextJS is a full-stack framework we dont explicitly have clientRequsts being sent to the server - thus, in order to access cookies sotred on the client we cannot simply extract them from a (non-existent) clientRequest obejct. Instead, we use NextJS's cookies() function to access the cookies stored on the browser.



// --------------------------------------------------------------------------------- //
// --- Utilities: Request Validation (Pre-flight checks) --------------------------- //
// --------------------------------------------------------------------------------- //

// - Validation: Has a URL been provided?
const validateUrlExists = (url: string): void => {
  if (!url) {
    throw new Error("URL is required");
  }
};

// - Validation: Has the connection been adequately secured? 
//   (i.e. does the URL start with "http://localhost" or "https://"? (i.e. is it secure or local?))
const validateUrlProtocol = (url: string): void => {
  const urlObj = new URL(url); 
  const isLocalhost = urlObj.hostname === "localhost";
  const isHttpLocalhost = urlObj.protocol === "http:" && isLocalhost;
  const isSecure = urlObj.protocol === "https:"
  if (!isSecure && !isHttpLocalhost) {
    throw new Error("Invalid URL protocol: URL must use HTTPS or be http://localhost");
  }
};

//TODO: Validation: Verify a data payload of an accepted type has been provided (to be applied to POST, PUT requests))
//TODO: Validation: Rate limiting
//TODO: validate data payload (it should exist and be of an accepted type)
//TODO: Check if cookies have been attached (in which case they should be manually attached to the outgoing request - 2x server architecture!)
//TODO: Checks CORS and same-site cookie settings



// --------------------------------------------------------------------------------- //
// --- Utilities: Pre-Processing Utilities  ---------------------------------------- //
// --------------------------------------------------------------------------------- //

// --- Utility: Request Object Mutations/Transformations 
// 
// Requests to the server are typically sent with a body (payload) that contains the data to be processed by the server. The body can be of different types
// (e.g. FormData, JS object, string). The body must be transformed into a stringified JSON object before it can be sent to the server. This function
// performs this transformation. 
// NB: A request body can only ever be read once before it is destroyed (security reasons). This means e.g. that if we read the
//     body to determine its type, we cannot then pass it on to the server.)
// NB: The body must be transformed into a stringified JSON object before it can be sent to the server. This function can transform the following types of
//    payloads: FormData, JS object, string (i.e. stringified JSON). It CANNOT handle other types of payloads (e.g. file uploads).

const getTransformedBody = (data: any): BodyInit | null => { 
  if (!data) return null;
  if (typeof data === "string") return data;
  if (data instanceof FormData) return JSON.stringify(Object.fromEntries(data.entries()));
  if (typeof data === "object") return JSON.stringify(data);
  throw new Error("Invalid payload format");
};

//TODO: --- Utility for different types of payloads (e.g. file uploads)

// --- Error Response
//
// If an error occurs we must throw-catch-and handle it. This is to avoid the server crashing. The way we wish to handle errors is to:
//  1. Generate an error message that is standardized and informative
//  2. Return this error message to the client as an error response (i.e. inform the client of the error rather than constraining the 
//     error to the server). For instance, if a user account creation fails because the email address is already in use, we want to inform
//     the user of this - rather than e.g. failing silently and at most making a log entry into the server.
const createErrorResponse = (error: unknown): Response => {

  const status = (error instanceof Error && error.cause === 'VALIDATION') ? 400 : 500;
  const errorMessage = getErrorMessage(error);
  
  return new Response(JSON.stringify({ 
    status,
    error: errorMessage 
  }), {
    status,
    headers: { "Content-Type": "application/json" }
  });
};

// --- !! Helper: Attach cookies to the outgoing request !!
const attachClientCookies = async (headers: Headers): Promise<void> => {
  const cookieStore = await cookies();      // Retrieve cookies from Next.js server-side context
  const allCookies = cookieStore.getAll();  // Return an array of cookies instead of an object

  if (allCookies.length > 0) {
    const cookieHeader = allCookies.map(({ name, value }) => `${name}=${value}`).join("; "); // ✅ Correctly formats cookies
    headers.set("Cookie", cookieHeader);
  }
};



// --------------------------------------------------------------------------------- //
// --- Custom Network Request Functions (HTTP) ------------------------------------- //
// --------------------------------------------------------------------------------- //

// --- The custom post function ---
export async function post(url: string, data?: any): Promise<Response> {
  try {

    // 1- Pre-Flight Checks: Validations
    validateUrlExists(url);
    validateUrlProtocol(url);

    // 2- Prepare (fetch()) request: Create request headers ( // TODO: We may not want to always use JSON payloads - e.g. we may want to attach a file. This will require a different transformation, content-type header etc.)
    const headers = new Headers({ "Content-Type": "application/json" }); 
    await attachClientCookies(headers);                      // -> Attach any (auth) cookies provided by the client to the outgoing request
    // -> Technical Note: A request body can only ever be read once before it is destroyed (security reasons). This means e.g. that if we read the body to determine its type, we cannot then pass it on to the server.
    
    // 3- Prepare (fetch()) request: Create request body   ( // TODO: We may not want to always use JSON payloads - e.g. we may want to attach a file. This will require a different transformation, content-type header etc.)
    const body = getTransformedBody(data);
    
    // 4- Send the request to the server
    return await fetch(url, {
      method: "POST",
      headers,
      body
    });
  } 
  // 5- Handle Errors
  catch (error) {
    return new Response(JSON.stringify({ status: 500, error: getErrorMessage(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// --- The custom get function ---
export async function get(url: string): Promise<Response> {
  try {
    // 1- Validate the input parameters
    validateUrlExists(url);
    validateUrlProtocol(url);

    // 2- Prepare (fetch()) request: 
    const headers = new Headers({ "Content-Type": "application/json" });
    await attachClientCookies(headers);             // -> Attach any (auth) cookies provided by the client to the outgoing request

    // 3- Send the request to the server
    // console.log("Custom get(): Headers before fetch:", Object.fromEntries(headers.entries()));
    const response = await fetch(url, {
      method: "GET",
      headers,
    });
    return response;
  }
  // 4- Handle Errors
  catch (error) {
    return new Response(JSON.stringify({ status: 500, error: getErrorMessage(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}