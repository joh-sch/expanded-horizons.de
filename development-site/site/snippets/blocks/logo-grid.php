<?php

// Imports //
// ...

// Setup //
$b            = $block;
$items        = $b->items()->toStructure();
$marginBottom = $b->marginBottomAmount()->or(0)->value() . $b->marginBottomUnit()->or('rem')->value();

// Markup // ?>
<div class="grid grid-cols-2 gap-6">
  <?php foreach ($items as $item): ?>
      <?php $img_logo = $item->img_logo()->toFile(); ?>
      <?php $link = $item->link()->isNotEmpty() ? $item->link()->toUrl() : null; ?>
      <?php if ($img_logo): ?>
          <?= $link ? '<a href="' . $link . '" target="_blank">' : '<div>' ?>
              <img src="<?= $img_logo->url() ?>" alt="<?= $img_logo->alt() ?>">
          <?= $link ? '</a>' : '</div>' ?>
      <?php endif ?>
  <?php endforeach ?>
</div>