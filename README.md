# Barebone Kirby 2026

A lean Kirby 5 foundation with Tailwind CSS 4, Rollup, Gia component lifecycles, Swup page transitions, and lazy-loaded responsive images.

The template intentionally contains no frontend navigation, project components, brand assets, custom fonts, or domain-specific content.

## Requirements

- PHP 8.2 or newer
- Composer
- Node.js and npm
- A local web server whose document root points to `development-site/`

## Start A Project

```sh
git clone --recurse-submodules <template-repository> my-project
cd my-project
npm install
npm --prefix build-utils install
npm run init-project
npm run init-kirby
cp development-site/site/config/config.localhost.php.example development-site/site/config/config.localhost.php
npm run watch
```

`npm run init-project` asks for the new project name, slug, and optional Git remote. Run it once, before project development begins.

The local config enables debugging and initial Panel installation. Keep it untracked and disable Panel installation after creating the first account.

## Frontend

- `npm run watch` starts Tailwind and Rollup watchers.
- `npm run build` creates production CSS and JavaScript.
- `npm run reload` starts the optional livereload server.
- `npm run create-comp "Feature Name"` creates a Kirby snippet and Gia component, then registers it in `development-site/app/app.js`.

Every Swup-managed page template must contain exactly one container with `id="swup"`. Its `data-page-id` value is synchronized to `body[data-page]` after navigation.

The template provides no navigation markup. Projects can add ordinary links or their own navigation; Swup intercepts eligible same-origin links automatically.

## Lazy Images

The `lazyImg` file method creates a constrained thumbnail, optional `srcset`, and a tiny blurred placeholder:

```php
<?php snippet('lazy-img/lazy-img', [
    'img' => $page->image()->lazyImg([
        'width' => 1500,
        'srcset' => [480, 960, 1500],
    ]),
    'sizes' => '100vw',
]) ?>
```

## Structure

- `development-site/app/`: frontend source and generated assets
- `development-site/content/`: Kirby flat-file content
- `development-site/site/`: blueprints, configuration, plugins, snippets, and templates
- `build-utils/`: project initialization, Kirby installation, component creation, and versioning
- `file-templates/`: reusable component source templates
- `tools/release/`: optional release automation

## Generated And Local State

The following are intentionally untracked and regenerated locally:

- `node_modules/` and `build-utils/node_modules/`
- `development-site/vendor/` and `development-site/composer.lock`
- `development-site/app/app.min.js*`
- `development-site/app/styles/styles.css`
- `development-site/media/` and `development-site/storage/`
- Kirby accounts, caches, and sessions
- `development-site/site/config/config.localhost.php`

## Intentionally Excluded

This template does not include source-project content, media, fonts, branding, navigation, project templates or blueprints, portfolio components, GSAP, Splide, Kirby-Hyph, installed Kirby core/vendor files, runtime state, credentials, generated assets, Git history, or remotes.

## Release Tool

`npm run release` uses the optional script in `tools/release/`. Configure the release branch and repository remote for the new project before using it.
