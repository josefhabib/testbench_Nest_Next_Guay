import dotenv from 'dotenv';
import { exec } from 'child_process';

dotenv.config({ path: '../.env.development.local' });

const port = process.env.NEXTJS_WEB_PORT;

if (!port) {
  console.error('NEXTJS_WEB_PORT is not defined in the .env file');
  process.exit(1);
}

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

console.log('The NextJS app is running on port:', port);