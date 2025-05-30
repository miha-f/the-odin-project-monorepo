import withCatch from '../helpers/withCatch.js';
import fs from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();

console.log("Removing files in FS from: ", process.env.USERS_STORE_DIR);
const [error, _] = await withCatch(() => fs.rm(process.env.USERS_STORE_DIR, { recursive: true, force: true }));
if (error) {
    console.log("Someting went wrong with removing files from FS, try again!");
}
else {
    console.log("Succesfully removed files from FS!");
}
