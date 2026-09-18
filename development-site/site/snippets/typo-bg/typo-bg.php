<?php

// Imports //
// use PROJECT\Utils as Utils;

// Setup //
$wordA = 'Expanded';
$wordB = 'Horizons'; 

// Markup // ?>
<div 
  g-component="TypoBg" 
  class      ="fixed inset-0 z-0 h-screen w-screen pb-4 overflow-hidden">

  <?php
  // Background video //
  ////////////////////// ?>

  <video
      g-ref="video"
      class="absolute left-0 bottom-4 z-0 h-full w-full object-contain object-bottom"
      src="<?= url('app/assets/videos/bg-typo-anim.mp4') ?>"
      autoplay
      muted
      loop
      playsinline
      webkit-playsinline="true"
      preload="auto"></video>

</div>
