#!/usr/bin/env node

/**
 * Kirby 5 installation utility
 *
 * Installs Kirby 5 into the development-site/ directory via Composer.
 *
 * Usage: npm run init-kirby
 *
 * Requirements: PHP >= 8.2, Composer (https://getcomposer.org/)
 */

const { execFileSync, execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const ROOT = path.resolve(__dirname, "../..");
const DEST = path.join(ROOT, "development-site");

// ─── helpers ─────────────────────────────────────────────────────────────────

function step(msg) {
  console.log(`\n  ${msg}`);
}
function ok(msg) {
  console.log(`  ✔  ${msg}`);
}
function abort(msg) {
  console.error(`\n  ✖  ${msg}\n`);
  process.exit(1);
}

// ─── preflight ───────────────────────────────────────────────────────────────

// Check Kirby is not already installed
if (fs.existsSync(path.join(DEST, "vendor/autoload.php"))) {
  abort("Kirby is already installed (vendor/autoload.php exists).\n     Remove development-site/vendor/ first to reinstall.");
}

// Check PHP is available
try {
  execFileSync("php", ["--version"], { stdio: "pipe" });
} catch {
  abort("PHP is not available in PATH. Install PHP >= 8.2 first.");
}

// Check Composer is available
try {
  execFileSync("composer", ["--version"], { stdio: "pipe" });
} catch {
  abort("Composer is not available in PATH. Install it from https://getcomposer.org/");
}

// ─── main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Kirby 5 Installation");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  step("Running composer install in development-site/…");
  try {
    execSync("composer install --no-interaction", { cwd: DEST, stdio: "inherit" });
  } catch (err) {
    abort(`composer install failed: ${err.message}`);
  }
  ok("Kirby 5 installed via Composer.");

  // Create required runtime directories (gitignored)
  const runtimeDirs = [path.join(DEST, "media"), path.join(DEST, "storage/accounts"), path.join(DEST, "storage/cache"), path.join(DEST, "storage/sessions")];
  for (const dir of runtimeDirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
  ok("Runtime directories created (media/, storage/).");

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Done! Next steps:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  1. Point your local PHP server (MAMP/Valet/Herd) at development-site/");
  console.log("  2. Copy site/config/config.localhost.php.example → site/config/config.localhost.php");
  console.log("     and adjust the hostname to match your local domain");
  console.log("  3. Open your local URL/panel to create the first admin user");
  console.log("  4. Run: npm run watch  to start JS/CSS watchers");
  console.log();
}

main().catch((err) => {
  console.error(`\n✖  Fatal: ${err.message}\n`);
  process.exit(1);
});
