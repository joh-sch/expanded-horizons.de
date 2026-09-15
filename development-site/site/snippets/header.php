<!doctype html>
<html 
  lang="<?= $kirby->language()?->code() ?? 'en' ?>"
  class="bg-accent selection:bg-accent">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= esc($page->title()) ?> | <?= esc($site->title()) ?></title>

  <?php // Styles // ?>
  <?= css('app/styles/styles.css?v=' . EXPANDED_HORIZONS_VERSION) ?>
</head>

<body data-page="<?= esc($page->id(), 'attr') ?>">

  <?php
  $language = $kirby->language();
  $languageOptions = [
    'currentLanguage' => $language?->code() ?? 'de',
    'languageUrls' => [
      'de' => $page->url('de'),
      'en' => $page->url('en'),
    ],
    'languageTaglines' => [
      'de' => $site->content('de')->tagline()->value(),
      'en' => $site->content('en')->tagline()->value(),
    ],
  ];
  snippet('intro-bar/intro-bar', ['languageOptions' => $languageOptions]); ?>

  <?php snippet('typo-bg/typo-bg'); ?>

  <main
      id="swup"
      data-page-id="<?= esc($page->id(), 'attr') ?>"
      data-language="<?= esc($language?->code() ?? 'de', 'attr') ?>"
      data-language-url-de="<?= esc($page->url('de'), 'attr') ?>"
      data-language-url-en="<?= esc($page->url('en'), 'attr') ?>"
      data-page-title="<?= esc($page->title() . ' | ' . $site->title(), 'attr') ?>"
      class="
        w-full mx-auto py-[clamp(3rem,8vw,8rem)] 
        opacity-100 transition-opacity duration-250 ease-in-out
        motion-reduce:transition-none [html.is-animating_&]:opacity-0 
        relative <?= $mainClass ?? '' ?>">

    <?php snippet('info-panel/info-panel'); ?>
