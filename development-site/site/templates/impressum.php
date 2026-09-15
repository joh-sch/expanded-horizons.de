<?php snippet('header') ?>

<h1><?= esc($page->title()) ?></h1>

<?php snippet('layout/layout', ['layouts' => $page->info()->toLayouts()]) ?>

<?php snippet('footer') ?>
