"use strict";

const chalk = require("chalk");
const path = require("path");

function noName() {
  console.error(chalk.red("\n  Error: component name is required.\n"));
  console.log(chalk.yellow('  Usage:   npm run create-comp "<Component Name>"'));
  console.log(chalk.yellow('  Example: npm run create-comp "Product Card"\n'));
}

function nameFormats(names) {
  console.log("");
  console.log(chalk.cyan(`  Creating component: ${chalk.bold(names.title)}`));
  console.log(chalk.gray(`  ├─ class     ${names.pascal}`));
  console.log(chalk.gray(`  ├─ slug      ${names.kebab}`));
  console.log(chalk.gray(`  └─ dir       site/snippets/${names.kebab}/`));
  console.log("");
}

function step(msg) {
  console.log(chalk.green(`  ✓  ${msg}`));
}

function warn(msg) {
  console.log(chalk.yellow(`  ⚠  ${msg}`));
}

function alreadyExists(kebab) {
  console.error(chalk.red(`\n  Error: component "${kebab}" already exists.\n`));
}

function done(names) {
  const dir = path.join("site/snippets", names.kebab);
  console.log("");
  console.log(chalk.green.bold("  Component created successfully!"));
  console.log("");
  console.log(chalk.yellow("  Next steps:"));
  console.log(chalk.yellow(`  1. Implement markup in:   ${path.join(dir, `${names.kebab}.php`)}`));
  console.log(chalk.yellow(`  2. Implement JS in:       ${path.join(dir, `js/${names.kebab}.js`)}`));
  console.log(chalk.yellow(`  3. Include in a template: <?php snippet('${names.kebab}/${names.kebab}') ?>`));
  console.log(chalk.yellow(`  4. app.js has been updated automatically.`));
  console.log("");
}

module.exports = { noName, nameFormats, step, warn, alreadyExists, done };
