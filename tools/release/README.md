# auto-release

A zero-dependency drop-in git submodule that automates GitHub releases.

## Requirements

- [Node.js](https://nodejs.org/) >= 14
- [git](https://git-scm.com/)
- [gh CLI](https://cli.github.com/) (authenticated)

## Setup

### 1. Add as a submodule

```bash
git submodule add <this-repo-url> tools/release
```

### 2. Add a release script to the host project's `package.json`

```json
"scripts": {
  "release": "node tools/release/release.js"
}
```

### 3. (Optional) Configure via the `"release"` key in `package.json`

```json
"release": {
  "branch":    "main",
  "changelog": "CHANGELOG.md",
  "tagPrefix": "v",
  "tempDir":   "TEMP"
}
```

All fields are optional. See defaults below.

## Configuration

| Key | Default | Description |
|---|---|---|
| `branch` | `"main"` | Branch that must be in sync with `origin` before releasing |
| `changelog` | `"CHANGELOG.md"` (if the file exists) | Path to changelog file. Omit or remove the file to skip note extraction — GitHub's auto-generated notes are used instead |
| `tagPrefix` | `""` | String prepended to the version tag (e.g. `"v"` → tag `v1.2.3`) |
| `tempDir` | `"TEMP"` | Directory used for temporary files during the release |

## What it does

1. Verifies the working tree has no uncommitted changes.
2. Verifies the configured branch is in sync with `origin`.
3. Reads `version` from `package.json`.
4. If a changelog is present, extracts release notes for the current version and verifies it matches `package.json`.
5. Aborts if the git tag already exists.
6. Creates and pushes the git tag.
7. Creates the GitHub release (with changelog notes, or GitHub's auto-generated notes if no changelog is configured).

## Changelog format

The changelog must use the `## [x.y.z]` heading convention (e.g. [Keep a Changelog](https://keepachangelog.com/)):

```markdown
## [1.2.3] — 2026-05-21

### Added
- Some new feature
```

## Running

```bash
npm run release
# or directly:
node tools/release/release.js
```
