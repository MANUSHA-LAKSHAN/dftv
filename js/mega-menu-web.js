(function ($, Drupal) {
    "use strict";
  Drupal.behaviors.mega_menu_web = {
    attach: function (context, settings) {
    $(document).click(function (event) {
        if (!$(event.target).is('.mega-menu-web *')) {
            $('.mega-menu-web').collapse('hide');
        }
    });
    }
  }
})(jQuery, Drupal);