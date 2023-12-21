(function ($, Drupal) {
  // Check if sim conversion before running any scripts
  if ($('.js-convert-sim-page').length > 0) {

    // Main
    var SESSION_ID = "";
    var ID_NUMBER = "";
    var PASSPORT_NUMBER = "";
    var REFFERENCE_NO = "";
    var SELECTED_PROFILE = "";

    // OTP
    var otpValue = '';
    var timeout;
    var otp_countdown_timer = 0;
    var otp_resend_trigger_time;
    var timer = null;
    var downloadTimer;

    $('input[name="radio-stacked"]').on('click', function () {
      if ($(this).val() == '1') {
        $('input[name="radio-stacked"]').removeClass('checked');
        $(this).addClass('checked');
        $('#id_input').removeClass('d-none');
        $('#passport_input').addClass('d-none');
        clearInputErrors()
      }
      else if ($(this).val() == '2') {
        $('input[name="radio-stacked"]').removeClass('checked');
        $(this).addClass('checked');
        $('#id_input').addClass('d-none');
        $('#passport_input').removeClass('d-none');
        clearInputErrors()
      }
    });

    function clearInputErrors(){
      $('#id_required_error').removeClass('d-none')
      $('#id_required_error').addClass('required_error')
      $('#passport_required_error').removeClass('d-none')
      $('#passport_required_error').addClass('required_error')
      $('#device_required_error').removeClass('d-none')
      $('#device_required_error').addClass('required_error')
      $('#device_invalid_error').addClass('d-none');
      $('#esim_device_search').css('border', '1px solid #c4c4c4')
      $('#sim-conversion-passport-no').css('border', '1px solid #c4c4c4')
      $('#sim-conversion-id-no').css('border', '1px solid #c4c4c4')
      $('#esim_device_search').val("");
      $('#sim-conversion-id-no').val("");
      $('#sim-conversion-passport-no').val("");
      $('#toggle-button').html(null);
      $('#content-2').addClass('d-none');
      $('#id_continue').removeClass('d-none');
      $(".floating-placeholder").removeClass('float');
    }
   
    // Load device list from taxonomy: convert_sim_devices
    $.ajax({
      url: '/data/sim-conversion-devices',
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        if(data.length > 0 ) {
          var select_list = "";

          for (var i = 0; i <= data.length - 1; i++) {
            select_list += '<option value="'+data[i].tid+'">'+data[i].name+'</option>';
          }

          $('#sim-conversion-device-list').html(select_list);
          $('#sim-conversion-device-list').selectpicker();
        }
      },
    });

    // Device Autocomplete
    var deviceComplete = $('.advancedAutoComplete#esim_device_search');

    deviceComplete.autoComplete({
      resolver: 'custom',
      minLength: 2,
      events: {
        search: function(qry, callback) {
          $.ajax(
            '/data/sim-conversion-devices?query=' + qry,
          ).done(function(res) {
            res = res.filter(value => value.name.toLowerCase().includes(qry.toLowerCase()))
            // $("#check-postCode-hbb").val(res[0].code);
            callback($.map(res.slice(0, 6), function(value, key) {
              return {
                text: value.name,
                value: value.tid,
                data: value
              }
            }))
          });
        },
      },
      noResultsText: "No matching data",
    });

// Device Validation 
    
    deviceComplete.on('input', function(evt, item) {
      $(this).val($(this).val().replace(/[^a-z0-9\s]/gi, ''));
      deviceComplete.attr('validDeviceSelected', '');
    });

    deviceComplete.on('autocomplete.select', function(evt, item) {
      deviceComplete.attr('validDeviceSelected', 'true');
      $('#device_required_error').removeClass('d-none');
      $('#device_required_error').addClass('required_error')
      $('#device_invalid_error').addClass('d-none');
      $('#esim_device_search').css('border', '1px solid #c4c4c4')
    });

    
    deviceComplete.on('focusout', function() {

      if (deviceComplete.val() == '') {
        $('#device_required_error').removeClass('d-none')
        $('#device_invalid_error').addClass('d-none');
        $('#device_required_error').removeClass('required_error')
        $('#esim_device_search').css('border','1px solid #ef005a')
        return;
      }
      // Check if user has selected a value from the dropdown
      if (deviceComplete.attr('validDeviceSelected') != 'true') {
      $('#device_required_error').addClass('d-none')  
      $('#device_invalid_error').removeClass('d-none');
      $('#id_continue').removeClass('d-none'); 
      } else {
        $('#esim_device_search').css('border','1px solid #c4c4c4') 
      }
      });

    deviceComplete.on('focusin', function () {
      $('#device_required_error').removeClass('d-none')
      $('#device_required_error').addClass('required_error')
      $('#device_invalid_error').addClass('d-none');
      $('#esim_device_search').css('border', '1px solid #ef005a');
      $('#content-2').addClass('d-none');
      $('#id_continue').removeClass('d-none');
      $('#toggle-button').html(null);
    });

     // ID Validation

    $('#sim-conversion-id-no').on('focusin', function () {
      $('#id_required_error').removeClass('d-none')
      $('#id_required_error').addClass('required_error')
      $('#id_invalid_error').addClass('d-none');
      $('#content-2').addClass('d-none');
      $('#id_continue').removeClass('d-none');
      toggleError(false, $('#id_invalid_error'))

      $('.append-box').removeClass('active');
      $('#ex-customer-error').addClass('d-none');
      $('#esim-mobile-number').css('border','1px solid #c4c4c4')
      $('#toggle-button').html(null);
    });

      $('#sim-conversion-passport-no').on('focusin', function () {
      $('#passport_required_error').removeClass('d-none')
      $('#passport_required_error').addClass('required_error')
      $('#passport_invalid_error').addClass('d-none');
      $('#content-2').addClass('d-none');
      $('#id_continue').removeClass('d-none');
      toggleError(false, $('#passport_invalid_error'))

      $('.append-box').removeClass('active');
      $('#ex-customer-error').addClass('d-none');
      $('#esim-mobile-number').css('border','1px solid #c4c4c4')
      $('#toggle-button').html(null);
    });

    $(document).on('focusout', '#sim-conversion-id-no', () => {
      var nic = $('#sim-conversion-id-no');
      var nicRegex = new RegExp("^([0-9]{9}[x|X|v|V]|[0-9]{12})$")
      nic.val(nic.val().replace(/[^a-z0-9]/gi, ''));
      var value = nic.val();

    if (value == "") {
        $('#sim-conversion-id-no').css('border', '1px solid #ef005a')
        $('#id_required_error').removeClass('required_error')
        $('#id_invalid_error').addClass('d-none');
    }else if (nicRegex.test(value)) {
        ID_NUMBER = nic;
        $('#sim-conversion-id-no').css('border', '1px solid #c4c4c4')
        $('#id_required_error').addClass('required_error')
    } else {
        $('#sim-conversion-id-no').css('border', '1px solid #ef005a')
        $('#id_required_error').addClass('d-none');
        $('#id_invalid_error').removeClass('d-none');
    }
      // var isnumletters = /[^0-9a-zA-Z]+/.test(nic)
      // var value = $('#sim-conversion-id-no').val();
    
      // if (nic == "") {
      //   $('#sim-conversion-id-no').css('border', '1px solid #ef005a')
      //   $('#id_required_error').removeClass('required_error')
      //   $('#id_invalid_error').addClass('d-none');
      // }
      // else if (isnumletters == false) {
      //   ID_NUMBER = nic;
      //   $('#sim-conversion-id-no').css('border', '1px solid #c4c4c4')
      //   $('#id_required_error').addClass('required_error')
      // }
      // else if(isnumletters==true){
      //   $('#sim-conversion-id-no').css('border', '1px solid #ef005a')       
      //   nic = nic.replace(/[^0-9a-zA-Z]+/g, "");
      //   var nic = $('#sim-conversion-id-no').val(nic)
      //   $('#id_required_error').addClass('required_error')
      //   $('#sim-conversion-id-no').css('border','1px solid #c4c4c4')
      // }
      
  });
   
// Passport Validation
    
$(document).on('focusout', '#sim-conversion-passport-no', () => {
  var passport = $('#sim-conversion-passport-no').val();
  var isnumletters = /[^0-9a-zA-Z]+/.test(passport)
  var value = $('#sim-conversion-passport-no').val();

  if (passport == "") {
    $('#sim-conversion-passport-no').css('border', '1px solid #ef005a')
    $('#passport_required_error').removeClass('required_error')
    $('#passport_invalid_error').addClass('d-none');
  }
  else if (isnumletters == false) {
    PASSPORT_NUMBER = passport;
    $('#sim-conversion-passport-no').css('border', '1px solid #c4c4c4')
    $('#passport_required_error').addClass('required_error')
  }
  else if(isnumletters==true){
    $('#sim-conversion-passport-no').css('border', '1px solid #ef005a')       
    passport = passport.replace(/[^0-9a-zA-Z]+/g, "");
    var passport = $('#sim-conversion-passport-no').val(passport)
    $('#passport_required_error').addClass('required_error')
    $('#sim-conversion-passport-no').css('border','1px solid #c4c4c4')
  }
  
});
    
    
    // Continue button handler
    $('#id_continue').on('click', function(){
      
      $(this).addClass('d-none');

      var id_type =$('.checked').val()

      if (id_type == 1) {
        // Nic Validate
        var form_errors = {};

        var nic = $('#sim-conversion-id-no');
        var nicRegex = new RegExp("^([0-9]{9}[x|X|v|V]|[0-9]{12})$")
        nic.val(nic.val().replace(/[^a-z0-9]/gi, ''));
        var value = nic.val();
        alert(value)
      if (value == "") {
          $('#sim-conversion-id-no').css('border', '1px solid #ef005a')
          $('#id_required_error').removeClass('required_error')
          $('#id_invalid_error').addClass('d-none');
          form_errors.nic = true
          $('#id_continue').removeClass('d-none');
      }else if (nicRegex.test(value)) {
        ID_NUMBER = value;
       // alert(ID_NUMBER)
          $('#sim-conversion-id-no').css('border', '1px solid #c4c4c4')
          $('#id_required_error').addClass('required_error')
          form_errors.nic = false
          $('#id_continue').removeClass('d-none');
      } else {
          $('#sim-conversion-id-no').css('border', '1px solid #ef005a')
          $('#id_required_error').addClass('d-none');
          $('#id_invalid_error').removeClass('d-none');
          form_errors.nic = true
          $('#id_continue').removeClass('d-none');
      }

        var post_data = {
          "id_number": ID_NUMBER,
          "id_type":"NIC",
          "selected_device": deviceComplete.val(),
          "selected_device_tid": $("#sim-conversion-device-list").val()
        };

      }
  
      else if (id_type == 2) {
        var form_errors = {};
        var passport = $('#sim-conversion-passport-no').val();
        var isnumletters = /[^0-9a-zA-Z]+/.test(passport)
        var value = $('#sim-conversion-passport-no').val();
      
        if (passport == "") {
          $('#sim-conversion-passport-no').css('border', '1px solid #ef005a')
          $('#passport_required_error').removeClass('required_error')
          $('#passport_invalid_error').addClass('d-none');
          form_errors.passport = true
          $('#id_continue').removeClass('d-none');
        }
        else if (isnumletters == false) {
          PASSPORT_NUMBER = passport;
          $('#sim-conversion-passport-no').css('border', '1px solid #c4c4c4')
          $('#passport_required_error').addClass('required_error')
          form_errors.passport = false
          $('#id_continue').removeClass('d-none');
        }
        else if(isnumletters==true){
          $('#sim-conversion-passport-no').css('border', '1px solid #ef005a')       
          passport = passport.replace(/[^0-9a-zA-Z]+/g, "");
          var passport = $('#sim-conversion-passport-no').val(passport)
          $('#passport_required_error').addClass('required_error')
          $('#sim-conversion-passport-no').css('border', '1px solid #c4c4c4')
          form_errors.passport = false
          $('#id_continue').removeClass('d-none');
        }
        
        var post_data = {
          "id_number": PASSPORT_NUMBER,
          "id_type":"PP",
          "selected_device": deviceComplete.val(),
          "selected_device_tid": $("#sim-conversion-device-list").val()
        };
      }
      
      // Device Validate
      if (deviceComplete.val() == '') {
        $('#device_required_error').removeClass('d-none')
        $('#device_invalid_error').addClass('d-none');
        $('#device_required_error').removeClass('required_error')
        $('#esim_device_search').css('border','1px solid #ef005a')
        $('#id_continue').removeClass('d-none');
        form_errors.device = true
      } else if (deviceComplete.attr('validDeviceSelected') != 'true') {
        $('#device_required_error').addClass('d-none')  
        $('#device_invalid_error').removeClass('d-none');
        form_errors.device = true
        $('#id_continue').removeClass('d-none'); 
      } else {
        form_errors.device = false
        $('#esim_device_search').css('border','1px solid #c4c4c4')
        $('#id_continue').removeClass('d-none'); 
      }

        // Check for error and dont submit form
      if (Object.values(form_errors).indexOf(true) > -1) {
        return false;
      }
      
      $('#id_continue').addClass('d-none'); 
      loading(true);
      

      $.ajax({
        url: '/data/esim/step1-data',
        type: 'POST',
        data: post_data,
        dataType: 'json', 
        success: function (res) {

          if(res.success == false) {
            $('#id_error').text(res.message)
            loading(false);
            $('#id_continue').removeClass('d-none'); 
          }
          SESSION_ID = res.data.session_id;

          if (res.data.contact_numbers && res.data.contact_numbers.length > 0) {
            loading(true);
            $('#toggle-button').append(`<input class="form-control bg-transparent append-box" id="use_diff_number_label" placeholder="Use a different number" readonly="readonly" type="text">`);
            load_contact_numbers(res.data.contact_numbers); 
            loading(false);
            $('#content-2').removeClass('d-none');
            $('#id_continue').addClass('d-none');
            $('#sim-conversion-id-no').css('border','1px solid #c4c4c4')
          } else {
            loading(false);
            $('#error-modal').modal('show');
            $('#error-msg').text('');
            $('#id_continue').removeClass('d-none'); 
          }
        },
        error: function(res) {
          loading(false);
          $('#error-modal').modal('show');
          $('#error-msg').text('');
          $('#id_continue').removeClass('d-none'); 
      }
      });
    });

    //send OTP
    $("#verify-button").on('click', function(){
      $(this).addClass('d-none');

      // get selected numbers encrypted value
      var selected_number = $('.append-box.active').attr('data-number');

      SELECTED_PROFILE = $('.append-box.active').attr('profileid');

      var ap_active = $('.append-box.active').length;
      if(ap_active == 0){
      $('#ex-customer-error').removeClass('d-none');
      $('#verify-button').removeClass('d-none');
      return false;  
      }

      if($('.append-box.active').attr('id') == "use_diff_number_label") {
        selected_number = $("#esim-mobile-number").val();

        let mobileNum = selected_number;
        let mobileRegex = new RegExp("^([0][0-9]{9}|[7][0-9]{8})$")
        let value=mobileNum.replace(/[^\d]/g, '');
      
        if (value == "") {
          $('#mobile_number_invalid_error').text('Invalid Mobile Number');
          $('#esim-mobile-number').css('border', '1px solid #ef005a')
          $('#verify-button').removeClass('d-none');
          $('#ex-customer-error').removeClass('d-none');
          return false;
         }
        else if (mobileRegex.test(value)) {
          document.getElementById("mobile_number_invalid_error").innerHTML = "&nbsp;";
           selected_number = value;
          $('#esim-mobile-number').css('border','1px solid #c4c4c4')
        } else {
          $('#mobile_number_invalid_error').text('Invalid Mobile Number');
          $('#esim-mobile-number').css('border', '1px solid #ef005a')
          $('#verify-button').removeClass('d-none');
          $('#ex-customer-error').addClass('d-none');
          return false;
         }

        $('#verify-button').removeClass('d-none');
      }
      $('#verify-button').addClass('d-none'); 
      loading(true);
    
      

      // Send OTP
      var post_data = {
        "number": selected_number,
        "session_id": SESSION_ID,
        "id_number": ID_NUMBER,
      }

      $.ajax({
        url: '/data/esim/send-opt',
        type: 'POST',
        data: post_data,
        dataType: 'json', 
        success: function (res) {
          loading(false);

          if (res.success == false) {
            $('#error-msg').html(res.message);
            $('#error-modal').modal('show');
            $('#verify-button').removeClass('d-none');

          } else {
            $('#verify-button').removeClass('d-none');
            if (res.data.Status == 'Active') {
              REFFERENCE_NO = res.data.referenceNo

              timeout = res.data.timeout;
              otp_countdown_timer = res.data.otp_countdown_timer;
              otp_resend_trigger_time = res.data.otp_resend_trigger_time;

              $("#masked_mobile").text(res.data.masked_contact_number);

              clearInterval(downloadTimer);

              downloadTimer = setInterval(function() {
                if (otp_countdown_timer <= otp_resend_trigger_time) {
                  $('#resend-otp').removeClass('disabled');
                }

                //get time
                let minutes = Math.floor(otp_countdown_timer / 60);
                let seconds = otp_countdown_timer - minutes * 60;
                let displayTime = (minutes < 10 ? "0" + minutes : minutes) + ':' + (seconds < 10 ? "0" + seconds : seconds);
                $("#otp-timer").html(displayTime);

                otp_countdown_timer -= 1;

                if (otp_countdown_timer == -1) {
                  clearInterval(downloadTimer);
                }
              }, 1000);

              $('#otp-1, #otp-2, #otp-3, #otp-4, #otp-5, #otp-6').removeClass('invalid').val(null);
              $('.otp-wrapper').addClass('d-none');
              $('#resend-otp').addClass('disabled');
              $('#otp-modal').modal('show').on('shown.bs.modal', function () {
                  $('#otp-1').focus();
              });;

            } else {
               $('#error-msg').html(res.message);
              $('#error-modal').modal('show');

            }
          }
        },
      });
    });

    $("#sim-conversion-otp-btn").on('click', function(){
      var post_data = {
        "otp": $("#sim-conversion-otp").val(),
        "reference_no": REFFERENCE_NO,
        "session_id": SESSION_ID,
        "id_number": ID_NUMBER,
      }

      // Validate OTP
      $.ajax({
        url: '/data/esim/validate-opt',
        type: 'POST',
        data: post_data,
        dataType: 'json', 
        success: function (res) {
          console.log(res);


        },
      });
    });

    $('#sim-conversion-otp-resend').on('click', function(){
      // get selected numbers encrypted value
      var selected_number = $('.append-box.active').attr('data-number');

      if($('.append-box.active').attr('id') == "use_diff_number_label") {
        selected_number = $("#esim-mobile-number").val();
      }

      var post_data = {
        'number': selected_number,
        'session_id': SESSION_ID,
        'id_number': id_number
      };

      $.ajax({
        url: '/data/esim/resend-opt',
        type: 'POST',
        data: post_data,
        dataType: 'json',
        success: function(res) {
          console.log(res)
        }
      })
    });

    //otp verify
    $(document).on('click', '#esim-verify-otp', function() {

      // prevent double clicking the otp verify
      $('#esim-verify-otp').addClass('disabled');

      let i = 1;
      while (i < 7) {
        otpValue += $(`#otp-${i}`).val();
        i++;
      }

      //filter only numbers
      let isnum = /^\d+$/.test(otpValue);

      if (otpValue == "" || otpValue.length != 6 || isnum == false) {
        $('.otp-box').addClass('invalid');
        $('.otp-wrapper').removeClass('d-none');
        $('#otp-1, #otp-2, #otp-3, #otp-4, #otp-5, #otp-6').val(null);
        $('#esim-verify-otp').removeClass('disabled');
        otpValue = '';

      } else if (otp_countdown_timer == -1) {
        $('#otp-1, #otp-2, #otp-3, #otp-4, #otp-5, #otp-6').val(null);
        $('.otp-box').addClass('invalid');
        $('.otp-wrapper').removeClass('d-none');
        $('#esim-verify-otp').removeClass('disabled');

      } else {

        var post_data = {
          "otp": otpValue,
          "reference_no": REFFERENCE_NO,
          "session_id": SESSION_ID,
          "id_number": ID_NUMBER,
          "selected_profileid": SELECTED_PROFILE,
        }

        $.ajax({
          url: '/data/esim/validate-opt',
          type: 'POST',
          data: post_data,
          dataType: 'json',
            success: function(res) {
            if (res.success == false) {
              $('#otp-e').html(res.message);
              $('#otp-1, #otp-2, #otp-3, #otp-4, #otp-5, #otp-6').val(null);
              $('.otp-box').addClass('invalid');
              $('.otp-wrapper').removeClass('d-none');
              $('#esim-verify-otp').removeClass('disabled');
              otpValue = '';
            } else {
              if (res.data.Status == 'Active') {
                $('#otp-modal').modal('hide');
                sessionStorage.setItem("esimSessionId", SESSION_ID);
                sessionStorage.setItem("esimIdNumber", ID_NUMBER);
                location.href="/esim-email-verification?id="+SESSION_ID

              } else if (res.data.Status == 'Inactive') {
                $('#otp-e').html(res.message);
                $('#otp-1, #otp-2, #otp-3, #otp-4, #otp-5, #otp-6').val(null);
                $('.otp-box').addClass('invalid');
                $('.otp-wrapper').removeClass('d-none');
                $('#esim-verify-otp').removeClass('disabled');
                otpValue = '';

              } else {
                $('#otp-e').html(res.message);
                $('#otp-1, #otp-2, #otp-3, #otp-4, #otp-5, #otp-6').val(null);
                $('.otp-box').addClass('invalid');
                $('.otp-wrapper').removeClass('d-none');
                $('#esim-verify-otp').removeClass('disabled');
                otpValue = '';
              }
            }
          },
          error: function(res) {
              $('#otp-e').html(res.message);
              $('#otp-1, #otp-2, #otp-3, #otp-4, #otp-5, #otp-6').val(null);
              $('.otp-box').addClass('invalid');
              $('.otp-wrapper').removeClass('d-none');
              $('#esim-verify-otp').removeClass('disabled');
              otpValue = '';
          }
        });
      }
    });

    //new user mobile number field focusout
    $(document).on('focusout', '#esim-mobile-number', function() {
        let mobileNum = $(this);
        let mobileRegex = new RegExp("^([0][0-9]{9}|[7][0-9]{8})$")
        mobileValidation(mobileNum, mobileRegex, '#verify-button');
    });
  
   function mobileValidation(mobileNum, mobileRegex, id) {
      mobileNum.val(mobileNum.val().replace(/[^\d]/g, ''));
      let value = mobileNum.val();
     if (value == "") {
      $('#mobile_number_invalid_error').text('Invalid Mobile Number');
        $('#esim-mobile-number').css('border', '1px solid #ef005a')
       }
       else if (mobileRegex.test(value)) {
        document.getElementById("mobile_number_invalid_error").innerHTML = "&nbsp;";
        selected_number = mobileNum.val();
        $('#esim-mobile-number').css('border','1px solid #c4c4c4')
     } else {
        $('#mobile_number_invalid_error').text('Invalid Mobile Number');
         $('#esim-mobile-number').css('border', '1px solid #ef005a')
       }
   }

    //otp resend
    $(document).on('click', '#resend-otp', function() {
      otpValue = '';
      otp_countdown_timer = 0;

      // get selected numbers encrypted value
      var selected_number = $('.append-box.active').attr('data-number');

      if($('.append-box.active').attr('id') == "use_diff_number_label") {
        selected_number = $("#esim-mobile-number").val();
      }
      
      var post_data = {
        'number': selected_number,
        'session_id': SESSION_ID,
        'id_number': ID_NUMBER
      };

      $.ajax({
        url: '/data/esim/resend-opt',
        type: 'POST',
        data: post_data,
        dataType: 'json',
        success: function(res) {
          if (res.success == false) {
            $('#otp-e').html(res.message);
            $('#otp-1, #otp-2, #otp-3, #otp-4, #otp-5, #otp-6').val(null);
            $('.otp-box').addClass('invalid');
            $('.otp-wrapper').removeClass('d-none');
            if (res.code == '10064') {
              setTimeout(function() { $('#resend-otp').addClass('disabled'); }, 500);
            }
        } else {
            REFFERENCE_NO = res.data.referenceNo

            otp_countdown_timer = res.data.otp_countdown_timer;
            otp_resend_trigger_time = res.data.otp_resend_trigger_time;

            clearInterval(downloadTimer);

            downloadTimer = setInterval(function() {
              if (otp_countdown_timer <= otp_resend_trigger_time) {
                $('#resend-otp').removeClass('disabled');
              }

              //get time
              let minutes = Math.floor(otp_countdown_timer / 60);
              let seconds = otp_countdown_timer - minutes * 60;
              let displayTime = (minutes < 10 ? "0" + minutes : minutes) + ':' + (seconds < 10 ? "0" + seconds : seconds);
              $("#otp-timer").html(displayTime);

              otp_countdown_timer -= 1;

              if (otp_countdown_timer == -1) {
                clearInterval(downloadTimer);
              }
            }, 1000);

            $('#otp-1, #otp-2, #otp-3, #otp-4, #otp-5, #otp-6').removeClass('invalid').val(null);
            $('.otp-wrapper').addClass('d-none');
            $('#resend-otp').addClass('disabled');
            $('#otp-modal').modal('show');
          }
        },
        error: function(res) {
          $('#otp-e').html(res.message);
          $('#otp-1, #otp-2, #otp-3, #otp-4, #otp-5, #otp-6').val(null);
          $('.otp-box').addClass('invalid');
          $('.otp-wrapper').removeClass('d-none');
        }
      });
    });

    $(document).on('keyup', '.otp-box', function(e) {
      if (this.value.length === this.maxLength) {
        let next = $(this).data('next');
        $('#otp-' + next).focus();
      }
    }).on('keyup', '.otp-box', function(e) {
      if (e.which === 8 && !this.value) {
        let prev = $(this).data('prev');
        $('#otp-' + prev).focus();
      }
    });


    /*
    * Helper function to show/hide error message
    *   has_error - determines if the error is to be shown or not
    *   error_elem - the error message element
    */
    function toggleError(has_error, error_elem) {
      if(has_error) {
        $(error_elem).removeClass('d-none');
      } else {
        $(error_elem).addClass('d-none');
      }

      return has_error;
    }

    // Show hide loading
    function loading(show_loading) {
      if(show_loading) {
        $('#loading-s-2').removeClass('d-none');
      } else {
        $('#loading-s-2').addClass('d-none');
      }
    }

    // Populate contact number connected to ID number
    function load_contact_numbers(contact_numbers) {
      var field = {};
      $('#number-form').html(null);
      contact_numbers.forEach(function(item, index) {
          field[index] = `<input type="text" class="form-control mb-3 bg-transparent append-box" role="button" data-number=${item.encrypted} value=${item.masked} profileId=${item.profileId} readonly>`
          $("#number-form").append(field[index]);
      });

      $('.append-box').on('click', function () {
        $('#ex-customer-error').addClass('d-none');
        $('.append-box').removeClass('active');
        $(this).addClass('active');

        if ($(this).attr('id') == "use_diff_number_label") {
          $('#ex-customer-error').addClass('d-none');
          $('#mobile-number-field').toggle();
          if ($('#mobile-number-field').is(':visible')) {
            $("#esim-mobile-number").val(null);
            $('#use_diff_number_label').css('border','1px solid #ef005a');
            document.getElementById('esim-mobile-number').focus();
            document.getElementById("mobile_number_invalid_error").innerHTML = "&nbsp;";
        }else{
            $('#use_diff_number_label').css('border','1px solid #c4c4c4');
        }
        }
        else {
            if ($('#mobile-number-field').is(':visible')) {
            $('#mobile-number-field').toggle();
            $('#use_diff_number_label').css('border','1px solid #c4c4c4');
            }
      }
      });

      $(document).on('input', '#esim-mobile-number', function() {
        $(this).val($(this).val().replace(/[^\d]/g, ''));
      });

      $('#esim-mobile-number').on('focusin', function () {
        document.getElementById("mobile_number_invalid_error").innerHTML = "&nbsp;";
        $('#ex-customer-error').addClass('d-none');
      });
      
    }

    $('#otp-modal').on('hidden.bs.modal', function () {
       if ($('.append-box.active').attr('id') == "use_diff_number_label") {
        $('#use_diff_number_label').addClass('active');
        $('#use_diff_number_label').css('border', '1px solid #ef005a');
        $('#esim-mobile-number').css('border', '1px solid #c4c4c4') 
      } else {
        $('.append-box').removeClass('active');
        $('#verify-button').removeClass('d-none');
      }
    })
    
    // allow only digits in the otp boxes
    $(document).on('click','.otp-box', function() {
      $('.otp-wrapper').addClass('d-none');
    });
  

  }

  if ($('.js-convert-sim-page-email-verification').length > 0) {
    var session_id = sessionStorage.getItem("esimSessionId");
    var id_number = sessionStorage.getItem('esimIdNumber');

    var EMAIL_ID = "";
    var REFFERENCE_NO = "";

    // OTP
    var otpValue = '';
    var timeout;
    var otp_countdown_timer = 0;
    var otp_resend_trigger_time;
    var timer = null;
    var downloadTimer;

    //auto navigation to next/previous input field in otp
    $(document).on('keyup', '.otp-box', function(e) {
      if (this.value.length === this.maxLength) {
        let next = $(this).data('next');
        $('#otp-' + next).focus();
      }
    }).on('keyup', '.otp-box', function(e) {
      if (e.which === 8 && !this.value) {
        let prev = $(this).data('prev');
        $('#otp-' + prev).focus();
      }
    });

    function loading(show_loading) {
      if(show_loading) {
        $('#loading-s-2').removeClass('d-none');
      } else {
        $('#loading-s-2').addClass('d-none');
      }
    }

    // common email validation function
    function validateThisMail(email) {
      $('#email_continue').removeClass('em-error')
      if (email == "") {
        $('#email_error1').removeClass('d-none')
        $('#email_error1').removeClass('email_error1')
        $('#email_error2').addClass('d-none')
        $('#email_continue').addClass('em-error')
        $('#sim-conversion-email-id').css('border','1px solid #ef005a')
        return false
      } else {
        $('#email_error1').removeClass('d-none')
        $('#email_error1').addClass('email_error1')
        $('#email_error2').addClass('d-none')
        $('#email_continue').removeClass('em-error')
        $('#emailHelp').removeClass('d-none')
        $('#sim-conversion-email-id').css('border','1px solid #c4c4c4')
      }
      var validated = Drupal.behaviors.global_validations.validateEmail(email);
      if (!validated) {
        $('#email_error2').removeClass('d-none')
        $('#email_error1').addClass('d-none')
        $('#email_continue').addClass('em-error')
        $('#sim-conversion-email-id').css('border','1px solid #ef005a')
        return false
      }
    }

    // validate email when cursor out from the input box.
    $(document).on('focusout', '#sim-conversion-email-id', function() {
      EMAIL_ID = $('#sim-conversion-email-id').val()
      validateThisMail(EMAIL_ID)
    });

    $(document).on('focusin', '#sim-conversion-email-id', function () {
      $('#email_error1').removeClass('d-none')
      $('#email_error1').addClass('email_error1')
      $('#email_error2').addClass('d-none')
    });

    // email button click
    $('#email_continue').on('click', function () {
      if (!$(this).hasClass('em-error')) {
        EMAIL_ID = $('#sim-conversion-email-id').val()
        if (EMAIL_ID == '') {
          $('#email_error1').removeClass('d-none')
          $('#email_error1').removeClass('email_error1')
          $('#email_error2').addClass('d-none')
          $('#email_continue').addClass('em-error')
          return false
        }
        validateThisMail(EMAIL_ID)
        $('#email_continue').addClass('d-none')
        loading(true)
        
        var post_data = {
          "email": EMAIL_ID,
          "session_id": session_id
        }

        $.ajax({
          url: '/data/esim/send-email-opt',
          type: 'POST',
          data: post_data,
          dataType: 'json', 
          success: function (res) {
            loading(false);
            $('#email_continue').removeClass('d-none') 
            if (res.success == false) {
              $('#error-msg').html(res.message);
              $('#error-modal').modal('show');
            } else {
              if (res.data.optStatus == 'Active') {
                REFFERENCE_NO = res.data.referenceId
  
                timeout = res.data.timeout;
                otp_countdown_timer = res.data.otp_countdown_timer;
                otp_resend_trigger_time = res.data.otp_resend_trigger_time;
  
                clearInterval(downloadTimer);
  
                downloadTimer = setInterval(function() {
                  if (otp_countdown_timer <= otp_resend_trigger_time) {
                    $('#resend-otp').removeClass('disabled');
                  }
  
                  //get time
                  let minutes = Math.floor(otp_countdown_timer / 60);
                  let seconds = otp_countdown_timer - minutes * 60;
                  let displayTime = (minutes < 10 ? "0" + minutes : minutes) + ':' + (seconds < 10 ? "0" + seconds : seconds);
                  $("#otp-timer").html(displayTime);
  
                  otp_countdown_timer -= 1;
  
                  if (otp_countdown_timer == -1) {
                    clearInterval(downloadTimer);
                  }
                }, 1000);

                $('#typedEmail').html(EMAIL_ID)
                $('#otp-1, #otp-2, #otp-3, #otp-4, #otp-5, #otp-6').removeClass('invalid').val(null);
                $('.otp-wrapper').addClass('d-none');
                $('#resend-otp').addClass('disabled');
                $('#emailOtpModal').modal({show:true,backdrop: 'static', keyboard: false}).on('shown.bs.modal', function () {
                    $('#otp-1').focus();
                });
  
              } else {
                $('#error-msg').html(res.message);
                $('#error-modal').modal('show');
              }
            }
          },
        });
      }
    });

   $('#emailOtpModal').on('hidden.bs.modal', function () {
    $('#email_continue').removeClass('d-none') 
   })

    // verify email OTP
    $(document).on('click', '#esim-verify-email-otp', function() {

      // prevent double clicking the otp verify
      //$('#esim-verify-email-otp').addClass('disabled');

      let i = 1;
      while (i < 7) {
        otpValue += $(`#otp-${i}`).val();
        i++;
      }

      //filter only numbers
      let isnum = /^\d+$/.test(otpValue);

      if (otpValue == "" || otpValue.length != 6 || isnum == false) {
        $('#otp-e').html(drupalSettings.error_messages.o2a_s3_invalid_otp);
        $('.otp-box').addClass('invalid');
        $('.otp-wrapper').removeClass('d-none');
        $('#otp-1, #otp-2, #otp-3, #otp-4, #otp-5, #otp-6').val(null);
        $('#esim-verify-email-otp').removeClass('disabled');
        otpValue = '';

      } else if (otp_countdown_timer == -1) {
        $('#otp-e').html(drupalSettings.error_messages.o2a_s3_otp_timeout);
        $('#otp-1, #otp-2, #otp-3, #otp-4, #otp-5, #otp-6').val(null);
        $('.otp-box').addClass('invalid');
        $('.otp-wrapper').removeClass('d-none');
        $('#esim-verify-email-otp').removeClass('disabled');

      } else {

        var post_data = {
          "otp": otpValue,
          "reference_no": REFFERENCE_NO,
          "session_id": session_id,
          "id_number": id_number
        }

        $.ajax({
          url: '/data/esim/validate-email-opt',
          type: 'POST',
          data: post_data,
          dataType: 'json',
            success: function(res) {
              if (res.success == false) {
                $('#otp-e').html(res.message);
                $('#otp-1, #otp-2, #otp-3, #otp-4, #otp-5, #otp-6').val(null);
                $('.otp-box').addClass('invalid');
                $('.otp-wrapper').removeClass('d-none');
                $('#esim-verify-email-otp').removeClass('disabled');
                otpValue = '';
              } else {
                if (res.data.otpStatus == 'Active') {
                  $('#emailOtpModal').modal('hide');
                  location.href="/esim_confirmation?id="+session_id

                } else if (res.data.otpStatus == 'Inactive') {
                  $('#otp-e').html(res.message);
                  $('#otp-1, #otp-2, #otp-3, #otp-4, #otp-5, #otp-6').val(null);
                  $('.otp-box').addClass('invalid');
                  $('.otp-wrapper').removeClass('d-none');
                  $('#esim-verify-email-otp').removeClass('disabled');
                  otpValue = '';

                } else {
                  $('#otp-e').html(res.message);
                  $('#otp-1, #otp-2, #otp-3, #otp-4, #otp-5, #otp-6').val(null);
                  $('.otp-box').addClass('invalid');
                  $('.otp-wrapper').removeClass('d-none');
                  $('#esim-verify-email-otp').removeClass('disabled');
                  otpValue = '';
                }
              }
            },
            error: function(res) {
              $('#otp-e').html(res.message);
              $('#otp-1, #otp-2, #otp-3, #otp-4, #otp-5, #otp-6').val(null);
              $('.otp-box').addClass('invalid');
              $('.otp-wrapper').removeClass('d-none');
              $('#esim-verify-email-otp').removeClass('disabled');
              otpValue = '';
            }
        });
      }
    });

    // email otp resend
    $(document).on('click', '#resend-otp', function() {
      otpValue = '';
      otp_countdown_timer = 0;

      // get selected numbers encrypted value
      EMAIL_ID = $('#sim-conversion-email-id').val();
      
      var post_data = {
        'email': EMAIL_ID,
        'session_id': session_id,
        'id_number': id_number
      };

      $.ajax({
        url: '/data/esim/resend-email-opt',
        type: 'POST',
        data: post_data,
        dataType: 'json',
        success: function(res) {
          if (res.success == false) {
            $('#otp-e').html(res.message);
            $('#otp-1, #otp-2, #otp-3, #otp-4, #otp-5, #otp-6').val(null);
            $('.otp-box').addClass('invalid');
            $('.otp-wrapper').removeClass('d-none');
            if (res.code == '10064') {
              setTimeout(function() { $('#resend-otp').addClass('disabled'); }, 500);
            }
        } else {
            REFFERENCE_NO = res.data.referenceNo

            otp_countdown_timer = res.data.otp_countdown_timer;
            otp_resend_trigger_time = res.data.otp_resend_trigger_time;

            clearInterval(downloadTimer);

            downloadTimer = setInterval(function() {
              if (otp_countdown_timer <= otp_resend_trigger_time) {
                $('#resend-otp').removeClass('disabled');
              }

              //get time
              let minutes = Math.floor(otp_countdown_timer / 60);
              let seconds = otp_countdown_timer - minutes * 60;
              let displayTime = (minutes < 10 ? "0" + minutes : minutes) + ':' + (seconds < 10 ? "0" + seconds : seconds);
              $("#otp-timer").html(displayTime);

              otp_countdown_timer -= 1;

              if (otp_countdown_timer == -1) {
                clearInterval(downloadTimer);
              }
            }, 1000);

            $('#otp-1, #otp-2, #otp-3, #otp-4, #otp-5, #otp-6').removeClass('invalid').val(null);
            $('.otp-wrapper').addClass('d-none');
            $('#resend-otp').addClass('disabled');
            $('#emailOtpModal').modal('show');
            $('#esim-verify-email-otp').removeClass('disabled');
          }
        },
        error: function(res) {
          $('#otp-e').html(res.message);
          $('#otp-1, #otp-2, #otp-3, #otp-4, #otp-5, #otp-6').val(null);
          $('.otp-box').addClass('invalid');
          $('.otp-wrapper').removeClass('d-none');
        }
      });
    });

    

    // allow only digits in the otp boxes
    $(document).on('input','.otp-box', function() {
      this.value = this.value.replace(/[^0-9]/g,'');
    });

    
    let tabChange = function(val){
      let ele = document.querySelectorAll('.otp-box');
      if(ele[val-1].value != ''){
      ele[val].focus()
      }else if(ele[val-1].value == ''){
      ele[val-2].focus()
      }   
    }
   
  }

 // esim confirmation page 
  
 if ($('#esim-confirmation-page').length > 0) {

  var session_id = sessionStorage.getItem("esimSessionId");
  if (session_id!== '') {
     var session_data = {
      "session_number": session_id
    };
  
    $.ajax({
      url: '/data/esim/step3-data',
      type: 'POST',
      data: session_data,
      dataType: 'json', 
      success: function (res) {

        $('#confirmed-mobile-number').html(res.contact_number);
        $('#confirmed-email').html(res.email);

        $('#confirm-activate-btn').on('click', function(){
          location.href = "/esim-confirmation?id="+session_id
        });

      },
      error: function(res) {
        $('#data-error-img').removeClass('d-none');
        $('#data-error-act').removeClass('d-none');         
      }
    });
    
  } else {
    $('#data-error-img').removeClass('d-none');
    $('#data-error-act').removeClass('d-none');
  }

 }
  
 // esim error page 
  
 if ($('.js-convert-sim-error-page').length > 0) {
  var err_msg = sessionStorage.getItem("esim_err_message"); 
}  


})(jQuery, Drupal);
