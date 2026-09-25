<?php /** @var \Kirby\Cms\Block $block */

// Setup //
$marginBottom = $block->marginBottomAmount()->or(0)->value() . $block->marginBottomUnit()->or('rem')->value();
$colCount     = $block->colCount()->or(1)->value();

// Markup // ?>
<div 
  class="fließtext-md mb-(--mb) columns-(--col-count)" 
  style="
    --mb       : <?= esc($marginBottom, 'attr') ?>;
    --col-count: <?= esc($colCount, 'attr') ?>;
    ">
  <?= $block->text(); ?>
</div>