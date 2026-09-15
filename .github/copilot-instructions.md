# Project Guidelines

- Use single quotes in PHP and JavaScript/TypeScript strings unless a string contains a single quote that cannot reasonably be escaped.
- Use `<?= ... ?>` instead of `<?php echo ... ?>` in PHP templates.
- Keep components in `development-site/site/snippets/COMPONENT-NAME/` with optional JavaScript in `js/COMPONENT-NAME.js`.
- Create components with `npm run create-comp "Component Name"`.
- Do not commit generated frontend assets, installed dependencies, Kirby runtime state, local configuration, accounts, caches, or sessions.
- Use Conventional Commits in the form `type(scope): description`.

---

## Code style

- **Always use single quotes** in PHP and JavaScript/TypeScript strings — never double quotes, unless the string itself contains a single quote that cannot be escaped. Do not change existing quote style when editing a file.
- **Never run build or validation commands as part of routine edits** for this project. Do not use `npm run js-build`, `npm run build`, lint, or similar validation commands unless the user explicitly asks for them.

---

## Kirby component development

Rules for creating and editing components in this project. Components live in
`development-site/site/snippets/COMPONENT-NAME/` and consist of:

- `COMPONENT-NAME.php` — markup and any inline controller logic
- `js/COMPONENT-NAME.js` — JavaScript (only if needed)

Create new components with: `npm run create-comp "<Component Name>"`

### Component PHP files: PHP echo shorthand

Always use the `<?= … ?>` shorthand instead of `<?php echo … ?>`:

```php
<?= $text ? $text : null ?>
```

### Component PHP files: rendering color values as CSS custom properties

Inject color values as inline CSS custom properties on the root element.
The naming convention for color variables is `--c-<name>` (e.g. `--c-bg`, `--c-text`):

```php
<div style="--c-bg: <?= $color_bg ?>; --c-text: <?= $color_tx ?>;">
```

Then apply them in Tailwind utility classes using the `(--c-<name>)` CSS-variable syntax —
**not** inline `style="color: …"`:

```php
<div class="bg-(--c-bg) text-(--c-text)" style="--c-bg: …; --c-text: …;">
```

---

## Commit message rules (apply to ALL workflows below)

Always write commit messages in **Conventional Commits** format: `type(scope): description`

- **Types:** `feat`, `fix`, `refactor`, `style`, `chore`, `docs`
- **Scope:** the component, module, or area affected (e.g. `snippets`, `nav`, `config`)
- **Description:** imperative, lowercase, max 500 chars, no trailing period
- **Be descriptive:** the subject line must make the change immediately understandable without reading the diff
- **Body bullet points:** when there are multiple changes, each bullet explains _what_ changed and _why/how_
- Use `git commit` with multiple `-m` flags: one for the subject, then one per body bullet — e.g.
  `git commit -m "feat(nav): add mobile menu" -m "- adds hamburger toggle" -m "- collapses on outside click"`.
  Omit body flags if the subject line is fully self-contained.

---

## Changelog rules (apply when releasing)

Before any release, update `CHANGELOG.md` with a new top entry:

- Follow [Keep a Changelog](https://keepachangelog.com) format
- Group changes under `Added`, `Changed`, `Fixed`, `Removed` as appropriate
- Ensure the version in `CHANGELOG.md` matches `package.json`

---

## Trigger: "commit" (commit only, no push)

When the user says **"commit"** (or any close variant that does not include "push" or "release"),
execute this — no clarifying questions:

1. Run `git diff --cached --stat` and `git diff --cached` to review staged changes
   - If nothing is staged, run `git add -A` to stage all current changes, then review with `git diff --cached`
   - If there is still nothing to commit after staging, stop and tell the user
2. Write the commit message following the rules above
3. Run `git commit` (with `-m` flags as described above)
4. Confirm completion in one line

---

## Trigger: "commit and push"

When the user says **"commit and push"** (or any close variant), execute this — no clarifying questions:

1. Run `git diff --cached --stat` and `git diff --cached` to review staged changes
   - If nothing is staged, run `git add -A` to stage all current changes, then review
   - If there is still nothing to commit after staging, stop and tell the user
2. Write the commit message following the rules above
3. Run `git commit` (with `-m` flags as described above)
4. Run `git push` — if the push fails because no upstream is set, **stop immediately**, do NOT run
   `git push --set-upstream` or any equivalent, and tell the user that no upstream is configured
5. Confirm completion in one line

---

## Trigger: "commit, push, and release" (or "commit and release")

When the user says **"commit, push, and release"** or any close variant, execute this full sequence:

1. Run `git diff --cached --stat` and `git diff --cached` to review staged changes
   - If nothing is staged, run `git add -A`; if still nothing to commit, stop and tell the user
2. Update documentation and release metadata:
   - Update `CHANGELOG.md` with a new top entry (see changelog rules above)
   - Bump `package.json` version to match
3. Stage the updated metadata files
4. Write the commit message and run `git commit`
5. Run `git push` on the current branch
6. Checkout `devel`, merge the working branch, push `devel`, run `npm run release`
7. Confirm completion in one line

---

## Trigger: "release" (release only, no new commit)

When the user says **"release"** (without committing), execute only the release steps:

1. Verify there are no uncommitted changes — if there are, stop and ask whether to commit first
2. Update `CHANGELOG.md` and `package.json` version if not already up to date;
   commit those changes with `chore(release): update changelog and bump version`
3. Checkout `devel`, merge the current branch, push `devel` to `origin`
4. Verify current branch is `devel`, then run `npm run release`
5. Confirm completion in one line
