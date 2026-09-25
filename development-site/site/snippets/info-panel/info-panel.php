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
$info            = $site->info()->toLayouts();
$impressumPage   = $kirby->page('impressum');
$dataprivacyPage = $kirby->page('dataprivacy');
$credits         = $site->credits()->toStructure();
$footerlinks     = $site->footerlinks()->toStructure();

///// Markup /////
////////////////// ?>

<div
    g-component="InfoPanel"
    g-options  ='<?= json_encode($optionsToRender) ?>'
    class      ="group/InfoPanel relative">

  <?php snippet('info-panel/backdrop') ?>

  <div
    id            ="info-panel"
    g-ref         ="panel"
    role          ="dialog"
    aria-modal    ="true"
    aria-hidden   ="true"
    style         ="transform: translateY(calc(100% - 30px))"
    class         ="
      fixed bottom-0 inset-x-8 sm:inset-x-4 z-50 
      max-w-134 mx-auto 
      px-5.5 pt-5 pb-5.5 sm:px-6 sm:pt-5 sm:pb-6 
      rounded-2xl
      cursor-pointer bg-paper shadow-lg">

    <div g-ref="content" class="opacity-0 transition-opacity duration-666 ease-in-out">
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
          <?php
            $label = strtolower($link->label()->value());
            $isImpressum = in_array($label, ['impressum', 'imprint'], true);
            $isDataPrivacy = in_array($label, ['privacy policy', 'datenschutz'], true);
            $target = $isImpressum ? 'impressum' : ($isDataPrivacy ? 'dataprivacy' : null);
            $targetPage = $isImpressum ? $impressumPage : ($isDataPrivacy ? $dataprivacyPage : null);
          ?>
          <li>
            <a
                href="<?= esc($target && $targetPage ? $targetPage->url() : $link->url(), 'attr') ?>"
                <?= $target ? 'data-info-panel-target="' . esc($target, 'attr') . '"' : '' ?>>
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
      class         ="fixed bottom-0 inset-x-4 z-50 mx-auto max-w-134 rounded-2xl bg-paper px-6 py-6 shadow-lg">

    <div g-ref="impressumContent" class="opacity-0 transition-opacity duration-666 ease-in-out">
      <?php snippet('btns/btn', [
        'gRef'    => 'impressumClose',
        'class'   => 'absolute right-6 top-6 h-3.5 rounded-sm border border-current px-1.5',
        'content' => '<span class="text-[10px] translate-y-[0.5px]">Close</span>',
      ]); ?>

      <?php if ($impressumPage && $impressumPage->info()->toLayouts()->isNotEmpty()): ?>
        <?php snippet('layout/layout', ['layouts' => $impressumPage->info()->toLayouts()]) ?>
      <?php endif ?>
    </div>

  </div>

  <div
      id            ="dataprivacy-panel"
      g-ref         ="dataprivacyPanel"
      role          ="dialog"
      aria-modal    ="true"
      aria-hidden   ="true"
      style         ="transform: translateY(100%)"
      class         ="fixed bottom-0 inset-x-4 z-50 mx-auto max-w-134 rounded-2xl bg-paper px-6 py-6 shadow-lg">

    <div g-ref="dataprivacyContent" class="opacity-0 transition-opacity duration-666 ease-in-out">
      <?php snippet('btns/btn', [
        'gRef'    => 'dataprivacyClose',
        'class'   => 'absolute right-6 top-6 h-4 rounded-sm border border-current px-1.5',
        'content' => '<span class="text-[10px] translate-y-[0.5px]">Close</span>',
      ]); ?>

      <?php if ($dataprivacyPage && $dataprivacyPage->info()->toLayouts()->isNotEmpty()): ?>
        <?php snippet('layout/layout', ['layouts' => $dataprivacyPage->info()->toLayouts()]) ?>
      <?php endif ?>
    </div>

  </div>

</div>

<?php

// Outside refs. //
///////////////////

// snippet('InfoPanel/someRef', ['componentID' => $ID]); ?>
