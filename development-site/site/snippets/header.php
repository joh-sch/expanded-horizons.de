<!doctype html>
<html 
  lang="<?= $kirby->language()?->code() ?? 'en' ?>"
  class="bg-accent">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= esc($page->title()) ?> | <?= esc($site->title()) ?></title>

  <?php // Styles // ?>
  <?= css('app/styles/styles.css?v=' . EXPANDED_HORIZONS_VERSION) ?>
</head>

<body data-page="<?= esc($page->id(), 'attr') ?>">

  <main
      id="swup"
      data-page-id="<?= esc($page->id(), 'attr') ?>"
      class="
        w-full mx-auto py-[clamp(3rem,8vw,8rem)] 
        opacity-100 transition-opacity duration-[250ms] ease-in-out
        motion-reduce:transition-none [html.is-animating_&]:opacity-0 
        <?= $mainClass ?? '' ?>">

    <?php
    snippet('intro-bar/intro-bar');
    snippet('info-panel/info-panel'); ?>
