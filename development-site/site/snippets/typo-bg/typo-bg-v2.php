<?php

// Imports //
// use PROJECT\Utils as Utils;

// Setup //
$wordA = 'Expanded';
$wordB = 'Horizons'; 

// Markup // ?>
<div 
  g-component="TypoBg_v2" 
  class      ="
    fixed inset-0 z-0 
    h-screen w-screen px-4 overflow-hidden
    flex flex-col justify-end items-start">

  <?php
  // Interactive typo //
  //////////////////////// ?>

  <div class="
    w-full flex flex-col 
    font-gravity text-[27.5vw] leading-[0.75]
    translate-y-[2%]">

    <div class="flex">
      <?php 
      foreach (str_split($wordA) as $letter): ?>
        <span
            g-ref="letters"
            class="[font-variation-settings:var(--var)] will-change-[font-variation-settings] transform-gpu"
            style="--var: 'slnt' 0, 'wdth' 50, 'wght' 1000;"><?= esc($letter) ?>
        </span> <?php
      endforeach ?>
    </div>

    <div class="flex">
      <?php 
      foreach (str_split($wordB) as $letter): ?>
        <span
            g-ref="letters"
            class="[font-variation-settings:var(--var)] will-change-[font-variation-settings] transform-gpu"
            style="--var: 'slnt' 0, 'wdth' 50, 'wght' 1000;"><?= esc($letter) ?>
        </span> <?php
      endforeach ?>
    </div>

  </div>

</div>
