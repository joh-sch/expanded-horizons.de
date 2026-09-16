<?php

/** @var \Kirby\Cms\Block $block */

$marginBottom = $block->marginBottomAmount()->or(0)->value() . $block->marginBottomUnit()->or('rem')->value();
$target = $block->openInNewTab()->toBool() ? '_blank' : null;

?>
<a
  href="<?= esc($block->url()->value(), 'attr') ?>"
  <?= $target ? 'target="' . $target . '" rel="noopener noreferrer"' : '' ?>
  class="text-hdl-sm text-ink transition-colors hover:text-accent mb-(--mb) after:ml-1 after:inline-block after:align-top after:text-[0.7em] after:content-['↗']"
  style="--mb: <?= esc($marginBottom, 'attr') ?>">
  <?= esc($block->text()) ?>
</a>
