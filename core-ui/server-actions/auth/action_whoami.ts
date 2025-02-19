"use server"

//  Server action that contacts the NestJS server (GET to /auth/whoami) to get the 
//   currently logged in user. 
//  If no user is logged in, the server action will return an empty object.
// 
//  Use cases: 
// 
// - Conditional Rendering:
//    If a user is logged in the user's name (personalization), and a logout button can be displayed in the header.
//    If a user is not logged no personalization/logout button should be displayed. 
// 
// - Conditional Routing: 
//    If a user is logged in and wants to browse to the log in screen they should be re-directed to the
//     home screen/landing page.
//    If a user is not logged in and wants to go to a protected route they should be re-directed to the
//     login screen.  
// 
// - Development/Debugging: Access restrictions
//    This application has a non-standard setup and therefore access restrictions need to be 
//     implemented explicitly: 
//    In traditional web application the communication is between the client web app (i.e. the 
//     UI) and the web app server (NextJS). The authentication state is stored in the browser 
//     memory (cookie jar, local storage, or session storage) and automatically sent with each
//     request to the web app server. The web app server has access to a number of pre-implemented 
//     tools to manage access to resources behind the scenes. This abstraction is possible on account 
//     of the fact that standard authentication and access restrictions is wholly predictable. In fact,
//     several security mechanisms are also based on the assumption that the standard authentication 
//     and access restriction mechanisms are in place (e.g. same-site cookies etc.).
//    Our service based architecture is different: The web app server is limited to web app routing
//     and rendering. Access to data is handled by another server (i.e. the NestJS server). This 
//     means we need to explicitly implement and customize how access is controlled. This includes
//     the web app back end (i.e. NextJS server; server actions) sending the authentication JWT to 
//     the NestJS server and interpreting the response. 
//    The whoami API route and the corresponding server action provides a testbench for the development
//     and debugging of these access restrictions.
//    The NestJS API route /auth/whoami (GET) is the first access restricted route that we have implemented
//     It is decorated with the JwtAuthGuard and restricts access to requests that have a valid JWT attached. 
//    The whoami server action implemented here provides a state (React render) based on whether the 
//     request to an access restricted NestJS API route was authorized or not (based on authentication status).




