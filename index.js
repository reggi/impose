import chalk from 'chalk'
import fs from 'fs/promises'
import readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

async function readPackageJSON() {
  try {
    const filePath = `${process.cwd()}/package.json`
    const data = await fs.readFile(filePath, 'utf8')
    const packageJSON = JSON.parse(data)
    return packageJSON
  } catch (error) {
    return {}
  }
}

async function readChangesFile(url) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.text()
    const changes = JSON.parse(data)
    return changes
  } catch (error) {
    return {}
  }
}

async function deepMergeChanges(changes, packageJSON, parentKey = '') {
  for (const [key, value] of Object.entries(changes)) {
    const fullKey = parentKey ? `${parentKey}.${key}` : key
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      if (!packageJSON[key]) packageJSON[key] = {}
      await deepMergeChanges(value, packageJSON[key], fullKey)
    } else {
      if (packageJSON.hasOwnProperty(key) && packageJSON[key] !== value) {
        const overwrite = await promptUserForOverwrite(fullKey)
        if (!overwrite) continue
      }
      packageJSON[key] = value
    }
  }
}

async function promptUserForOverwrite(key) {
  return new Promise(resolve => {
    rl.question(
      `${chalk.green(`The property '${key}' already exists. Do you want to overwrite it?`)} (yes/no)`,
      answer => {
        resolve(['yes', 'y'].includes(answer.trim().toLowerCase()))
      },
    )
  })
}

async function applyChanges() {
  const url = process.argv[2]
  if (!url) {
    console.error('Please provide a URL to the changes file as an argument.')
    process.exit(1)
  }

  const changes = await readChangesFile(url)
  let packageJSON = await readPackageJSON()
  await deepMergeChanges(changes, packageJSON)
  // After merging, write the updated packageJSON back to the package.json file
  const filePath = `${process.cwd()}/package.json`
  await fs.writeFile(filePath, JSON.stringify(packageJSON, null, 2), 'utf8')
  rl.close()
}

applyChanges()
