<?php

/** @var \Kirby\Cms\Block $block */

$marginBottom = $block->marginBottomAmount()->or(0)->value() . $block->marginBottomUnit()->or('rem')->value();
$target = $block->openInNewTab()->toBool() ? '_blank' : null;

?>
<a
  href="<?= esc($block->url()->value(), 'attr') ?>"
  <?= $target ? 'target="' . $target . '" rel="noopener noreferrer"' : '' ?>
  class="relative inline-flex text-ink transition-colors hover:text-accent mb-(--mb)"
  style="--mb: <?= esc($marginBottom, 'attr') ?>">
  <span class="relative z-10"><?= esc($block->text()) ?></span>
  <span class="absolute right-[-0.35em] top-[-0.2em] z-0 text-[0.7em] leading-none" aria-hidden="true">↗</span>
</a>
