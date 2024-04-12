import fs from "fs/promises";
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

async function deepMergeChanges(changes, packageJSON) {
  for (const [key, value] of Object.entries(changes)) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      if (!packageJSON[key]) packageJSON[key] = {};
      await deepMergeChanges(value, packageJSON[key]);
    } else {
      if (packageJSON.hasOwnProperty(key)) {
        const overwrite = await promptUserForOverwrite(key);
        if (!overwrite) continue;
      }
      packageJSON[key] = value;
    }
  }
}

async function promptUserForOverwrite(key) {
  return new Promise((resolve) => {
    rl.question(`The property '${key}' already exists. Do you want to overwrite it? (yes/no) `, (answer) => {
      resolve(answer.trim().toLowerCase() === 'yes');
    });
  });
}

async function applyChanges() {
  const changes = await readChangesFile();
  let packageJSON = await readPackageJSON();
  await deepMergeChanges(changes, packageJSON);
  // After merging, write the updated packageJSON back to the package.json file
  const filePath = `${process.cwd()}/package.json`;
  await fs.writeFile(filePath, JSON.stringify(packageJSON, null, 2), "utf8");
  rl.close();
}

applyChanges()
