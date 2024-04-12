import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __dirname = import.meta.dirname;

async function readPackageJSON() {
  try {
    const filePath = `${process.cwd()}/package.json`;
    const data = await fs.readFile(filePath, 'utf8');
    const packageJSON = JSON.parse(data);
    console.log(packageJSON);
  } catch (error) {
    console.error('Error reading the package.json file:', error);
  }
}

async function readChangesFile() {
  try {
    const filePath = `${__dirname}/changes.json`;
    const data = await fs.readFile(filePath, "utf8");
    const changes = JSON.parse(data);
    console.log(changes);
  } catch (error) {
    console.error("Error reading the changes.json file:", error);
  }
}

readChangesFile();
readPackageJSON();
