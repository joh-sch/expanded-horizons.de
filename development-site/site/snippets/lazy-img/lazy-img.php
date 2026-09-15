<?php

/**
 * Renders an image prepared by the lazyImg file method.
 *
 * Usage:
 * snippet('lazy-img/lazy-img', [
 *     'img' => $file->lazyImg(['width' => 1500, 'srcset' => [480, 960, 1500]]),
 *     'sizes' => '100vw',
 * ]);
 */

$img = $img ?? null;
if (!$img || empty($img['src'])) return;

$class = $class ?? '';
$sizes = $sizes ?? null;
$style = $style ?? '';
$alt = $alt ?? ($img['alt'] ?? '');

$styles = [];
if (!empty($img['ratio'])) $styles[] = '--ar: ' . $img['ratio'];
if ($style !== '') $styles[] = rtrim($style, ';');

?>

<img
  src="<?= esc($img['placeholder'] ?: $img['src'], 'attr') ?>"
  data-src="<?= esc($img['src'], 'attr') ?>"
  <?= !empty($img['srcset']) ? 'data-srcset="' . esc($img['srcset'], 'attr') . '"' : '' ?>
  <?= $sizes ? 'data-sizes="' . esc($sizes, 'attr') . '"' : '' ?>
  alt="<?= esc($alt, 'attr') ?>"
  decoding="async"
  class="lazy block max-w-full aspect-[var(--ar,auto)] [&.is-loading]:blur-[0.5rem] <?= esc($class, 'attr') ?>"
  <?= $styles ? 'style="' . esc(implode('; ', $styles), 'attr') . '"' : '' ?>>
