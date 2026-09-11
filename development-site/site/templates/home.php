<?php snippet('header') ?>

<?php // Main content // ?>
<main id="swup" data-page-id="<?= esc($page->id(), 'attr') ?>" class="page-shell transition-fade bg-accent min-h-screen text-ink">
  <h1><?= esc($page->title()) ?></h1>

  <?php if ($page->text()->isNotEmpty()): ?>
    <div class="prose-content">
      <?= $page->text()->kt() ?>
    </div>
  <?php endif ?>
</main>

<?php snippet('footer') ?>
