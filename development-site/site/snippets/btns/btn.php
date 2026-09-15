<?php

/**
 * Reusable base button, derived from the intro-bar info panel toggle.
 *
 * Usage:
 * <?php ob_start(); ?>
 *   <span>...</span>
 * <?php $content = ob_get_clean();
 *
 * snippet('btns/btn', [
 *     'gRef' => 'myBtn',
 *     'attrs' => 'aria-expanded="false" aria-controls="info-panel"',
 *     'class' => 'extra utility classes',
 *     'content' => $content,
 * ]);
 */

$gRef = $gRef ?? null;
$type = $type ?? 'button';
$attrs = $attrs ?? '';
$class = $class ?? '';
$content = $content ?? '';

?>
<button
  <?= $gRef ? 'g-ref="' . esc($gRef, 'attr') . '"' : '' ?>
  type="<?= esc($type, 'attr') ?>"
  <?= $attrs ?>
  class="
    inline-flex shrink-0 items-center justify-center gap-1.5 
    cursor-pointer uppercase
    <?= esc($class, 'attr') ?>">
  <?= $content ?>
</button>
