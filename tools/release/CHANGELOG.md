# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] — 2026-06-02

### Changed

- GitHub release title is now prefixed with an emoji based on the major version number: `🔮` for `0.x.x` (pre-release/beta), `✨` for `1.x.x` and above (stable)

---

## [1.0.0] — 2026-06-02

### Added

- Initial release: drop-in git submodule for automating GitHub releases
- Reads version from `package.json`, changelog notes from `CHANGELOG.md`
- Creates and pushes a git tag, then publishes a GitHub release via `gh` CLI
- Configurable via `release` block in `package.json` (branch, changelog path, temp dir)
