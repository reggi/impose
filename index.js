import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __dirname = import.meta.dirname;

async function readPackageJSON() {
  try {
    const filePath = `${process.cwd()}/package.json`;
    const data = await fs.readFile(filePath, "utf8");
    const packageJSON = JSON.parse(data);
    return packageJSON;
  } catch (error) {
    return {};
  }
}

async function readChangesFile() {
  try {
    const filePath = `${__dirname}/changes.json`;
    const data = await fs.readFile(filePath, "utf8");
    const changes = JSON.parse(data);
    return changes;
  } catch (error) {
    return {};
  }
}

readChangesFile();
readPackageJSON();
