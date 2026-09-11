<?php

////// Doc. //////
//////////////////

/**
* Bottom-sheet info panel (about / contact / credits / footer links).
* Peeks from the bottom edge when closed, slides fully into view on toggle.
*/

//// Imports /////
//////////////////

// use Kirby\Cms\Content;

///// Setup //////
//////////////////

$optionsToRender = [];
$credits = $site->credits()->toStructure();
$footerlinks = $site->footerlinks()->toStructure();

///// Markup /////
////////////////// ?>

<div
    g-component="InfoPanel"
    g-options  ='<?= json_encode($optionsToRender) ?>'
    class      ="group/InfoPanel">

  <div
      g-ref  ="backdrop"
      class  ="fixed inset-0 z-40 bg-ink/40 opacity-0 pointer-events-none transition-opacity duration-300"
      aria-hidden="true">
  </div>

  <div
      id            ="info-panel"
      g-ref         ="panel"
      role          ="dialog"
      aria-modal    ="true"
      aria-hidden   ="true"
      class         ="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[calc(100%-6rem)] w-full max-w-xl translate-y-[calc(100%-3.5rem)] overflow-y-auto rounded-t-2xl bg-paper px-6 py-6 shadow-lg">

    <h2 class="text-sm font-bold tracking-wide">About</h2>
    <div class="prose-content mt-2 text-sm">
      <?= $site->about()->kt() ?>
    </div>

    <h2 class="mt-8 text-sm font-bold tracking-wide">Contact</h2>
    <div class="prose-content mt-2 text-sm">
      <?= esc($site->contact()->or('more coming soon')) ?>
    </div>

    <?php if ($credits->isNotEmpty()): ?>
      <div class="mt-10 text-xs">
        <p class="font-bold tracking-wide">Ein Projekt von</p>
        <?php foreach ($credits as $credit): ?>
          <p class="mt-2">
            <span class="font-bold"><?= esc($credit->name()) ?></span>
            <?php if ($credit->subtitle()->isNotEmpty()): ?>
              <br><span class="text-ink/70"><?= esc($credit->subtitle()) ?></span>
            <?php endif ?>
          </p>
        <?php endforeach ?>
      </div>
    <?php endif ?>

    <?php if ($footerlinks->isNotEmpty()): ?>
      <ul class="mt-10 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold tracking-wide">
        <?php foreach ($footerlinks as $link): ?>
          <li><a href="<?= esc($link->url(), 'attr') ?>"><?= esc($link->label()) ?></a></li>
        <?php endforeach ?>
      </ul>
    <?php endif ?>

  </div>

</div>

<?php

// Outside refs. //
///////////////////

// snippet('InfoPanel/someRef', ['componentID' => $ID]); ?>
