import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function readChangesFile() {
  try {
    const filePath = `${__dirname}/changes.json`;
    const data = await fs.readFile(filePath, 'utf8');
    const changes = JSON.parse(data);
    console.log(changes);
  } catch (error) {
    console.error('Error reading the changes.json file:', error);
  }
}

readChangesFile();
