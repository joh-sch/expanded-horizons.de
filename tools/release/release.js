#!/usr/bin/env node
"use strict";

/**
 * Automated GitHub release tool — drop-in git submodule.
 *
 * Run from the host project's root:
 *   node <submodule-path>/release.js
 *
 * Or add a script to the host project's package.json:
 *   "scripts": { "release": "node tools/release/release.js" }
 *
 * Configuration ("release" key in the host project's package.json):
 *   {
 *     "release": {
 *       "branch":    "main",         // branch to verify sync with  (default: "main")
 *       "changelog": "CHANGELOG.md", // path to changelog file      (default: "CHANGELOG.md" if it exists, skipped otherwise)
 *       "tagPrefix": "v",            // prefix prepended to the tag  (default: "")
 *       "tempDir":   "TEMP"          // dir for temporary files      (default: "TEMP")
 *     }
 *   }
 *
 * Requirements: git, gh CLI (https://cli.github.com/), Node >= 14
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

// Project root = wherever the script is invoked from
const ROOT = process.cwd();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function run(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, encoding: "utf8", ...opts }).trim();
}

function abort(msg) {
  console.error(`\n✖  ${msg}\n`);
  process.exit(1);
}

function ok(msg) {
  console.log(`✔  ${msg}`);
}

// ---------------------------------------------------------------------------
// Load host project's package.json
// ---------------------------------------------------------------------------

const PACKAGE_JSON_PATH = path.join(ROOT, "package.json");

if (!fs.existsSync(PACKAGE_JSON_PATH)) {
  abort("No package.json found. Run this script from the project root.");
}

const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, "utf8"));
const config = pkg.release || {};

const BRANCH = config.branch || "main";
const TAG_PREFIX = config.tagPrefix !== undefined ? config.tagPrefix : "";
const TEMP_DIR = config.tempDir ? path.join(ROOT, config.tempDir) : path.join(ROOT, "TEMP");

// Resolve changelog path: use config value, or default to CHANGELOG.md only if it exists
const CHANGELOG_PATH = config.changelog ? path.join(ROOT, config.changelog) : fs.existsSync(path.join(ROOT, "CHANGELOG.md")) ? path.join(ROOT, "CHANGELOG.md") : null;

// ---------------------------------------------------------------------------
// 1. Working tree must be clean
// ---------------------------------------------------------------------------

const dirty = run("git status --porcelain");
if (dirty) {
  abort(`Working tree has uncommitted changes:\n${dirty}\n  Commit or stash them before releasing.`);
}
ok("Working tree is clean.");

// ---------------------------------------------------------------------------
// 2. Local branch must be in sync with origin
// ---------------------------------------------------------------------------

run(`git fetch origin ${BRANCH} --quiet`);

const localRef = run(`git rev-parse ${BRANCH}`);
const remoteRef = run(`git rev-parse origin/${BRANCH}`);

if (localRef !== remoteRef) {
  if (run(`git merge-base ${BRANCH} origin/${BRANCH}`) === remoteRef) {
    abort(`Local ${BRANCH} is ahead of origin/${BRANCH} — push your commits first.`);
  } else {
    abort(`Local ${BRANCH} is behind origin/${BRANCH} — pull the latest changes first.`);
  }
}
ok(`${BRANCH} is in sync with origin/${BRANCH}.`);

// ---------------------------------------------------------------------------
// 3. Determine version from package.json
// ---------------------------------------------------------------------------

const version = pkg.version;
if (!version) abort("No version field found in package.json.");
ok(`Version: ${version}`);

// ---------------------------------------------------------------------------
// 4. Parse changelog for release notes (optional)
// ---------------------------------------------------------------------------

let notes = "";

if (CHANGELOG_PATH) {
  const changelog = fs.readFileSync(CHANGELOG_PATH, "utf8");

  // Match the first  ## [x.y.z] — ...  heading
  const headerRe = /^## \[(\d+\.\d+\.\d+)\][^\n]*/m;
  const headerMatch = changelog.match(headerRe);

  if (!headerMatch) {
    abort(`${path.basename(CHANGELOG_PATH)} exists but contains no ## [x.y.z] entry.`);
  }

  const changelogVersion = headerMatch[1];
  if (changelogVersion !== version) {
    abort(`package.json version (${version}) does not match ` + `changelog version (${changelogVersion}). Update one of them first.`);
  }

  const entryStart = headerMatch.index + headerMatch[0].length;
  const nextHeader = changelog.indexOf("\n## ", entryStart);
  const rawNotes = (nextHeader === -1 ? changelog.slice(entryStart) : changelog.slice(entryStart, nextHeader)).trim();

  notes = rawNotes.replace(/\n---\s*$/, "").trim();
  if (!notes) abort(`Changelog entry for ${version} has no body text.`);
  ok("Changelog notes extracted.");
} else {
  ok("No changelog configured — GitHub will auto-generate release notes.");
}

// ---------------------------------------------------------------------------
// 5. Tag must not already exist
// ---------------------------------------------------------------------------

const tag = `${TAG_PREFIX}${version}`;
const existingTags = run("git tag")
  .split("\n")
  .map((t) => t.trim());

if (existingTags.includes(tag)) {
  abort(`Tag ${tag} already exists. Nothing to do.`);
}
ok(`Tag ${tag} does not exist yet.`);

// ---------------------------------------------------------------------------
// 6. Create and push the tag
// ---------------------------------------------------------------------------

run(`git tag ${tag}`);
ok(`Created tag ${tag}.`);

run(`git push origin ${tag}`);
ok(`Pushed tag ${tag} to origin.`);

// ---------------------------------------------------------------------------
// 7. Create the GitHub release
// ---------------------------------------------------------------------------

let releaseUrl;

if (notes) {
  if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

  const tmpNotes = path.join(TEMP_DIR, "_release-notes.md");
  fs.writeFileSync(tmpNotes, notes, "utf8");

  const majorVersion = parseInt(version.split(".")[0], 10);
  const releaseEmoji = majorVersion >= 1 ? "✨" : "🔮";

  try {
    releaseUrl = run(`gh release create "${tag}" --title "${releaseEmoji} ${tag}" --notes-file "${tmpNotes}"`);
  } finally {
    fs.unlinkSync(tmpNotes);
  }
} else {
  const majorVersion = parseInt(version.split(".")[0], 10);
  const releaseEmoji = majorVersion >= 1 ? "✨" : "🔮";
  releaseUrl = run(`gh release create "${tag}" --title "${releaseEmoji} ${tag}" --generate-notes`);
}

console.log(`\n✔  GitHub release created: ${releaseUrl}\n`);
