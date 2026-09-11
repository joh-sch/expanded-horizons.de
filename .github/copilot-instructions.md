# Project Guidelines

- Use single quotes in PHP and JavaScript/TypeScript strings unless a string contains a single quote that cannot reasonably be escaped.
- Use `<?= ... ?>` instead of `<?php echo ... ?>` in PHP templates.
- Keep components in `development-site/site/snippets/COMPONENT-NAME/` with optional JavaScript in `js/COMPONENT-NAME.js`.
- Create components with `npm run create-comp "Component Name"`.
- Do not commit generated frontend assets, installed dependencies, Kirby runtime state, local configuration, accounts, caches, or sessions.
- Use Conventional Commits in the form `type(scope): description`.
