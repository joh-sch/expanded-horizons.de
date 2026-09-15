<?php snippet('header') ?>

<?php // Main content // ?>
<h1><?= esc($page->title()) ?></h1>

<?php if ($page->text()->isNotEmpty()): ?>
  <div class="max-w-[65ch]">
    <?= $page->text()->kt() ?>
  </div>
<?php endif ?>

<?php snippet('footer') ?>
