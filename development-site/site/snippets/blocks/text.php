<?php /** @var \Kirby\Cms\Block $block */
$marginBottom = $block->marginBottomAmount()->or(0)->value() . $block->marginBottomUnit()->or('rem')->value(); ?>

<div class="fließtext-md mb-(--mb)" style="--mb: <?= esc($marginBottom, 'attr') ?>">
  <?= $block->text(); ?>
</div>