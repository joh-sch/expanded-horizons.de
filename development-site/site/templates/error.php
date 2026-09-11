<?php snippet('header') ?>

<?php // Error content // ?>
<main id="swup" data-page-id="<?= esc($page->id(), 'attr') ?>" class="page-shell transition-fade">
  <h1><?= esc($page->title()) ?></h1>
  <p><?= esc($page->text()->or('The requested page could not be found.')->value()) ?></p>
</main>

<?php snippet('footer') ?>
