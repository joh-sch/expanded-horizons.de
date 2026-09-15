<?php

// Imports //
// use PROJECT\Utils as Utils;

// Setup //
// ...

// Markup // ?>
<div class="fixed inset-0 z-0 h-screen w-screen overflow-hidden">

  <?php
  // Background video //
  ////////////////////// ?>

  <video
      class="absolute inset-0 z-0 h-full w-full object-contain object-bottom"
      src="<?= url('app/assets/videos/bg-typo-anim.mp4') ?>"
      autoplay
      muted
      loop
      playsinline
      preload="auto"></video>

</div>