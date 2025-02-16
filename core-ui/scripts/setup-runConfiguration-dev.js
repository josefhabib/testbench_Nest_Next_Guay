// Script to run the NextJS app in development mode (Load: .env.development.local)

// Purpose:
//   Running the NextJS app in a consistent manner requires a number of configurations to be set up.
//    These are often set inline in the package.json file, however, but this often includes a number of
//    implicit/default configurations (!!! incl. Node.js version - here we use node@21.1.0 !!! ) that can lead to inconsistencies. These 
//    inconsistencies can result in bugs that are hard to find and diagnose.
//   The use of this script specifies the configurations explicitly. This not only reduces the chances of 
//    inconsistencies and makes it easier to diagnose issues but also improves the portability/reusability 
//    of the setup (e.g. Config Service). 

import dotenv from 'dotenv';
import { exec } from 'child_process';

console.log("Starting Next.js server in Development mode (via setup-runConfiguration-dev.js)");

// Load the .env file
dotenv.config({ path: '../.env.development.local' });

// Get the port from the .env file & set the environment variable
const port = process.env.NEXTJS_WEB_PORT;
if (!port) {
  console.error('The port number could not be extracted from the .env file');
  process.exit(1);
} else {
  console.log("Evironment variables loaded & set");
}

// Run the NextJS app (forcing a specific Node.js version)
const command = `npx -p node@21.1.0 next dev -p ${port}`;
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});

// Display the port where the NextJS app is running
console.log('The NextJS app is running on port:', port);