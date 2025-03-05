
/**
 * Interface representing the output of the createUser function.
 * 
 * @remarks
 * This interface is used to define the structure of the output returned by the createUser function.
 * It ensures that the state object is not optional and has a well-defined structure.
 * 
 * @property status - HTTP status code returned by the server.
 * 
 * @property state - Governs the rendering of the React form:
 * - "starting": Initial value before any attempt to create a user account has been made - clear form.
 * - "success": Outcome of signup process - toast, redirect, reset form, etc.
 * - "error": Outcome of signup process - toast, redirect, reset form, etc.
 *  
 * @property message - Optional message to be displayed in the toast notification.
 * 
 * @property data - Data returned by the server (if any).
 * 
 * @example
 * ```typescript
 * const createUserOutput: ICreateUserOutput = {
 *   state: "starting",
 *   error: "",
 *   message: "",
 *   data: {}
 * };
 * ```
 */
export interface ICreateUserOutput {
  state:    "starting" | "success" | "error";    //=> This governs the rendering of the React form: "starting - initial value before any attempt to create a user account has been made - clear form"; "error"/"success": outcome of sugnup process - toast, redirect, reset form, etc; NB In addition to these states we also have a SEPERATE "pending" state returned by the useActionHook
  status?:  number;                              //=> HTTP status code returned by the server (optional since pre-flight checks may preclude a server response)
  message:  string;                              //=> Optional message to be displayed in the toast notification
  data:     any;                                 //=> Data returned by the server (if any)
} 

