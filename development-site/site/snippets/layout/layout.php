<?php

/** @var \Kirby\Cms\Layouts $layouts */

$layouts = $layouts ?? null;

if (!$layouts || $layouts->isEmpty()) return;

foreach ($layouts as $layout):
  $marginBottom = $layout->marginBottomAmount()->or(0)->value() . $layout->marginBottomUnit()->or('rem')->value();
  $flexClass = $layout->flex()->toBool() ? 'flex flex-' . $layout->flexDirection()->or('row')->value() : ''; ?>
  <div class="mb-(--mb) <?= esc($flexClass, 'attr') ?>" style="--mb: <?= esc($marginBottom, 'attr') ?>">
    <?php foreach ($layout->columns() as $column): ?>
      <div class="max-w-[65ch] text-sm">
        <?php foreach ($column->blocks() as $block): ?>
          <?= $block ?>
        <?php endforeach ?>
      </div>
    <?php endforeach ?>
  </div>
<?php endforeach;
