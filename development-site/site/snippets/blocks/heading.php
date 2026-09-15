<?php

/** @var \Kirby\Cms\Block $block */

// Setup //
$levels = [
	'h1' => 'text-hdl-lg',
	'h2' => 'text-hdl-md',
	'h3' => 'text-hdl-sm',
];
$level = $block->level()->value();
$level = array_key_exists($level, $levels) ? $level : 'h2';
$class = $levels[$level];
$marginBottom = $block->marginBottomAmount()->or(0)->value() . $block->marginBottomUnit()->or('rem')->value();

// Markup // ?>
<<?= $level ?> class="<?= $class ?> mb-(--mb)" style="--mb: <?= esc($marginBottom, 'attr') ?>"><?= $block->text() ?></<?= $level ?>>