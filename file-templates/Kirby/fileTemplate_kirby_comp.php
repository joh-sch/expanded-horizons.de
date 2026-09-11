<?php

////// Doc. //////
//////////////////

/**
* ...
*/

//// Imports /////
//////////////////

// use Kirby\Cms\Content;

///// Setup //////
//////////////////

// Guard //
// if(!isset($block)) { echo 'NewComponent.missingData:$block'; return; }

$optionsToRender = [];

///// Markup /////
////////////////// ?>

<div
    g-component="NewComponent"
    g-options  ='<?= json_encode($optionsToRender) ?>'
    class      ="group/NewComponent">

  NewComponent

</div>

<?php

// Outside refs. //
///////////////////

// snippet('NewComponent/someRef', ['componentID' => $ID]); ?>