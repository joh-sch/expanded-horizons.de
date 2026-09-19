<!doctype html>
<html 
  lang="<?= esc($languageOptions['currentLanguage'] ?? 'en') ?>"
  class="bg-accent selection:bg-accent">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= esc($page->title()) ?> | <?= esc($site->title()) ?></title>

  <?php // Favicon // ?>
  <link rel="icon" href="<?= url('favicon.ico') ?>" sizes="any">
  <link rel="icon" type="image/png" sizes="32x32" href="<?= url('app/assets/favicon/favicon-32x32.png') ?>">
  <link rel="icon" type="image/png" sizes="16x16" href="<?= url('app/assets/favicon/favicon-16x16.png') ?>">
  <link rel="apple-touch-icon" sizes="180x180" href="<?= url('app/assets/favicon/apple-touch-icon.png') ?>">

  <?php // Styles // ?>
  <?= css('app/styles/styles.css?v=' . EXPANDED_HORIZONS_VERSION) ?>
</head>

<body data-page="<?= esc($page->id(), 'attr') ?>">

  <?php snippet('intro-bar/intro-bar') ?>
  <?php snippet('typo-bg/typo-bg-v2') ?>

  <main
    id                  ="swup"
    data-page-id        ="<?= esc($page->id(), 'attr') ?>"
    data-language       ="<?= esc($languageOptions['currentLanguage'] ?? 'de', 'attr') ?>"
    data-language-url-de="<?= esc($languageOptions['languageUrls']['de'] ?? '', 'attr') ?>"
    data-language-url-en="<?= esc($languageOptions['languageUrls']['en'] ?? '', 'attr') ?>"
    data-page-title     ="<?= esc($page->title() . ' | ' . $site->title(), 'attr') ?>"
    class               ="
      w-full mx-auto py-[clamp(3rem,8vw,8rem)] 
      opacity-100 transition-opacity duration-250 ease-in-out
      motion-reduce:transition-none [html.is-animating_&]:opacity-0 
      relative <?= $mainClass ?? '' ?>">
