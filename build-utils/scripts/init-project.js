#!/usr/bin/env node

/**
 * Project initialisation utility
 *
 * Bootstraps a new project from the barebone by replacing all barebone-specific
 * identifiers with project-specific ones throughout the codebase.
 *
 * Usage: npm run init-project
 *
 * What it updates:
 *   package.json                                  name, version
 *   CHANGELOG.md                                  reset to fresh state
 *   development-site/site/config/config.php       version constant name, project slug
 *   build-utils/scripts/updt-version.js           constant name
 *   build-utils/package.json                      package name
 *   git remotes                                   origin replaced with new project repo URL
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "../..");
const CONFIG_PHP = path.join(ROOT, "development-site/site/config/config.php");

// ─── helpers ─────────────────────────────────────────────────────────────────

function readFile(p) {
  return fs.readFileSync(p, "utf8");
}
function writeFile(p, content) {
  fs.writeFileSync(p, content, "utf8");
}
function replaceAll(str, s, r) {
  return str.split(s).join(r);
}

function ask(rl, question, defaultValue) {
  return new Promise((resolve) => {
    const prompt = defaultValue ? `${question} [${defaultValue}]: ` : `${question}: `;
    rl.question(prompt, (answer) => {
      resolve(answer.trim() || defaultValue || "");
    });
  });
}

function slugToConstPrefix(slug) {
  return slug.toUpperCase().replace(/-/g, "_");
}

function updatePackageIdentity(filePath, name, version) {
  if (!fs.existsSync(filePath)) return;

  const packageData = JSON.parse(readFile(filePath));
  packageData.name = name;
  packageData.version = version;

  if (packageData.packages?.[""]) {
    packageData.packages[""].name = name;
    packageData.packages[""].version = version;
  }

  writeFile(filePath, JSON.stringify(packageData, null, 2) + "\n");
}

// ─── main ────────────────────────────────────────────────────────────────────

async function main() {
  const pkgPath = path.join(ROOT, "package.json");
  const currentPkg = JSON.parse(readFile(pkgPath));

  if (currentPkg.name !== "barebone-kirby-2026") {
    console.error("\n✖  This project has already been initialized. Aborting.");
    process.exit(1);
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Barebone Kirby → New Project initialisation");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log("Answer the prompts below. Press Enter to accept defaults.\n");

  const projectName = await ask(rl, 'Project name (display name, e.g. "My Client 2026")');
  const slug = await ask(rl, 'Project slug (kebab-case, e.g. "my-client-2026")');
  const newRepoUrl = await ask(rl, "New project repo URL (leave blank to skip remote setup)");

  rl.close();

  if (!projectName || !slug) {
    console.error("\n✖  Project name and slug are required. Aborting.");
    process.exit(1);
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    console.error(`\n✖  Slug "${slug}" must be lowercase letters, numbers, and hyphens only. Aborting.`);
    process.exit(1);
  }

  const constPrefix = slugToConstPrefix(slug); // MY_CLIENT_2026

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Summary");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  Project name : ${projectName}`);
  console.log(`  Slug         : ${slug}`);
  console.log(`  Const prefix : ${constPrefix}_`);
  console.log();

  // ── package.json ───────────────────────────────────────────────────────────

  const pkg = currentPkg;
  pkg.name = slug;
  pkg.version = "0.0.0";
  writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  updatePackageIdentity(path.join(ROOT, "package-lock.json"), slug, "0.0.0");
  console.log(`✔  package.json           name → "${slug}", version reset to 0.0.0`);

  // ── CHANGELOG.md ───────────────────────────────────────────────────────────

  const changelogPath = path.join(ROOT, "CHANGELOG.md");
  const today = new Date().toISOString().split("T")[0];
  writeFile(
    changelogPath,
    [
      "# Changelog\n",
      "All notable changes to this project will be documented in this file.\n",
      "The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),",
      "and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).\n",
      "---\n",
      `## [0.0.0] — ${today}\n`,
      "### Added\n",
      `- Initial project setup based on barebone-kirby-2026\n`,
    ].join("\n"),
  );
  console.log(`✔  CHANGELOG.md           reset to fresh 0.0.0 entry`);

  // ── starter content ───────────────────────────────────────────────────────

  const siteContentPath = path.join(ROOT, "development-site/content/site.txt");
  if (fs.existsSync(siteContentPath)) {
    writeFile(siteContentPath, `Title: ${projectName}\n`);
    console.log(`✔  content/site.txt       title → "${projectName}"`);
  }

  // ── site/config/config.php ─────────────────────────────────────────────────

  if (fs.existsSync(CONFIG_PHP)) {
    let config = readFile(CONFIG_PHP);
    config = replaceAll(config, "EXPANDED_HORIZONS_VERSION", `${constPrefix}_VERSION`);
    config = replaceAll(config, "'barebone-kirby'", `'${slug}'`);
    config = replaceAll(config, '"barebone-kirby"', `"${slug}"`);
    writeFile(CONFIG_PHP, config);
    console.log(`✔  site/config/config.php version constant and slug updated`);
  }

  // ── build-utils/scripts/updt-version.js ───────────────────────────────────

  const updtVersionPath = path.join(ROOT, "build-utils/scripts/updt-version.js");
  if (fs.existsSync(updtVersionPath)) {
    let uv = readFile(updtVersionPath);
    uv = replaceAll(uv, "'EXPANDED_HORIZONS_VERSION'", `'${constPrefix}_VERSION'`);
    uv = replaceAll(uv, '"EXPANDED_HORIZONS_VERSION in config.php"', `"${constPrefix}_VERSION in config.php"`);
    writeFile(updtVersionPath, uv);
    console.log(`✔  updt-version.js        constant name updated`);
  }

  // ── build-utils/package.json ───────────────────────────────────────────────

  const buildPkgPath = path.join(ROOT, "build-utils/package.json");
  if (fs.existsSync(buildPkgPath)) {
    const buildPkg = JSON.parse(readFile(buildPkgPath));
    if (buildPkg.name) buildPkg.name = replaceAll(buildPkg.name, "barebone-kirby", slug);
    writeFile(buildPkgPath, JSON.stringify(buildPkg, null, 2) + "\n");
    updatePackageIdentity(
      path.join(ROOT, "build-utils/package-lock.json"),
      buildPkg.name,
      buildPkg.version,
    );
    console.log(`✔  build-utils/package.json package name updated`);
  }

  // ── git remotes ────────────────────────────────────────────────────────────

  if (newRepoUrl) {
    try {
      try {
        execFileSync("git", ["remote", "get-url", "origin"], { cwd: ROOT, stdio: "ignore" });
        execFileSync("git", ["remote", "remove", "origin"], { cwd: ROOT });
      } catch {
        // A fresh template clone may not have an origin yet.
      }
      execFileSync("git", ["remote", "add", "origin", newRepoUrl], { cwd: ROOT });
      console.log(`✔  git remotes            origin → ${newRepoUrl}`);
    } catch (e) {
      console.log(`⚠  git remotes            failed to remap — do it manually:\n     git remote remove origin\n     git remote add origin ${newRepoUrl}`);
    }
  } else {
    console.log("⚠  git remotes            skipped — configure an origin before pushing.");
  }

  // ── done ──────────────────────────────────────────────────────────────────

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Done! Next steps:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  1. Create a new repo on GitHub (if not done already) and push");
  console.log("  2. Run npm run init-kirby to install Kirby 5 via Composer");
  console.log("  3. Point your local PHP server (MAMP/Valet/Herd) at development-site/");
  console.log("  4. Copy site/config/config.localhost.php.example → site/config/config.localhost.php");
  console.log("     and adjust the hostname to your local domain");
  console.log("  5. Open your local URL/panel to create the first admin user");
  console.log("  6. Run: npm run watch  to start JS/CSS watchers");
  console.log();
}

main().catch((err) => {
  console.error("✖  Unexpected error:", err.message);
  process.exit(1);
});
