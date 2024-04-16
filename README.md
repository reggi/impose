# `impose`

I have a static github pages site that serves an json file with all the prettier config changes:

Here https://reggi.github.io/prettier-config.json looks like:

```json
{
  "scripts": {
    "style": "prettier --check .",
    "style:fix": "prettier --write ."
  },
  "prettier": "@github/prettier-config",
  "devDependencies": {
    "@github/prettier-config": "^0.0.6",
    "prettier": "^3.2.5"
  }
}
```

Now, I can use this command in my package directory and update the package.json with these additions.

```bash
npx impose https://reggi.github.io/prettier-config.json
```
