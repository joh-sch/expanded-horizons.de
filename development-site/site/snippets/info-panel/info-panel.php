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
$info = $site->info()->toLayouts();
$impressumPage = $kirby->page('impressum');
$credits = $site->credits()->toStructure();
$footerlinks = $site->footerlinks()->toStructure();

///// Markup /////
////////////////// ?>

<div
    g-component="InfoPanel"
    g-options  ='<?= json_encode($optionsToRender) ?>'
    class      ="group/InfoPanel relative">

  <div
      g-ref  ="backdrop"
      class  ="fixed inset-0 z-40 pointer-events-none"
      aria-hidden="true">
  </div>

  <div
      id            ="info-panel"
      g-ref         ="panel"
      role          ="dialog"
      aria-modal    ="true"
      aria-hidden   ="true"
      style         ="transform: translateY(calc(100% - 3.5rem))"
      class         ="left-0 right-0 z-50 mx-auto w-full max-w-134 rounded-2xl bg-paper px-6 py-6 shadow-lg">

    <div g-ref="content" class="opacity-0 transition-opacity duration-300 ease-in-out">
    <?php if ($info->isNotEmpty()): ?>
      <?php snippet('layout/layout', ['layouts' => $info]) ?>
    <?php else: ?>
      <h2 class="text-sm font-bold tracking-wide">About</h2>
      <div class="mt-2 max-w-[65ch] text-sm">
        <?= $site->about()->kt() ?>
      </div>

      <h2 class="mt-8 text-sm font-bold tracking-wide">Contact</h2>
      <div class="mt-2 max-w-[65ch] text-sm">
        <?= esc($site->contact()->or('more coming soon')) ?>
      </div>
    <?php endif ?>

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
      <ul class="mt-10 flex flex-wrap gap-x-4 gap-y-1 fließtext-md tracking-wide">
        <?php foreach ($footerlinks as $link): ?>
          <?php $isImpressum = strtolower($link->label()->value()) === 'impressum'; ?>
          <li>
            <a
                href="<?= esc($isImpressum && $impressumPage ? $impressumPage->url() : $link->url(), 'attr') ?>"
                <?= $isImpressum ? 'data-info-panel-target="impressum"' : '' ?>>
              <?= esc($link->label()) ?>
            </a>
          </li>
        <?php endforeach ?>
      </ul>
    <?php endif ?>
    </div>

  </div>

  <div
      id            ="impressum-panel"
      g-ref         ="impressumPanel"
      role          ="dialog"
      aria-modal    ="true"
      aria-hidden   ="true"
      style         ="transform: translateY(100%)"
      class         ="relative left-0 right-0 z-50 mx-auto w-full max-w-134 rounded-2xl bg-paper px-6 py-6 shadow-lg">

    <div g-ref="impressumContent" class="opacity-0 transition-opacity duration-300 ease-in-out">
      <button
          g-ref="impressumClose"
          type="button"
          class="absolute right-6 top-6 text-sm font-bold tracking-wide transition-colors hover:text-accent">
        Close
      </button>

      <?php if ($impressumPage && $impressumPage->info()->toLayouts()->isNotEmpty()): ?>
        <?php snippet('layout/layout', ['layouts' => $impressumPage->info()->toLayouts()]) ?>
      <?php endif ?>
    </div>

  </div>

</div>

<?php

// Outside refs. //
///////////////////

// snippet('InfoPanel/someRef', ['componentID' => $ID]); ?>
