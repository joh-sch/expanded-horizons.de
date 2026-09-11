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

$optionsToRender = [];

///// Markup /////
////////////////// ?>

<div
    g-component="IntroBar"
    g-options  ='<?= json_encode($optionsToRender) ?>'
    class      ="group/IntroBar fixed inset-x-0 top-4 z-40 flex justify-center px-4">

  <div class="flex items-center gap-3 rounded-full bg-paper/90 px-4 py-2 text-sm shadow-sm backdrop-blur">
    <span><?= esc($site->tagline()) ?></span>

    <button
        g-ref         ="toggleBtn"
        type          ="button"
        aria-expanded ="false"
        aria-controls ="info-panel"
        class         ="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ink text-xs leading-none">
      <span aria-hidden="true">···</span>
      <span class="sr-only">Toggle info panel</span>
    </button>
  </div>

</div>

<?php

// Outside refs. //
///////////////////

// snippet('IntroBar/someRef', ['componentID' => $ID]); ?>
