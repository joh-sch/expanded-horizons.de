<?php

/** @var \Kirby\Cms\Layouts $layouts */

$layouts = $layouts ?? null;

if (!$layouts || $layouts->isEmpty()) return;

foreach ($layouts as $layout):
  foreach ($layout->columns() as $column): ?>
    <div class="max-w-[65ch] text-sm">
      <?php foreach ($column->blocks() as $block): ?>
        <?= $block ?>
      <?php endforeach ?>
    </div>
  <?php endforeach;
endforeach;
