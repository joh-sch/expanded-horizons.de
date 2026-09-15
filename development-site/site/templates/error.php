<?php snippet('header') ?>

<?php // Error content // ?>
<h1><?= esc($page->title()) ?></h1>
<p><?= esc($page->text()->or('The requested page could not be found.')->value()) ?></p>

<?php snippet('footer') ?>
