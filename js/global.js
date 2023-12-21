/**
 * @file
 * Global utilities.
 *
 */
(function ($, Drupal) {

  'use strict';

  Drupal.behaviors.bootstrap_barrio_subtheme = {
    attach: function (context, settings) {
      var subNavItems = $('ul.sub-nav li');
      var mobileNavItems = $('ul.mobile-main-nav li');
      var mobileNavSecondary = $('ul.mobile-secondary-nav.level-1 li')
      $("#lang-selector").click(function () {
        $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
        $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
      });
      $('.floating-placeholder .form-control').focus(function () {
        $(this).parent().addClass('float');
        let placeholder = $(this).attr("placeholder");
        if(placeholder != ""){
          $(this).attr("data-placeholder", placeholder);
          $(this).attr("placeholder", "");
        }

      });
      $('.floating-placeholder .form-control').focusout(function () {
        var input = $(this).val();
        if (!input) $(this).parent().removeClass('float');$(this).attr("placeholder", $(this).attr("data-placeholder"));
      });
      function initTricks() {
        var labels = $('.floating-placeholder label');
        labels.each(function (i) {
          var ph = $(labels[i])
            .siblings('.form-control')
            .first()
            .attr('placeholder');
          $(labels[i]).html(ph);
        });
      }
      initTricks();
      $('.selectpicker').change(function(){
        $(this).parent().parent().find('.selectpicker-placeholder').addClass("float");
      });

      // vertical stepper navigation - future can be remove according to id eg-#next-step
      $('.next-step').click(function(){
        $(this).parent().parent().removeClass('expanded').addClass('step-done-ui');
        $(this).parent().parent().next().addClass('expanded');
      });

      // accordion common framework start

      var accordion_icon_1 = "fa-chevron-down";
      var accordion_icon_2 = "fa-chevron-up";

      $('.rj-accordion-icon .fas').addClass(accordion_icon_1);

      $('.rj-accordion .rj-accordion-header').on('click', function(event){
          event.preventDefault();
          event.stopImmediatePropagation();
          event.stopPropagation();
          $(this).next('.rj-accordion-body').toggleClass('chk-state');
          $(this).next('.rj-accordion-body').slideToggle(300);
          $(this).find('.rj-accordion-icon .fas').toggleClass(accordion_icon_2 , accordion_icon_1);
          // $(this).parent().next('.rj-accordion-container').toggleClass('border-top');
          $('.rj-accordion .rj-accordion-header').not(this).parent().next('.rj-accordion-container').addClass('border-top');
          $('.rj-accordion .rj-accordion-header').not(this).next('.rj-accordion-body').slideUp(100);
          $('.rj-accordion .rj-accordion-header').not(this).find('.rj-accordion-icon .fas').removeClass(accordion_icon_2).addClass(accordion_icon_1);
      });
      // end

      // stepper common framework start

      $(".md-stepper-content .content").not($(".md-stepper-content .content").first()).hide();
      $(".md-stepper-horizontal .md-step").click(function (e) {
        $(".md-stepper-content .content").hide();
        $(".md-stepper-horizontal .md-step").removeClass("active")
        $(this).addClass("active")
        $($(this).attr('data-target')).show()
      })

      // end

      // nav tabs with slick slider issue fixes start

      $(".mobile-view .nav-link").on("click", function(){
          $(".mobile-view .nav-link").not(this).removeClass('active');
          setTimeout(function(){
              $(this).addClass('active');
          }, 500);
      });

      // end

      // button checkbox component start

      $('.checkbox-buttons .btn').on('click', function(){
          $(this).toggleClass('chk-btn-selected');
          $('.checkbox-buttons .btn').not(this).removeClass('chk-btn-selected');
      });

      // end

      if (subNavItems.hasClass('menu-item--expanded')) {
        //$('ul.sub-nav li.level0.not-active-trail').hide();
        $('ul.sub-nav li.level0.menu-item--expanded.in-active-trail').removeClass('d-none');
        $('ul.sub-nav li.level0.menu-item--expanded.in-active-trail a').removeClass('d-none');
      } else {
        $('ul.sub-nav li').removeClass('d-none');
        $('ul.sub-nav li a').removeClass('d-none');
      }
      if(mobileNavItems.hasClass('menu-item--expanded')){
        $('ul.mobile-secondary-nav li.level1').removeClass('d-none')
        $('ul.mobile-secondary-nav li.level1 a').removeClass('d-none')
      }else {
        $('ul.mobile-main-nav li').removeClass('d-none')
        $('ul.mobile-main-nav li a').removeClass('d-none')
      }
      if(mobileNavSecondary.hasClass('menu-item--expanded')){
        $('ul.mobile-secondary-nav.level-2 li.level2').removeClass('d-none')
        $('ul.mobile-secondary-nav.level-2 li.level2 a').removeClass('d-none')
        $('ul.mobile-secondary-nav.level-1 li.level1.not-active-trail').addClass('d-none')
        $('ul.mobile-secondary-nav.level-1 li.level1.not-active-trail a').addClass('d-none')
        // $('ul.mobile-main-nav li.level0').addClass('d-none');
        $('ul.mobile-main-nav li.level0 a.level0').addClass('d-none');
      }else {
        $('ul.mobile-main-nav.level-2 li').removeClass('d-none')
        $('ul.mobile-main-nav.level-2 li a').removeClass('d-none')
      }
    }
  };

  Drupal.behaviors.spinner = {
    loading: function (val) {
      switch (val) {
        case 'start':
          $('#modal-spinner').modal('show');
          break;
        case 'stop':
          $('#modal-spinner').modal('hide');
          break;
        default:
          setTimeout(function () {
            $('#modal-spinner').modal('hide');
          }, 1000);
          $('#modal-spinner').modal('show');
          break;
      }

    }

  }

  document.addEventListener("DOMContentLoaded", () => {
    // #modal-spinner code will comment temporary
      // $('#modal-spinner').modal('show');
    // #modal-spinner code will comment temporary
    if (new URL(window.location.href).searchParams.get("embed") == "true") {
      $(".site-main-header").hide();
      $(".footer").hide();
    }
    
    setTimeout(function () {
      let myAccountDropdown = document.getElementById('my-account-dropdown');
      if (document.getElementById('my-account-dropdown') == null) {
        document.getElementsByClassName('logout_mob_submenu')[0].remove();
      } 
    }, 1000);
    
    
  });

  window.onload = function() {
    setTimeout(function () {
      $('#modal-spinner').modal('hide');
    }, 1000);
    }

  $('#connection-type').on('change', function () {
      $("#" + this.value).trigger('click');
  });

  Drupal.behaviors.dialog_global = {
    error_page: function (sameWin,response=null,screenType=null){
      if(response !== null && parseInt(response.code) === 500){
        _navigate(sameWin);
      }
      if(response === null) _navigate(sameWin);

      function _navigate(sameWin) {
        let url;
        switch (screenType) {
          case 'activatesim':
            url = '/activatesim/error';
            break;
          case 'common':
            url = '/common-error'
            break;
          default:
            url = '/common-error'
            break;
        }
        if(sameWin){
          window.open(url,'_self')
        }else{
          window.open(url)
        }
      }
    }
  }
  $("#connection-number").keyup(function () {
    if(this.value.length >= 10){
      document.getElementById("quick-btn").classList.remove("disabled");
    }else{
      document.getElementById("quick-btn").classList.add("disabled");
    }
  });

  Drupal.behaviors.global_validations = {
    validateEmail: function(value){
      let printableChars  = /[`!#$%'^&|/*_={}.+?-]/g;
      let specialChars    = /["(),:\\;[\]<>@]/;

      let firstChar   = value.substring(0, 1);
      let lastChar    = value.substring(value.length - 1);

      // Check for spaces
      if(value.indexOf(' ') >= 0)
        return false;

      if(!value.includes("@"))
        return false;

      if((printableChars.test(firstChar)) || (printableChars.test(lastChar)))
        return false;

      let mailSplit = value.split("@");
      if(mailSplit.length > 2)
        return false;

      if(mailSplit[0].length === 0)
        return false;

      let localPart = mailSplit[0];
      if(specialChars.test(localPart))
        return false;

      for(let i = 0; i < value.length; i ++) {
        let numberOfRepeats = 0;
        if((printableChars.test(value.charAt(i))) && (/[^0-9]+/.test(value.charAt(i)))){
          numberOfRepeats = this.checkForRepeat(i, value, value.charAt(i));
          if(numberOfRepeats >= 2){
            return false;
          }
        }
      }

      let subDomainRegex  = /[^a-zA-Z0-9-]+/;
      let subDomain       = mailSplit[1].split(".");
      if(!mailSplit[1].includes("."))
        return false;

      if(subDomain.length > 2)
        return false;
      
      if(subDomain[0].length === 0)
        return false;

      if(subDomainRegex.test(subDomain[0]))
        return false;

      let topDomainRegex  = /[^a-zA-Z]+/;
      if(topDomainRegex.test(subDomain[1]))
        return false;

      return true;
    },

    checkForRepeat: function(startIndex, originalString, charToCheck) {
      let repeatCount = 1;
      for(var i = startIndex + 1; i < originalString.length; i ++) {
          
        if(
          originalString.charAt(i) == charToCheck || 
          /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g.test(originalString.charAt(i))
        ) {
          repeatCount++;
        } else {
          return repeatCount;
        }   
      }
      return repeatCount;
    },

    validateNameFields: function(value) {
      let regex = /[~`!@#$%^"&()|/*_={}[\]:;,.<>+\\/?0-9]/;
      return regex.test(value);
    }
  }

  if(jQuery(".main-carousel-bottom-quick-links .right-qick-links-section .card-box").length){
    jQuery(".main-carousel-bottom-quick-links .card-box").each(function(i, e){
      jQuery(".icon-image-container svg", e).attr("role", "img");
      var link_text = jQuery(".link-sub-title p", e).html();
      jQuery(".icon-image-container svg title", e).html(link_text);
    });
  }

  // pagination component
  var elipsis = document.querySelectorAll("span.dots");
  for (let i = 0; i < elipsis.length; i++) {
    var element = elipsis[i].parentElement;
    console.log(element);
    let prevSibling = element.previousElementSibling;
    let nextSibling = element.nextElementSibling;

    let firstNum = prevSibling.querySelector('a').getAttribute('title')
    if (firstNum == '') {
      firstNum = prevSibling.querySelector('a').textContent
    }

    let secondNum = nextSibling.querySelector('a').getAttribute('title')
    if (secondNum == '') {
      secondNum = nextSibling.querySelector('a').textContent
    }
  
    let diff = parseInt(secondNum) - parseInt(firstNum)
    if (diff == 1) {
      elipsis[i].parentElement.style.display = "none"
    }

    let lastArrow = nextSibling.nextElementSibling.querySelector('a')
    if (lastArrow != null && lastArrow.getAttribute('rel') == 'next') {
      elipsis[i].parentElement.style.display = "none";
      nextSibling.style.display = "none";
    }
  }

  // activations flow first loding 
  window.onload = function() {
    setTimeout(function () {
     $('.selfcare-loading').fadeOut("1000");
    }, 1000);
  }
  // end

  // Packages More Modal ScrollBar
  $('#packages-more-modal-1').on('shown.bs.modal', function (e) {
    $(".sb-container").scrollBox();
  });
  // Packages More Modal ScrollBar
  $('#packages-more-modal-2').on('shown.bs.modal', function (e) {
    $(".sb-container").scrollBox();
  });

  // Common Card Active
  $(".common-card-active .card").click(function() {
    $(".common-card-active .card").removeClass("active-card");
    $(this).addClass("active-card");
    });
    // Common Card Active


    // Packages Details Show and Hide
    $(document).on('click', ".packages-cards .card", function () {
       const elements = document.querySelectorAll('.active-card'); 
       elements.forEach(element => {
          let scrollbar = element.querySelector(".card-details");
          if (scrollbar) {
            scrollbar.style.display = 'none';
          }   
          // element.classList.remove('active-card');
       });
       const popelements = document.querySelectorAll('.sb-content .active-card'); 
       popelements.forEach(element => { 
          element.classList.remove('active-card');
       });
        $(this).addClass("active-card");
        $(".card-details", this).show(300, "swing");
        $(this).siblings().removeClass("active-card");
        $(".card-details", jQuery(this).siblings()).hide(300, "swing");
        $(".card").removeClass("disabled");
      
        $(".card").find(".pcard").removeClass("pcardprice");
        $(".active-card").find(".pcard").addClass("pcardprice");
      
        $(".card").find(".pcardID").removeClass("pcardselectID");
        $(".active-card").find(".pcardID").addClass("pcardselectID");
      
        $(".card").find(".pcardmore").removeClass("pcardid");
        $(".active-card").find(".pcardmore").addClass("pcardid");
      
        $(".card").find(".pcardvmore").removeClass("pcardvid");
        $(".active-card").find(".pcardvmore").addClass("pcardvid");
        
        var element_add_1 = document.getElementById('package-update-button-1');
        element_add_1.classList.remove("disabled");
        element_add_1.disabled = false;

        var element_add_2 = document.getElementById('package-update-button-2');
        element_add_2.classList.remove("disabled");
        element_add_2.disabled = false;
        
    });
    // Packages Details Show and Hide


  // Mobile search holder start
  
    $(".footer-btn-search").click(function () {
      $(".mobile-search-overlay").addClass("mobile-search-holder");
    });
    $(".mobile-closebtn").click(function () {
      $(".mobile-search-overlay").removeClass("mobile-search-holder");
    });

  // End

  //  Search page tab active

    if (jQuery('.node--view-mode-index-article-search').length > 0)
    jQuery('#content-search-id').addClass('search-active');

    if (jQuery('.node--view-mode-teaser').length > 0)
      jQuery('#support-search-id').addClass('search-active');

  // End

  var active = $('#search-solr-pagination ul li.active');
  $('#search-solr-pagination ul li').not(active)
    .not(active.prevAll().
      slice(0, 2))
    .not(active.nextAll()
      .slice(0, 2))
    .hide();
  $('#search-solr-pagination .pager__item--next').css('display', 'block');
  $('#search-solr-pagination ul > li:nth-child(2)').css('display', 'block'); 

  if ($('.no-results-found').hasClass('no-solr-result')) {
    $('#search-custom-form').css('display', 'none');  
  }

  $(document).ready(function() {
    var ellipsis = "...";
    var maxLength = 60;
    $('.ellipsis').each(function() {
      var text = $(this).text();
      if (text.length > maxLength) {
        $(this).text(text.substr(0, maxLength - ellipsis.length) + ellipsis);
      }
    });
  });

})(jQuery, Drupal);
