<!doctype html>
<html lang="<?= $kirby->language()?->code() ?? 'en' ?>">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= esc($page->title()) ?> | <?= esc($site->title()) ?></title>

  <?php // Styles // ?>
  <?= css('app/styles/styles.css?v=' . EXPANDED_HORIZONS_VERSION) ?>
</head>
<body data-page="<?= esc($page->id(), 'attr') ?>">

  <?php // Persistent chrome (outside #swup, never re-mounted on page transitions) // ?>
  <?php snippet('intro-bar/intro-bar') ?>
  <?php snippet('info-panel/info-panel') ?>
