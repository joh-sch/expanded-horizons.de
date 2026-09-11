#!/usr/bin/env node
"use strict";

/**
 * Component scaffold utility
 *
 * Creates a new Kirby component under site/snippets/ and registers it in app.js.
 *
 * Usage: npm run create-comp "<Component Name>"
 *
 * Creates:
 *   development-site/site/snippets/{name}/{name}.php   — markup / controller
 *   development-site/site/snippets/{name}/js/{name}.js — gia JS component
 *
 * Also updates:
 *   development-site/app/app.js                        — adds import + gia.mount registration
 */

const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");

const { toPascalCase, toKebabCase, toSnakeCase, toTitleCase } = require("../utils/string-transformations");
const log = require("../utils/log");

// ── Paths ────────────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, "../..");
const SITE_DIR = path.join(ROOT, "development-site/site");
const SNIPPETS_DIR = path.join(SITE_DIR, "snippets");
const APP_JS = path.join(ROOT, "development-site/app/app.js");
const TEMPLATES = path.join(ROOT, "file-templates");
const COMP_TPL = path.join(TEMPLATES, "Kirby/fileTemplate_kirby_comp.php");
const JS_TPL = path.join(TEMPLATES, "fileTemplate_NewComp.js");

// ── Entry point ───────────────────────────────────────────────────────────────

async function main() {
  const rawName = process.argv[2];

  if (!rawName || !rawName.trim()) {
    log.noName();
    process.exit(1);
  }

  const names = {
    raw: rawName.trim(),
    pascal: toPascalCase(rawName),
    kebab: toKebabCase(rawName),
    snake: toSnakeCase(rawName),
    title: toTitleCase(rawName),
  };

  log.nameFormats(names);

  const compDir = path.join(SNIPPETS_DIR, names.kebab);
  const compFile = path.join(compDir, `${names.kebab}.php`);
  const jsDir = path.join(compDir, "js");
  const jsFile = path.join(jsDir, `${names.kebab}.js`);

  // Guard: already exists?
  if (await fs.pathExists(compDir)) {
    log.alreadyExists(names.kebab);
    process.exit(1);
  }

  // 1. Create component directory
  await fs.ensureDir(compDir);
  log.step(`Created   site/snippets/${names.kebab}/`);

  // 2. PHP component file
  const phpContent = applyPhpPlaceholders(await fs.readFile(COMP_TPL, "utf8"), names);
  await fs.writeFile(compFile, phpContent);
  log.step(`Created   ${names.kebab}/${names.kebab}.php`);

  // 3. JS directory and component file
  await fs.ensureDir(jsDir);
  const jsContent = applyJsPlaceholders(await fs.readFile(JS_TPL, "utf8"), names);
  await fs.writeFile(jsFile, jsContent);
  log.step(`Created   ${names.kebab}/js/${names.kebab}.js`);

  // 4. Register in app.js
  await updateAppJs(names);
  log.step(`Updated   app/app.js`);

  log.done(names);
}

// ── Placeholder replacement ───────────────────────────────────────────────────

function applyPhpPlaceholders(content, names) {
  return content
    .replace(/NewComponent/g, names.pascal)
    .replace(/new-component/g, names.kebab)
    .replace(/new_component/g, names.snake)
    .replace(/New Component/g, names.title);
}

function applyJsPlaceholders(content, names) {
  return content
    .replace(/NewComp\b/g, names.pascal)
    .replace(/new-comp/g, names.kebab)
    .replace(/new_comp/g, names.snake);
}

// ── app.js update ─────────────────────────────────────────────────────────────

async function updateAppJs(names) {
  if (!(await fs.pathExists(APP_JS))) {
    log.warn("app.js not found — skipping auto-import. Add import and registration manually.");
    return;
  }

  let content = await fs.readFile(APP_JS, "utf8");

  // Idempotency: bail if already registered.
  if (content.includes(`/${names.kebab}/js/${names.kebab}.js`)) {
    log.warn("Component already imported in app.js — skipping.");
    return;
  }

  const importLine = `import ${names.pascal} from '../site/snippets/${names.kebab}/js/${names.kebab}.js';`;
  const registerLine = `  '${names.pascal}': ${names.pascal},`;

  const IMPORT_ANCHOR = "// create-comp inserts new imports here";
  const REGISTER_ANCHOR = "// create-comp inserts new registrations here";

  if (content.includes(IMPORT_ANCHOR)) {
    content = content.replace(IMPORT_ANCHOR, `${importLine}\n${IMPORT_ANCHOR}`);
  } else {
    log.warn("Import anchor not found in app.js — add import manually.");
  }

  if (content.includes(REGISTER_ANCHOR)) {
    content = content.replace(REGISTER_ANCHOR, `${registerLine}\n  ${REGISTER_ANCHOR}`);
  } else {
    log.warn("Registration anchor not found in app.js — add registration manually.");
  }

  await fs.writeFile(APP_JS, content);
}

// ── Run ───────────────────────────────────────────────────────────────────────

main().catch((err) => {
  console.error(chalk.red(`\n  Fatal: ${err.message}\n`));
  process.exit(1);
});
