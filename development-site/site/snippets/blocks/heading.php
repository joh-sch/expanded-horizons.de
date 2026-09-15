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

// Markup // ?>
<<?= $level ?> class="<?= $class ?>"><?= $block->text() ?></<?= $level ?>>