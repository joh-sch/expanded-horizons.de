<?php

////// Doc. //////
//////////////////

/**
* Fixed top-center tagline bar with a toggle button for the info panel.
*/

//// Imports /////
//////////////////

// use Kirby\Cms\Content;

///// Setup //////
//////////////////

$optionsToRender = $languageOptions ?? [];

///// Markup /////
////////////////// ?>

<div
    id         ="intro-bar"
    g-component="IntroBar"
    g-options  ='<?= esc(json_encode($optionsToRender), 'attr') ?>'
    class      ="group/IntroBar fixed inset-x-0 top-2 z-40 flex items-center justify-center gap-2 px-4 text-ink">

  <span g-ref="tagline" class="inline-block whitespace-nowrap text-[12px] font-medium sm:text-[14px] tracking-[-0.005em] opacity-100 transition-[opacity,width] duration-300 ease-in-out"><?= esc($site->tagline()) ?></span>

  <div class="flex items-center justify-center gap-1">
    <?php // Info panel toggle btn. // ?>
    <button
        g-ref         ="toggleBtn"
        type          ="button"
        aria-expanded ="false"
        aria-controls ="info-panel"
        class         ="flex h-3.5 shrink-0 items-center justify-center gap-1.5 rounded-sm border border-current px-1.5">
      <span g-ref="dots" class="flex items-center gap-1" aria-hidden="true">
        <svg class="h-[0.15rem] w-[0.15rem]" viewBox="0 0 0.15 0.15" fill="currentColor">
          <circle cx="0.075" cy="0.075" r="0.075" />
        </svg>
        <svg class="h-[0.15rem] w-[0.15rem]" viewBox="0 0 0.15 0.15" fill="currentColor">
          <circle cx="0.075" cy="0.075" r="0.075" />
        </svg>
        <svg class="h-[0.15rem] w-[0.15rem]" viewBox="0 0 0.15 0.15" fill="currentColor">
          <circle cx="0.075" cy="0.075" r="0.075" />
        </svg>
      </span>
      <span g-ref="closeLabel" class="hidden text-[10px] translate-y-[0.5px]" aria-hidden="true">CLOSE</span>
      <span class="sr-only">Toggle info panel</span>
    </button>

    <?php // Lang. switch button // ?>
    <button
        g-ref         ="langToggleBtn"
        type          ="button"
        aria-pressed  ="false"
        aria-label    ="Switch language"
        class         ="relative flex h-3.5 shrink-0 items-center justify-center gap-0.5 overflow-hidden rounded-sm border border-current px-1_">
      <span g-ref="langHighlight" class="absolute inset-y-0 left-0 z-0 w-1/2 translate-x-0 bg-black transition-transform duration-200 ease-in-out" aria-hidden="true"></span>
      <span g-ref="langDe" class="relative z-10 pl-0.75 pr-0.5 text-[10px] translate-y-[0.5px] text-accent transition-colors duration-200">DE</span>
      <span g-ref="langEn" class="relative z-10 pl-0.5 pr-0.75 text-[10px] translate-y-[0.5px] transition-colors duration-200">EN</span>
    </button>
  </div>

</div>

<?php

// Outside refs. //
///////////////////

// snippet('IntroBar/someRef', ['componentID' => $ID]); ?>
