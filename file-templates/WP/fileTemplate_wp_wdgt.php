<?php
/**
* Widget: Barebone widget
*/

// Namespace //
namespace Barebone\Widgets;

// Imports //
use Elementor\Widget_Base;
use Elementor\Controls_Manager;
use Elementor\Repeater as Rptr;
use BaseUtils;
use Barebone\Utils;

use function BaseUtils\add_wdgtControl_sectionStart as add_ctrl_sectionStart;
use function BaseUtils\add_wdgtCtrl_tabStart        as add_ctrl_tabStart;
use function BaseUtils\add_wdgtControl_text         as add_ctrl_text;
use function BaseUtils\add_wdgtControl_media        as add_ctrl_media;
use function BaseUtils\add_wdgtControl_gallery      as add_ctrl_gallery;
use function BaseUtils\add_wdgtControl_select       as add_ctrl_select;
use function BaseUtils\add_wdgtControl_switcher     as add_ctrl_switcher;
use function BaseUtils\add_wdgtControl_color        as add_ctrl_color;
use function BaseUtils\add_wdgtCtrl_ctas            as add_ctrl_ctas;
use function BaseUtils\add_wdgtControl_repeater     as add_ctrl_rptr;

use function BaseUtils\add_repeaterControl_text     as add_rptrCtrl_text;
use function BaseUtils\add_rptrCtrl_url             as add_rptrCtrl_url;
use function BaseUtils\add_repeaterControl_number   as add_rptrCtrl_num;
use function BaseUtils\add_repeaterControl_media    as add_rptrCtrl_media;
use function BaseUtils\add_repeaterControl_media    as add_rptrCtrl_gallery;
use function BaseUtils\add_repeaterControl_select   as add_rptrCtrl_select;
use function BaseUtils\add_repeaterControl_switcher as add_rptrCtrl_switcher;
use function BaseUtils\add_repeaterControl_tabStart as add_rptrCtrl_tabStart;

require_once __DIR__ . '/render-some-widget.php';

// Widget class //
class Barebone_Some_Widget extends Widget_Base {

  ////// Properties //////
  ////////////////////////

  protected $textDomain;

  ///// Constructor //////
  ////////////////////////

  public function __construct($data = [], $args = null) {
    parent::__construct($data, $args);
    $this->textDomain = 'barebone-widgets';
  }

  /////// Methods ////////
  ////////////////////////

  public function get_name() {
    return 'some-widget';
  }

  public function get_title() {
    return __('Some Widget', $this->textDomain);
  }

  public function get_icon() {
    return 'eicon-some-icon';
  }

  public function get_categories() {
    return ['barebone'];
  }

  public function get_text_domain() {
    return $this->textDomain;
  }

  // NOT NEEDED ATM //
  // public function get_style_depends() {
  //   return ['wdm-css'];
  // }
  // public function get_script_depends() {
  //   return ['flickity'];
  // }

  /////// Controls ///////
  ////////////////////////

  public function register_controls() {
    $txtDom = $this->get_text_domain();

    //// Content /////
    //////////////////

    add_ctrl_sectionStart($this, 'content', __('Content', $txtDom));
      $this->start_controls_tabs('content_tabs');

        // Tab: Foo //
        add_ctrl_tabStart($this, ['id' => 'tab_content_foo', 'label' => __('Foo', $txtDom)]);
          add_ctrl_text($this, ['id' => 'foo']);
        $this->end_controls_tab();

      $this->end_controls_tabs();
    $this->end_controls_section();

    //// Config. /////
    //////////////////

    // add_ctrl_sectionStart($this, 'config', 'Settings');
      // BaseUtils\add_wdgtControl_spacing($this);
      // // BaseUtils\add_wdgtControl_divider($this, 0);
    // $this->end_controls_section();

    ///// Colors /////
    //////////////////

    // add_ctrl_sectionStart($this, 'colors', 'Colors');
      // add_ctrl_color($this, ['id' => 'color_text', 'label' => 'Text color', 'def' => '#000000']);
    // $this->end_controls_section();
  }

  //// Render methods ////
  ////////////////////////

  protected function render() {
    // if (\Elementor\Plugin::$instance->editor->is_edit_mode()) return; // ← prevent render. of frontend markup in editor view
    render_some_widget($this);
  }

  // TO DO: add content template for WYSIWYG block editing //
  // protected function content_template() {
  // <section class="tw:font-rubik tw:text-black tw:bg-gray-200">
  //   <div class="tw:flex tw:justify-center tw:items-center tw:border-2 tw:border-gray-400"
  //         style="width: 100%; height: 475px;">
  //     <span class="tw:font-bold tw:text-gray-700">WIDGET NAME HERE</span>
  //   </div>
  // </section>
  // }
}
