<?php
/**
* Widget render: Some Widget
*/

// Namespace //
namespace Barebone\Widgets;

// Guard //
if (!defined('ABSPATH')) exit;

// Imports //
use function BaseUtils\get_wdgtContentFieldValue as get_val;

function render_some_widget(object $wdgt): void {
  ///// Setup //////
  //////////////////

  $data = $wdgt->get_settings_for_display();

  // Snippet args. //
  // ...

  ///// Markup /////
  ////////////////// ?>

  <div class="barebone-some-widget">
    <?php // TODO: implement render ?>
  </div> <?php

}
