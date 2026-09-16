<?php

/** @var \Kirby\Cms\Layouts $layouts */

$layouts = $layouts ?? null;

if (!$layouts || $layouts->isEmpty()) return;

foreach ($layouts as $l):

  $marginBottom         = $l->marginBottomAmount()->or(0)->value() . $l->marginBottomUnit()->or('rem')->value();
  $flexDirectionClasses = [
    'row'         => 'flex-row',
    'row-reverse' => 'flex-row-reverse',
    'col'         => 'flex-col',
    'col-reverse' => 'flex-col-reverse',
  ];
  $flexClass = $l->flex()->toBool() ? 'flex ' . ($flexDirectionClasses[$l->flexDirection()->value()] ?? 'flex-row') : ''; ?>

  <div 
    class="mb-(--mb)" 
    style="--mb: <?= esc($marginBottom, 'attr') ?>">

    <?php 
    foreach ($l->columns() as $c): ?>
      <div class="max-w-[65ch] <?= esc($flexClass, 'attr') ?> text-sm">
        <?php foreach ($c->blocks() as $block) echo $block ?>
      </div> <?php
    endforeach ?>
  </div>

<?php endforeach;
