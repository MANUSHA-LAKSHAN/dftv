/**
 * @file
 * Global utilities.
 *
 */
(function ($, Drupal) {
  window.dataLayer = window.dataLayer || [];
  ("use strict");

  Drupal.behaviors.ga360 = {
    productClick: function (
      list,
      name,
      id,
      price,
      packages,
      anyData,
      nightData,
      position
    ) {
      window.dataLayer.push({
        event: "productClick",
        ecommerce: {
          click: {
            actionField: {
              list: list,
            }, // List name where packages are shown. Possible values are ‘Tailored Packages’, ‘All Packages’, ‘Packages Comparison’, ‘Other Packages’
            products: [
              {
                name: `${name}`, // Name of package e.g. Office Ultra, Booster etc.
                id: `${id}`, // SKU of package
                price: `${price}`, // Price of package e.g. 6999.00, 16400.00
                brand: packages, // HBB Packages
                category: `Anytime Data - ${anyData}`, // E.g. ‘Anytime Data - 500 GB’
                variant: `Night Data - ${nightData}`, // E.g. Night Data 500 GB
                position: position, // Position of item in the list
              },
            ],
          },
        },
      });
    },

    productImpression: function (
      name,
      id,
      price,
      packages,
      anyData,
      nightData,
      list,
      position
    ) {
      window.dataLayer.push({
        event: "productImpressions",
        ecommerce: {
          impressions: [
            {
              name: `${name}`, // Name of package e.g. Office Ultra, Booster etc.
              id: `${id}`, // SKU of package
              price: `${price}`, // Price of package e.g. 6999.00, 16400.00
              brand: packages, // HBB Packages
              category: `Anytime Data - ${anyData}`, // E.g. ‘Anytime Data - 500 GB’
              variant:
                nightData != undefined
                  ? `Night Data - ${nightData}`
                  : undefined, // E.g. Night Data 500 GB
              list: list, // List name where pacs are shown. Possible values are ‘Tailored Packages’, ‘All Packages’, ‘Packages Comparison’, ‘Other Packages’
              position: position, // Position of item in the list
              // 'dimension31': undefined, // First month bonus data value
            },
          ],
        },
      });
    },
    item_name_by_lob: function (ga360_lob) {
      var itemName = "";
      if (ga360_lob === "GSM") {
        itemName = "SIM";
      } else if (ga360_lob === "DTV") {
        itemName = "DTV";
      } else if (ga360_lob === "VIU") {
        itemName = "DTV";
      } else if (ga360_lob === "HBB") {
        itemName = "HBB";
      }

      return itemName;
    },
    cartItemWise: function (
      connection_type,
      package_name,
      price,
      description,
      identification_type,
      lob,
      item_type,
      offer_name
    ) {
      var customer_id = undefined;
      var cutomer_did_type = undefined;
      var customer_type = undefined;
      if (drupalSettings.is_logged_in) {
        customer_id = $("#id-number-for-ga360").text();
        cutomer_did_type = $("#login-did-for-ga360").text();
      } else {
        customer_type = sessionStorage.getItem("Check_customer_type");
      }

      var item = {
        item_name: Drupal.behaviors.ga360.item_name_by_lob(lob), // Product Name. Ex : Sim
        connection_type: `${connection_type}`, // Prepaid or Postpaid
        package_name: `${package_name}`, // Name of the selected package. Ex : YouTube & Social Media plan, Work & learn plan
        price: `${price}`, // Amount of selected package. Ex : 2000
        description: `${description}`, // Description of the product
        customer_id: `${customer_id}`, // NIC / Passport Number or Mobile number / Email
        cutomer_did_type: `${cutomer_did_type}`, // Mobile number or Email // If DID path selected
        lob: `${lob}`, // Line of business. Ex : Mobile
        item_category: `${item_type}`, // If it is a sim, Standard Sim or E-Sim. If it is device type of the device
        offer_name: `${offer_name}`, // Name of the selected offer. // If offer available
        customer_type:
          sessionStorage.getItem("customer_type") != "undefined"
            ? sessionStorage.getItem("customer_type")
            : undefined,
      };

      return item;
    },
    // viewCart: function (price, items_obj) {
    //   window.dataLayer.push({
    //     event: "view_cart",
    //     ecommerce: {
    //       currency: "LKR",
    //       value: price,
    //       items: items_obj,
    //     },
    //   });
    // },

    viewCart: function (price, items_obj) {
    var lob = sessionStorage.getItem('ga360_lob');
      if (lob === 'GSM' || lob === 'DTV' || lob === 'HBB' || lob === 'VIU') {
        window.dataLayer.push({
          event: "view_cart",
          ecommerce: {
            currency: "LKR",
            value: price,
            items: items_obj,
          }
        });
      }
    },

    // Device view cart
    // deviceviewCart: function (
    //   item_id,
    //   item_name,
    //   currency_code,
    //   position,
    //   item_brand,
    //   item_category,
    //   item_list_name,
    //   item_variant,
    //   quantity,
    //   contract_id,
    //   price,
    //   primary_number
    // ) {
    //   window.dataLayer.push({
    //     event: "view_cart",
    //     ecommerce: {
    //       currency: "LKR", // Currency Code
    //       value: price,
    //       items: [
    //         {
    //           item_id: item_id,
    //           item_name: item_name,
    //           currency: currency_code,
    //           index: position,
    //           item_brand: item_brand,
    //           item_category: item_category,
    //           item_list_name: item_list_name,
    //           item_variant: item_variant,
    //           quantity: quantity,
    //           contract_id: contract_id,
    //           price: price,
    //           primary_number: primary_number,
    //         },
    //       ],
    //     },
    //   });
    // },

    addToCart: function (
      currency,
      list,
      name,
      id,
      price,
      packages,
      anyData,
      nightData,
      position,
      quantity,
      bonus
    ) {
      window.dataLayer.push({
        event: "addToCart",
        ecommerce: {
          currencyCode: currency,
          add: {
            actionField: {
              list: list,
            }, // List name where packages are shown. Possible values are ‘Tailored Packages’, ‘All Packages’, ‘Packages Comparison’, ‘Other Packages’
            products: [
              {
                name: `${name}`, // Name of package e.g. Office Ultra, Booster etc.
                id: `${id}`, // SKU of package
                price: `${price}`, // Price of package e.g. 6999.00, 16400.00
                brand: packages, // HBB Packages
                category: `Anytime Data - ${anyData}`, // E.g. ‘Anytime Data - 500 GB’
                variant: `Night Data - ${nightData}`, // E.g. Night Data 500 GB
                position: position, // Position of item in the list
                quantity: quantity,
                dimension31: `${bonus}` != "" ? `${bonus}` : "Not Add", // First month bonus data value
              },
            ],
          },
        },
      });
    },

    dataAddOnProductImpression: function (
      name,
      id,
      price,
      addonType,
      category,
      variant,
      list,
      position
    ) {
      window.dataLayer.push({
        event: "productImpressions",
        ecommerce: {
          impressions: [
            {
              name: `${name}`, // Name of the pack e.g. 500 MB Anytime Data, 30 GB Data Quota etc.
              id: `${id}`, // SKU of the pack
              price: `${price}`, // Price of package e.g. 25.00, 120.00 etc.
              brand: addonType, // HBB Addons
              category: `${category}`, // E.g. Work and Learn Lite, Anytime Add On etc.
              variant: `${variant}`, // Validity of pack e.g. ‘7 Days Valid’ etc.
              list: `${list}`, // List name where packages are shown. Example values are ‘Gift Data Add Ons’, ‘Home Broadband - Data Add Ons’ etc.
              position: `${position}`, // Position of item in the list
            },
          ],
        },
      });
    },

    dataAddOnProductClick: function (
      list,
      name,
      id,
      price,
      packages,
      category,
      varient,
      position
    ) {
      window.dataLayer.push({
        event: "productClick",
        ecommerce: {
          click: {
            actionField: {
              list: list,
            }, // List name where packages are shown. Possible values are ‘Tailored Packages’, ‘All Packages’, ‘Packages Comparison’, ‘Other Packages’
            products: [
              {
                name: `${name}`, // Name of package e.g. Office Ultra, Booster etc.
                id: `${id}`, // SKU of package
                price: `${price}`, // Price of package e.g. 6999.00, 16400.00
                brand: packages, // HBB Packages
                category: `${category}`, // E.g. ‘Anytime Data - 500 GB’
                variant: `${varient}`, // E.g. Night Data 500 GB
                position: position, // Position of item in the list
              },
            ],
          },
        },
      });
    },

    hbbAddonPromoImpression: function (name, id, creative, position) {
      window.dataLayer.push({
        event: "promoImpressions",
        ecommerce: {
          promoView: {
            promotions: [
              {
                name: `${name}`, // Addon pack category name e.g. Data Add Ons
                id: `${id}`, // ID of Addon pack category
                creative: creative, // Section or Page name where the banner is shown
                position: `${position}`, // Position
              },
            ],
          },
        },
      });
    },

    // 12.5.4 PROMOTION CLICK - DOR-42137
    hbbAddonPromotionClick: function (name, id, creative, position) {
      window.dataLayer.push({
        event: "promoClick",
        ecommerce: {
          promoClick: {
            promotions: [
              {
                name: `${name}`, // Addon pack category name e.g. Data Add Ons
                id: `${id}`, // ID of Addon pack category
                creative: creative, // Section or Page name where the banner is shown
                position: `${position}`, // Position
              },
            ],
          },
        },
      });
    },

    // 9.2.4 DTV SECTIONS - DOR-42150
    dtvSections: function (
      action,
      label,
      title,
      channels,
      price,
      packName,
      quicklinkMobile,
      quicklinkcontractId,
      quicklinkeMail
    ) {
      var quicklinkeMail = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#email-for-ga360")
        .text();
      var quicklinkMobile = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#tele-for-ga360")
        .text();
      var quicklinkcontractId = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#cid-uuid-for-ga360")
        .text();

      window.dataLayer.push({
        event: "dtvSections",
        eventAction: action, // Title of the section from which an item is clicked e.g. ‘Is your area covered?’, ‘Need more channels?’, etc.
        eventLabel: label, // Clicked items e.g. Data Network, Get Now, Learn More etc.
        bannerTitle: title, // Name of the banner shown under ‘Latest in Entertainment’ section
        channels: channels, // Applicable to ‘Packages tailored to give you...’ section. E.g. ‘63 Channels’, ‘128 Channels’
        price: price, // Applicable to ‘Packages tailored to give you...’ section. E.g. ‘Rs. 799.00 per month’
        packName: packName, // Applicable to ‘Need more channels?’ section. E.g. ‘Kids Pack’, ‘Education Pack’
        usermsisdn: quicklinkMobile != "" ? quicklinkMobile : "Not Add", // HASHED MSISDN - user level
        ctridprimary:
          quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // primary contract ID
        email: quicklinkeMail != "" ? quicklinkeMail : "Not Add", // HASHED email - user level
      });
    },

    addonListings: function (
      addonType,
      label,
      category,
      quicklinkMobile,
      quicklinkcontractId,
      quicklinkeMail
    ) {
      var quicklinkeMail = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#email-for-ga360")
        .text();
      var quicklinkMobile = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#tele-for-ga360")
        .text();
      var quicklinkcontractId = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#cid-uuid-for-ga360")
        .text();

      window.dataLayer.push({
        event: "hbbAddon",
        eventAction: addonType, // ‘Addon Type’, ‘Navigation’, ‘More Details’
        eventLabel: `${label}`, // Clicked item. For ‘Addon Type’, pass ‘Rental Pack’, ‘Work & Learn’ etc. For ‘Navigation’, pass ‘Left Arrow’, ‘Right Arrow’. For ‘More Details’, pass the title e.g. ‘Anytime Data’
        addonCategory: category, // Only applicable in case of ‘Navigation’. Pass ‘Anytime Data’, ‘Recurrent Packs’, etc. In other cases, pass undefined
        usermsisdn: quicklinkMobile != "" ? quicklinkMobile : "Not Add", // HASHED MSISDN - user level
        ctridprimary:
          quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // primary contract ID
        email: quicklinkeMail != "" ? quicklinkeMail : "Not Add", // HASHED email - user level
      });
    },

    getContent: function (eId, label) {
      var action = jQuery("#dtv-all-packages-with-carousal h2").text();
      jQuery(eId + " div.card.slick-active").each(function (index, element) {
        var cElement = jQuery(element).children();
        var packName = jQuery(".badge-container p", cElement).text();
        var price = jQuery("h5", cElement).text();
        var channels = jQuery("h4", cElement).text();
        Drupal.behaviors.ga360.dtvSections(
          action,
          label,
          undefined,
          channels,
          price,
          packName,
          undefined,
          undefined,
          undefined
        );
      });
    },

    pushDataForTopLinkGoButton: function (
      event,
      action,
      label,
      cNumber,
      quicklinkMobile,
      quicklinkcontractId,
      quicklinkeMail
    ) {
      var quicklinkeMail = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#email-for-ga360")
        .text();
      var quicklinkMobile = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#tele-for-ga360")
        .text();
      var quicklinkcontractId = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#cid-uuid-for-ga360")
        .text();

      window.dataLayer.push({
        event: event,
        eventAction: action, // ‘DTV’, ‘In Home’, ‘VIU Mini’, ‘ViU Hub’, ‘HBB Landing’, ‘HBB Prepaid’, ‘HBB Postpaid’
        eventLabel: label, // Search bar title e.g. Paybill & Reload
        connectionNumber: cNumber != "" ? cNumber : "Not Add", // Encrypted connection number
        usermsisdn: quicklinkMobile != "" ? quicklinkMobile : "Not Add", // HASHED MSISDN - user level
        ctridprimary:
          quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // primary contract ID
        email: quicklinkeMail != "" ? quicklinkeMail : "Not Add", // HASHED email - user level
      });
    },

    dataPushForTopLinks: function (action) {
      window.dataLayer.push({
        event: "dtvTopPanel",
        eventAction: action, // selected item name e.g. Activate Channel
        usermsisdn: undefined, // HASHED MSISDN - user level
        ctridprimary: undefined, // primary contract ID
        email: undefined, // HASHED email - user level
      });
    },

    dataPushForFAQClick: function (
      action,
      label,
      quicklinkMobile,
      quicklinkcontractId,
      quicklinkMobile
    ) {
      var quicklinkeMail = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#email-for-ga360")
        .text();
      var quicklinkMobile = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#tele-for-ga360")
        .text();
      var quicklinkcontractId = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#cid-uuid-for-ga360")
        .text();

      window.dataLayer.push({
        event: "FAQ",
        eventAction: action,
        eventLabel: label,
        usermsisdn: quicklinkMobile != "" ? quicklinkMobile : "Not Add", // HASHED MSISDN - user level
        ctridprimary:
          quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // primary contract ID
        email: quicklinkeMail != "" ? quicklinkeMail : "Not Add", // HASHED email - user level
      });
    },

    dataPushForLoginClick: function (action, quicklinkcontractId) {
      var quicklinkcontractId = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#cid-uuid-for-ga360")
        .text();

      window.dataLayer.push({
        event: action,
        ctridprimary:
          quicklinkcontractId != "" ? quicklinkcontractId : "Not Add",
      });
    },

    productClickOnDTVPackages: function (
      list,
      name,
      sku,
      price,
      category,
      variant,
      position
    ) {
      window.dataLayer.push({
        event: "productClick",
        ecommerce: {
          click: {
            actionField: {
              list: list,
            }, // List name where packages are shown. Possible values are ‘Tailored Packages’, ‘All Packages’, ‘Packages Comparison’
            products: [
              {
                name: name, // Number of channels e.g. 64 Channels, 94 Channels
                id: sku, // SKU of channel package
                price: price, // Price of package e.g. 999.00, 1199.00
                brand: "DTV Packages", // DTV Packages
                category: category, // Package type e.g. Thee, Silver, Gold
                variant: variant, // E.g. ‘Seasonal Offer - 40’ etc.
                position: position, // Position of item in the list
                dimension29: undefined, // If Additional Channel Activation is available, pass ‘True’ or else ‘false’
                dimension30: undefined, // If Special Promotion is available, pass ‘True’ or else ‘false’
              },
            ],
          },
        },
      });
    },

    dtvPackageComparison: function (
      action,
      label,
      pName,
      price,
      sOffer,
      activation,
      quicklinkMobile,
      quicklinkcontractId,
      quicklinkMobile
    ) {
      var quicklinkeMail = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#email-for-ga360")
        .text();
      var quicklinkMobile = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#tele-for-ga360")
        .text();
      var quicklinkcontractId = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#cid-uuid-for-ga360")
        .text();

      window.dataLayer.push({
        event: "dtvPackageComparison",
        eventAction: action, // ‘Compare Packages’, ‘Package Dropdown’, ‘More Details’
        eventLabel: label, // undefined in case of Compare Packages, package name (Silver, Gold etc.) in case of Package Dropdown, number of channels (64 Channels) etc. in case of More Details
        package: pName, // Applicable to More Details. E.g. Silver, Gold etc. If not applicable, pass undefined
        price: price, // E.g. ‘Rs. 999.00 per month’. In case of Compare Packages, pass undefined
        seasonalOffer: sOffer, // E.g. 30, 40, 50 etc. In case of Compare Packages, pass undefined
        additionalChannelActivation: activation, // E.g. Yes, No. In case of Compare Packages, pass undefined
        usermsisdn: quicklinkMobile != "" ? quicklinkMobile : "Not Add", // HASHED MSISDN - user level
        ctridprimary:
          quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // primary contract ID
        email: quicklinkeMail != "" ? quicklinkeMail : "Not Add", // HASHED email - user level
      });
    },

    dtvPackageChannelComparison: function (
      action,
      label,
      quicklinkMobile,
      quicklinkcontractId,
      quicklinkeMail
    ) {
      var quicklinkeMail = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#email-for-ga360")
        .text();
      var quicklinkMobile = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#tele-for-ga360")
        .text();
      var quicklinkcontractId = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#cid-uuid-for-ga360")
        .text();

      window.dataLayer.push({
        event: "dtvPackageChannelComparison",
        eventAction: action, // Pass ‘Navigation’ on click of left and right arrow selection. Pass package name (Kids, All Channels etc.) on click of packages.
        eventLabel: label, // In case of Navigation, pass ‘Left’ or ‘Right. In case of package name, pass number of channels e.g ‘7 Channels’, ‘14 Channels’ etc.
        usermsisdn: quicklinkMobile != "" ? quicklinkMobile : "Not Add", // HASHED MSISDN - user level
        ctridprimary:
          quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // primary contract ID
        email: quicklinkeMail != "" ? quicklinkeMail : "Not Add", // HASHED email - user level
      });
    },

    productImpressionsDTV: function (
      name,
      id,
      price,
      category,
      variant,
      list,
      position,
      dimension29,
      dimension30
    ) {
      window.dataLayer.push({
        event: "productImpression",
        ecommerce: {
          impressions: [
            {
              name: name, // Number of channels e.g. 64 Channels, 94 Channels
              id: id, // SKU of channel package
              price: price, // Price of package e.g. 999.00, 1199.00
              brand: "DTV Packages", // DTV Packages
              category: category, // Package type e.g. Thee, Silver, Gold
              variant: variant, // E.g. ‘Seasonal Offer - 40’ etc.
              list: list, // List name where packages are shown. Possible values are ‘Tailored Packages’, ‘All Packages’, ‘Packages Comparison’
              position: position, // Position of item in the list
              dimension29: dimension29, // If Additional Channel Activation is available, pass ‘True’ or else ‘false’
              dimension30: dimension30, // If Special Promotion is available, pass ‘True’ or else ‘false’
            },
          ],
        },
      });
    },

    // Self Activation Custom Events
    selfActivationStartPage: function () {
      if (document.getElementById("tele-for-ga360") != null) {
        sessionStorage.removeItem('primary_number_ga360');
        sessionStorage.setItem('primary_number_ga360', document.getElementById("tele-for-ga360").innerHTML);
      } else {
        sessionStorage.removeItem('primary_number_ga360');
        sessionStorage.setItem('primary_number_ga360', "Not Add");
      }
      if (document.querySelector('input[id="radio-srilanka"]:checked') != null) {
        user_type = "sri lankan"
      } else {
        user_type = "foreigner"
      }
      sessionStorage.setItem("clicked_ga360_user_type", user_type);
      
      window.dataLayer.push({
        event: "self_activation",
        ecommerce: {
          items: [
            {
              event_category: "Self Activation",
              event_action: "click",
              event_label: "start activation",
              user_type: user_type,
            },
          ],
        },
      });
    },

    selfActivationStartPageCompatabilityError: function () {
      if (document.getElementById('radio-srilanka').checked) {
        user_type = "sri lankan"
      } else {
        user_type = "foreigner"
      }
      window.dataLayer.push({
        event: "self_activation_error",
        ecommerce: {
          items: [
            {
              event_category: "Self activation",
              event_action: "click",
              event_label: "error screen",
              user_type: user_type,
              error_detail: "browser isn't compatible",
            },
          ],
        },
      });
    },

    selfActivationVideo: function () {
      if (document.getElementById('radio-srilanka').checked) {
        user_type = "sri lankan"
      } else {
        user_type = "foreigner"
      }
      window.dataLayer.push({
        event: "self_activation_video",
        ecommerce: {
          items: [
            {
              event_category: "Self activation",
              event_action: "click",
              event_label: "how to video",
              user_type: user_type,
            },
          ],
        },
      });
    },

    selfActivationSelectPackage: function (eventParameters) {

      window.dataLayer.push({
        event: "self_activation_select_package_update",
        ecommerce: {
          items: [
            {
              event_category: "Self Activation",
              event_action: "package update",
              event_label: eventParameters.plan_name,
              user_type: eventParameters.user_type,
              package_type: eventParameters.package_type,
              plan_selected: eventParameters.plan_selected,
              plan_name: eventParameters.plan_name,
              plan_cost: eventParameters.plan_cost,
              add_on: eventParameters.plan_name,
            },
          ],
        },
      });
    },

    selfActivationSimDetails: function (eventParameters) {
      window.dataLayer.push({
        event: "self_activation_sim_details",
        ecommerce: {
          items: [
            {
              event_category: "Self Activation",
              event_action: "Sim details - find button",
              event_label: eventParameters.plan_name,
              user_type: eventParameters.user_type,
              package_type: eventParameters.package_type,
              plan_selected: eventParameters.plan_selected,
              plan_name: eventParameters.plan_name,
              plan_cost: eventParameters.plan_cost,
              add_on: eventParameters.plan_name,
            },
          ],
        },
      });
    },

    selfActivationContactDetails: function () {
      package_type = (drupalSettings.self_activation_row["paid_mode"]).toLowerCase()
      plan_selected = JSON.parse(drupalSettings.self_activation_row["more_data"]).packageName
      plan_name = sessionStorage.getItem('packageList')
      plan_cost = Number(sessionStorage.getItem('price_ga360'))

      if (Drupal.behaviors.global_validations.validateEmail(document.getElementById("validateEmail").value)) {
        event_label = "button click"
      } else {
        event_label = "Error screen"
      }

      if (document.getElementById("change-contact-details") != null) {
        event_label = "details changed"
      }

      if (drupalSettings.self_activation_row["is_foreigner"] == "0") {
        user_type = "sri lankan"
      } else {
        user_type = "foreigner"
      }

      suffix = "";
      if (event_label == "Error screen") {
        suffix = "_details_error";
      } else if (event_label == "details changed") {
        suffix = "_change_details";
      } else {
        suffix = "_details";
      }
      window.dataLayer.push({
        event: "self_activation_contact".concat(suffix),
        ecommerce: {
          items: [
            {
              event_category: "Self Activation",
              event_action: "contact details",
              event_label: event_label,
              user_type: user_type,
              package_type: package_type,
              plan_selected: plan_selected,
              plan_name: plan_name,
              plan_cost: plan_cost,
              add_on: plan_name,
            },
          ],
        },
      });
    },

    selfActivationSelectNumber: function (eventParameters) {
      suffix = "";
      if (eventParameters.event_label == "random number") {
        suffix = "_random";
      } else if (eventParameters.event_label == "search number") {
        eventParameters.event_label = event_label
        Drupal.behaviors.ga360.selfActivationSelectNumberSearch(eventParameters)
        return
      }
      window.dataLayer.push({
        event: "self_activation_select_number".concat(suffix),
        ecommerce: {
          items: [
            {
              event_category: "Self Activation",
              event_action: "select number",
              event_label: event_label,
              user_type: eventParameters.user_type,
              package_type: eventParameters.package_type,
              plan_selected: eventParameters.plan_selected,
              plan_name: eventParameters.plan_name,
              plan_cost: eventParameters.plan_cost,
              add_on: eventParameters.plan_name,
            },
          ],
        },
      });
    },

    selfActivationSelectNumberSearch: function (eventParameters) {
      if (document.querySelector('input[id="customControlValidation3"]:checked') != null) {
        filter_selection = "includes"
      } else if (document.querySelector('input[id="customControlValidation4"]:checked') != null) {
        filter_selection = "starts with"
      } else if (document.querySelector('input[id="customControlValidation5"]:checked') != null) {
        filter_selection = "ends with"
      }
      window.dataLayer.push({
        event: "self_activation_select_number_search",
        ecommerce: {
          items: [
            {
              event_category: "Self Activation",
              event_action: "select number",
              event_label: event_label,
              user_type: eventParameters.user_type,
              package_type: eventParameters.package_type,
              plan_selected: eventParameters.plan_selected,
              plan_name: eventParameters.plan_name,
              plan_cost: eventParameters.plan_cost,
              add_on: eventParameters.plan_name,
              filter_selection: filter_selection,
            },
          ],
        },
      });
    },

    // Self Activation Ecommerce

    SAItems: function (

      // Parents function for events: view_item_list, select_item, view_item, add_to_cart
      event,
    ) {
      
      // Initializing event parameters common to the four events
      if (drupalSettings.self_activation_row["is_foreigner"] == "0") {
        user_type = "sri lankan"
      } else {
        user_type = "foreigner"
      }

      event_label = undefined
      
      switch (event) {
        case "view_item_list":
          // VIEW_ITEM_LIST LOGIC

          // Defining event parameters plan_selected and plan_name
          if (document.querySelector('a[id="nav-postpaid-tab"]').ariaSelected == 'true') {
            item_category = "postpaid"
            // Postpaid flow
            // Capturing the selected package
            if (document.querySelector('div[id="postpaid-tab"] div[class="card main-card border-radius-8 mb-3 active-card"] p[class="type-3 selected-package-name"]') == null) {
              item_name = undefined
            } else {
              item_name = document.querySelector('div[id="postpaid-tab"] div[class="card main-card border-radius-8 mb-3 active-card"] p[class="type-3 selected-package-name"]')
                .innerHTML.replace("&amp;", "&")
            }
            
            // Initializing price, item_id, index and item_category parameters
            price = Number((((document.querySelector('div[id="postpaid-tab"] div[class="card main-card border-radius-8 mb-3 active-card"] p[class="type-3 font-weight-700"]')
              .innerHTML)
              .replace("\n", "")).trim()).replace("Rs. ", ""))
            
            item_id = document.querySelector('div[id="postpaid-tab"] div[class="card main-card border-radius-8 mb-3 active-card"] p[class="pcardID d-none"]')
              .innerHTML

            // Compiling a list of packages available
            packList = []
            packNodeList = document.querySelectorAll('div[id="postpaid-tab"] div[paktype="postpaid"]')
            packNodeList.forEach((pack) => {
              // String formatting (converting "&amp;" to "")
              packList.push((pack.querySelector('p[class="type-3 selected-package-name"]').innerHTML).replace("&amp;", "&"))
              // Converting packList array to a string
              packageList = packList.toString()
            })

            index = packList.indexOf(item_name) + 1
        
          } else {
            item_category = "prepaid"
            // Prepaid flow
            // Capturing the selected package
            if (document.querySelector('div[id="prepaid-tab"] div[class="card main-card border-radius-8 mb-3 active-card"] p[class="type-3 selected-package-name"]') == null) {
              item_name = undefined
            } else {
              item_name = document.querySelector('div[id="prepaid-tab"] div[class="card main-card border-radius-8 mb-3 active-card"] p[class="type-3 selected-package-name')
                .innerHTML.replace("&amp;", "&")
            }

            // Initializing price, item_id, index and item_category parameters
            price = Number(document.querySelector('div[id="prepaid-tab"] div[class="card main-card border-radius-8 mb-3 active-card"] p[class="type-3 font-weight-700"]')
              .innerHTML
              .replace("\n", "").trim().replace("Rs. ", ""))
            
            item_id = document.querySelector('div[id="prepaid-tab"] div[class="card main-card border-radius-8 mb-3 active-card"] p[class="pcardID d-none"]')
              .innerHTML
            
            // Compiling a list of packages available
            packList = []
            packNodeList = document.querySelectorAll('div[id="prepaid-tab"] div[paktype="prepaid"]')
            packNodeList.forEach((pack) => {
              // String formatting (converting "&amp;" to "")
              packList.push((pack.querySelector('p[class="type-3 selected-package-name"]').innerHTML).replace("&amp;", "&"))
              // Converting packList array to a string
              packageList = packList.toString()
              
              sessionStorage.setItem("clicked_ga360_plan_name", packageList);
              
            })
            
            index = packList.indexOf(item_name) + 1
            
          }
          sessionStorage.removeItem('price_ga360');
          sessionStorage.setItem('price_ga360', price);
          sessionStorage.removeItem('packageList');
          sessionStorage.setItem('packageList', packageList);
          // To be passed to customEvents
          plan_name = sessionStorage.getItem('packageList');
          sessionStorage.removeItem('index');
          sessionStorage.setItem('index', index);
          // Adding primary_number to session storage
          primary_number = sessionStorage.getItem('primary_number_ga360');
          break
        case "select_item":
          item_id = (drupalSettings.self_activation_row["selected_package"]).toLowerCase()
          item_name = JSON.parse(drupalSettings.self_activation_row["more_data"]).packageName
          index = Number(sessionStorage.getItem('index'));
          item_category = (drupalSettings.self_activation_row["paid_mode"]).toLowerCase()
          price = Number(sessionStorage.getItem('price_ga360'))
          primary_number = sessionStorage.getItem('primary_number_ga360');

          // To be passed to customEvents
          plan_name = sessionStorage.getItem('packageList');
          
          break
        case "view_item":
          item_id = (drupalSettings.self_activation_row["selected_package"]).toLowerCase()
          item_name = JSON.parse(drupalSettings.self_activation_row["more_data"]).packageName
          index = Number(sessionStorage.getItem('index'));
          item_category = (drupalSettings.self_activation_row["paid_mode"]).toLowerCase()
          price = Number(sessionStorage.getItem('price_ga360'))
          primary_number = sessionStorage.getItem('primary_number_ga360');

          // To be passed to customEvents
          plan_name = sessionStorage.getItem('packageList');
          break
        case "add_to_cart":
          item_id = (drupalSettings.self_activation_row["selected_package"]).toLowerCase()
          item_name = JSON.parse(drupalSettings.self_activation_row["more_data"]).packageName
          index = Number(sessionStorage.getItem('index'));
          item_category = (drupalSettings.self_activation_row["paid_mode"]).toLowerCase()
          price = Number(sessionStorage.getItem('price_ga360'))
          primary_number = sessionStorage.getItem('primary_number_ga360');
         
          if (document.querySelector('div[class="number-pool-block d-none"]') != null) {
            event_label = "next button"
          } else if (document.getElementById("nav-selectN-tab-1").ariaSelected == "true") {
            event_label = "random number"
          } else if (document.getElementById("nav-selectN-tab-2").ariaSelected == "true") {
            event_label = "search number"
          }

          // To be passed to customEvents
          plan_name = sessionStorage.getItem('packageList');
          break
      }
      
      window.dataLayer.push({
        event: event,
        ecommerce: {
          items: [
            {
              item_id: item_id,
              item_name: item_name,
              currency: "LKR",
              index: index,
              item_category: item_category,
              item_list_name: "self activation",
              primary_number: primary_number,
              price: price,
              quantity: 1,
            },
          ],
        },
      });
      // Creating a json of event parameters to pass to the selfActivationSelectPackage
      let eventParameters = {
        event_label: event_label,
        plan_name: plan_name,
        user_type: user_type,
        package_type: item_category,
        plan_selected: item_name,
        plan_cost: price
      }
      return eventParameters
    },

    SAIdVerification: function () {
      item_id = drupalSettings.self_activation_row["selected_package"]
      item_category = (drupalSettings.self_activation_row["paid_mode"]).toLowerCase()
      item_name = JSON.parse(drupalSettings.self_activation_row["more_data"]).packageName
      price = Number(sessionStorage.getItem('price_ga360'))

      primary_number = sessionStorage.getItem('primary_number_ga360');
      index = Number(sessionStorage.getItem('index'));

      if (document.querySelector('div[id="nav-tab"] div[id="nav-nic-tab"]').className == "text-center tab-card active") {
        verification_method = "nic"
      } else if (document.querySelector('div[id="nav-tab"] div[id="nav-nic-tab"]').className == "text-center active tab-card") {
        verification_method = "nic"
      } else if (document.querySelector('div[id="nav-tab"] div[id="nav-license-tab"]').className == "text-center tab-card active") {
        verification_method = "license"
      } else {
        verification_method = "passport"
      }

      window.dataLayer.push({
        event: "view_cart",
        ecommerce: {
          items: [
            {
              item_id: item_id,
              item_name: item_name,
              currency: "LKR",
              index: index,
              item_category: item_category,
              item_list_name: "self activation",
              primary_number: primary_number,
              price: price,
              quantity: 1,
              verification_method: verification_method,
            },
          ],
        },
      });
    },

    SABeginCheckout: function () {
      item_id = drupalSettings.self_activation_row["selected_package"]
      item_category = (drupalSettings.self_activation_row["paid_mode"]).toLowerCase()
      item_name = JSON.parse(drupalSettings.self_activation_row["more_data"]).packageName
      price = Number(sessionStorage.getItem('price_ga360'))

      primary_number = sessionStorage.getItem('primary_number_ga360');
      index = Number(sessionStorage.getItem('index'));

      verification_method = (document.querySelector('button[data-id="address-verify-local-dropdown"]').title).toLowerCase()
      
      if (verification_method == "select from the list") {
        verification_method == undefined
      }
      
      window.dataLayer.push({
        event: "begin_checkout",
        ecommerce: {
          items: [
            {
              item_id: item_id,
              item_name: item_name,
              currency: "LKR",
              index: index,
              item_category: item_category,
              item_list_name: "self activation",
              primary_number: primary_number,
              price: price,
              quantity: 1,
              verification_method: verification_method,
            },
          ],
        },
      });
    },

    SAAddShippingInfo: function () {
      item_id = drupalSettings.self_activation_row["selected_package"]
      item_category = (drupalSettings.self_activation_row["paid_mode"]).toLowerCase()
      item_name = JSON.parse(drupalSettings.self_activation_row["more_data"]).packageName
      price = Number(sessionStorage.getItem('price_ga360'))

      primary_number = sessionStorage.getItem('primary_number_ga360');
      index = Number(sessionStorage.getItem('index'));
      
      window.dataLayer.push({
        event: "add_shipping_info",
        ecommerce: {
          items: [
            {
              item_id: item_id,
              item_name: item_name,
              currency: "LKR",
              index: index,
              item_category: item_category,
              item_list_name: "self activation",
              primary_number: primary_number,
              price: price,
              quantity: 1,
            },
          ],
        },
      });
    },

    SAAddPaymentInfo: function () {
      
      // Initializing parameters
      item_id = drupalSettings.self_activation_row["selected_package"];
      item_category = drupalSettings.self_activation_row["paid_mode"];
      item_name = JSON.parse(drupalSettings.self_activation_row["more_data"]).packageName
      price = Number(sessionStorage.getItem('price_ga360'))
      index = Number(sessionStorage.getItem('index'));
      primary_number = sessionStorage.getItem('primary_number_ga360');
      
      if (drupalSettings.self_activation_row["paid_mode"] == "postpaid") {
        if (document.getElementById("VISA-tab").className =="card border-radius-common payment-button mb-3 p-3 payment-card active-card") {
          payment_type = "credit card";
        } else if (document.getElementById("AMEX-tab").className =="card border-radius-common payment-button mb-3 p-3 payment-card active-card") {
          payment_type = "credit card";
        } else {
          payment_type = "genie";
        }
      } else {
        payment_type = undefined
      }
      

      window.dataLayer.push({
        event: "add_payment_info",
        ecommerce: {
          items: [
            {
              item_id: item_id,
              item_name: item_name,
              currency: "LKR",
              index: index,
              item_category: item_category,
              item_list_name: "self activation",
              primary_number: primary_number,
              price: price,
              quantity: 1,
              payment_type: payment_type,
            },
          ],
        },
      });
    },

    SAPurchase: function () {

      // Initializing paramters
      tax = undefined;
      shipping = undefined;
      item_id = drupalSettings.self_activation_row["selected_package"];
      item_name = JSON.parse(drupalSettings.self_activation_row["more_data"]).packageName;
      index = Number(sessionStorage.getItem('index'));
      item_category = drupalSettings.self_activation_row["paid_mode"];
      primary_number = sessionStorage.getItem('primary_number_ga360');
      price = Number(sessionStorage.getItem('price_ga360'))
      value = price

      if (drupalSettings.self_activation_row["paid_mode"] == "postpaid") {
        payment_type = drupalSettings.self_activation_row["payment_type"];
        switch (payment_type) {
          case "GENIE":
            payment_type = "genie";
          case "AMEX":
            payment_type = "credit card";
          case "VISA":
            payment_type = "credit card";
        }
        transaction_id = drupalSettings.self_activation_row["ipg_ref"]
      } else {
        payment_type = undefined
        transaction_id = undefined
      }
      
      window.dataLayer.push({
        event: "purchase",
        ecommerce: {
          items: [
            {
              transaction_id: transaction_id,
              value: value,
              tax: tax,
              shipping: shipping,
              item_id: item_id,
              item_name: item_name,
              currency: "LKR",
              index: index,
              item_category: item_category,
              item_list_name: "self activation",
              primary_number: primary_number,
              price: price,
              quantity: 1,
              payment_type: payment_type,
            },
          ],
        },
      });
    },

    listOfChannelsDTV: function (
      action,
      label,
      title,
      quicklinkMobile,
      quicklinkcontractId,
      quicklinkeMail
    ) {
      var quicklinkeMail = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#email-for-ga360")
        .text();
      var quicklinkMobile = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#tele-for-ga360")
        .text();
      var quicklinkcontractId = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#cid-uuid-for-ga360")
        .text();

      window.dataLayer.push({
        event: "listOfChannels",
        eventAction: action, // Pass ‘Navigation’ on click of left and right arrow selection. Pass package name (Sports, Movies etc.) on click of packages.
        eventLabel: label, // In case of Navigation, pass ‘Left’ or ‘Right. In case of package name, pass number of channels e.g ‘5 Channels’, ‘14 Channels’ etc.
        bannerTitle: title, // Section title e.g. ‘Channels included in Gold package’
        usermsisdn: quicklinkMobile != "" ? quicklinkMobile : "Not Add", // HASHED MSISDN - user level
        ctridprimary:
          quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // primary contract ID
        email: quicklinkeMail != "" ? quicklinkeMail : "Not Add", // HASHED email - user level
      });
    },

    productClickOurOtherPack: function (
      list,
      name,
      id,
      price,
      category,
      position
    ) {
      window.dataLayer.push({
        event: "productClick",
        ecommerce: {
          click: {
            actionField: {
              list: list,
            }, // List name where packages are shown. Example values are ‘Bundles that include Rupavahini channel’, ‘Need More Channels’, ‘All Channel Packs’ etc.
            products: [
              {
                name: name, // Number of channels e.g. 8 Channels, 6 Channels
                id: id, // SKU of channel pack
                price: price, // Price of pack e.g. 199.00
                brand: "DTV Channel Packs", // DTV Channel Packs
                category: category, // Pack type e.g. Kids Pack, Education Pack
                variant: undefined,
                position: position, // Position of item in the list
              },
            ],
          },
        },
      });
    },

    productImpressionsDTVBundle: function (
      name,
      id,
      price,
      category,
      list,
      position
    ) {
      window.dataLayer.push({
        event: "productImpressions",
        ecommerce: {
          impressions: [
            {
              name: name, // Number of channels e.g. 8 Channels, 6 Channels
              id: id, // SKU of channel pack
              price: price, // Price of pack e.g. 199.00
              brand: "DTV Channel Packs", // DTV Channel Packs
              category: category, // Pack type e.g. Kids Pack, Education Pack
              variant: undefined,
              list: list, // List name where packages are shown. Example values are ‘Bundles that include Rupavahini channel’, ‘Need More Channels’, ‘All Channel Packs’ etc.
              position: position, // Position of item in the list
            },
          ],
        },
      });
    },

    dtvChannelSearch: function (action) {
      window.dataLayer.push({
        event: "dtvChannelSearch",
        eventAction: action, // Search term
        usermsisdn: undefined, // HASHED MSISDN - user level
        ctridprimary: undefined, // primary contract ID
        email: undefined, // HASHED email - user level
      });
    },

    genericQuickLinkEvent: function (
      eventName,
      action,
      quicklinkMobile,
      quicklinkcontractId,
      quicklinkeMail
    ) {
      var quicklinkeMail = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#email-for-ga360")
        .text();
      var quicklinkMobile = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#tele-for-ga360")
        .text();
      var quicklinkcontractId = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#cid-uuid-for-ga360")
        .text();

      window.dataLayer.push({
        event: eventName,
        eventAction: action, // selected item name e.g.Buy ViU Mini
        usermsisdn: quicklinkMobile != "" ? quicklinkMobile : "Not Add", // HASHED MSISDN - user level
        ctridprimary:
          quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // primary contract ID
        email: quicklinkeMail != "" ? quicklinkeMail : "Not Add", // HASHED email - user level
      });
    },

    inHomeSections: function (action, label, title, msisdn, primary, email) {
      window.dataLayer.push({
        event: "inHomeSections",
        eventAction: action, // Title of the section from which an item is clicked e.g. ‘Is your area covered?’,‘For all your entertainment needs’, etc.
        eventLabel: label, // Clicked items e.g. Data Network, Buy Now, Learn More etc.
        bannerTitle: title, // ‘Latest in Entertainment’, ‘Dialog TV’, ‘ViU Mini’ etc.
        usermsisdn: msisdn, // HASHED MSISDN - user level
        ctridprimary: primary, // primary contract ID
        email: email, // HASHED email - user level
      });
    },

    inHomeMegaMenu: function (action, label, destUrl, msisdn, primary, email) {
      window.dataLayer.push({
        event: "inHomeMegaMenu",
        eventAction: action, // Category e.g. Mobile, Shop, Support etc.
        eventLabel: label, // Clicked item e.g. Prepaid, Mobile etc.
        destinationUrl: destUrl, // Destination URL
        usermsisdn: msisdn, // HASHED MSISDN - user level
        ctridprimary: primary, // primary contract ID
        email: email, // HASHED email - user level
      });
    },

    hbbPackageSections: function (
      action,
      label,
      packName,
      price,
      category,
      quicklinkMobile,
      quicklinkcontractId,
      quicklinkeMail
    ) {
      var quicklinkeMail = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#email-for-ga360")
        .text();
      var quicklinkMobile = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#tele-for-ga360")
        .text();
      var quicklinkcontractId = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#cid-uuid-for-ga360")
        .text();

      window.dataLayer.push({
        event: "hbbPackageSections",
        eventAction: action, // Clicked items e.g. Get Now, Buy Now, Lite Plus, Learn More etc.
        eventLabel: label, // Name of the section from which an item is clicked e.g. Wifi Extender
        packageName: packName, // Applicable to ‘Special Promotion’ button click. E.g. 200GB Anytime Data Quota
        price: price, // Applicable to ‘Special Promotion’ button click. E.g. Rs. 6900.00 per month
        packageCategory: category, // Applicable to ‘Special Promotion’ button click. E.g. Office Ultra, Booster, etc.
        usermsisdn: quicklinkMobile != "" ? quicklinkMobile : "Not Add", // HASHED MSISDN - user level
        ctridprimary:
          quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // primary contract ID
        email: quicklinkeMail != "" ? quicklinkeMail : "Not Add", // HASHED email - user level
      });
    },

    // 12.1.4 HBB SECTIONS - DOR-42111
    hbbSections: function (
      action,
      label,
      title,
      pName,
      price,
      category,
      quicklinkMobile,
      quicklinkcontractId,
      quicklinkeMail
    ) {
      var quicklinkeMail = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#email-for-ga360")
        .text();
      var quicklinkMobile = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#tele-for-ga360")
        .text();
      var quicklinkcontractId = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#cid-uuid-for-ga360")
        .text();

      window.dataLayer.push({
        event: "hbbSections",
        eventAction: action != "" ? action : "Not Add", // Title of the section from which an item is clicked e.g. ‘Latest in Broadband’, ‘Child Wi-Fi’, etc.
        eventLabel: label, // Clicked items e.g. Get Started, Buy Now, Learn More etc.
        bannerTitle: title, // Pass title of the banner wherever applicable e.g. ‘School Package’, ‘Postpaid’
        packageName: pName, // Applicable to ‘Special Promotion’ button click. E.g. 200GB Anytime Data Quota
        price: price, // Applicable to ‘Special Promotion’ button click. E.g. Rs. 6900.00 per month
        packageCategory: category, // Applicable to ‘Special Promotion’ button click. E.g. Office Ultra, Booster, etc.
        usermsisdn: quicklinkMobile != "" ? quicklinkMobile : "Not Add", // HASHED MSISDN - user level
        ctridprimary:
          quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // primary contract ID
        email: quicklinkeMail != "" ? quicklinkeMail : "Not Add", // HASHED email - user level
      });
    },

    hbbPackageComparison: function (
      action,
      label,
      price,
      anytimeData,
      nightData,
      bonusData,
      gamerdata,
      quicklinkMobile,
      quicklinkcontractId,
      quicklinkeMail
    ) {
      var quicklinkeMail = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#email-for-ga360")
        .text();
      var quicklinkMobile = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#tele-for-ga360")
        .text();
      var quicklinkcontractId = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#cid-uuid-for-ga360")
        .text();

      window.dataLayer.push({
        event: "hbbPackageComparison",
        eventAction: action, // Package Dropdown
        eventLabel: label, // Package name i.e Office Ultra, Booster etc.
        price: price, // E.g. ‘Rs. 6999.00 per month’
        anytimeData: anytimeData, // E.g. 500 GB etc.
        nightData: nightData, // E.g. 500 GB etc.
        firstMonthBonusData: bonusData, // E.g. 100 GB etc.
        gamerdata: gamerdata, // E.g. 100 GB etc.
        // 'gamerdata': gamerdata, // E.g. 100 GB etc.
        usermsisdn: quicklinkMobile != "" ? quicklinkMobile : "Not Add", // HASHED MSISDN - user level
        ctridprimary:
          quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // primary contract ID
        email: quicklinkeMail != "" ? quicklinkeMail : "Not Add", // HASHED email - user level
      });
    },

    ProductImpressionCommon: function (impressionCards) {
      window.dataLayer.push({
        event: "productImpression", //static
        ecommerce: {
          impressions: impressionCards,
        },
      });
    },

    // Product click DOR-42159
    productClickCommon: function (list, obj) {
      window.dataLayer.push({
        event: "productClick",
        ecommerce: {
          click: {
            actionField: {
              list: list,
            }, // List name where packages are shown. Possible values are ‘Tailored Packages’, ‘All Packages’, ‘Packages Comparison’, ‘Other Packages’
            products: [obj],
          },
        },
      });
    },

    productAddToCartCommon: function (currency, list, obj) {
      dataLayer.push({
        event: "addToCart",
        ecommerce: {
          currencyCode: currency,
          add: {
            actionField: {
              list: list,
            }, // List name where packages are shown. Possible values are ‘Tailored Packages’, ‘All Packages’, ‘Packages Comparison’
            products: [obj],
          },
        },
      });
    },

    productImpressionsDTVBundleCommon: function (obj) {
      window.dataLayer.push({
        event: "productImpression",
        ecommerce: {
          impressions: [obj],
        },
      });
    },

    // 9.5.2 PRODUCT CLICK DOR-42159
    hasNumber: function (myString) {
      return /\d/.test(myString);
    },

    // channelPacks DOR-42761
    listOfchannelPacks: function (
      action,
      label,
      package,
      quicklinkMobile,
      quicklinkcontractId,
      quicklinkeMail
    ) {
      var quicklinkeMail = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#email-for-ga360")
        .text();
      var quicklinkMobile = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#tele-for-ga360")
        .text();
      var quicklinkcontractId = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#cid-uuid-for-ga360")
        .text();

      window.dataLayer.push({
        event: "channelPacks",
        eventAction: action, // ‘8 Channels’, ‘View More Packs’, ‘Prepaid’, ‘Postpaid’
        eventLabel: label, // Channels in the pack e.g. 8 Channels. In case of ‘View More Packs’, ‘Prepaid’, ‘Postpaid’, pass undefined
        package: package, // Bundle name e.g. Kids Bundle. In case of ‘View More Packs’, ‘Prepaid’, ‘Postpaid’, pass undefined
        usermsisdn: quicklinkMobile != "" ? quicklinkMobile : "Not Add", // HASHED MSISDN - user level
        ctridprimary:
          quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // primary contract ID
        email: quicklinkeMail != "" ? quicklinkeMail : "Not Add", // HASHED email - user level
      });
    },

    // 9.4.3 PRODUCT DETAILS - DOR-42160
    productDetailCommon: function (list, obj) {
      window.dataLayer.push({
        event: "productDetail",
        ecommerce: {
          detail: {
            actionField: {
              list: list,
            }, // List name where packages are shown. Possible values are ‘Tailored Packages’, ‘All Packages’, ‘Packages Comparison’
            products: [obj],
          },
        },
      });
    },

    // DTV Packages DOR-42154
    dtvPackages: function (
      action,
      label,
      pName,
      price,
      sOffer,
      quicklinkMobile,
      quicklinkcontractId,
      quicklinkeMail
    ) {
      var quicklinkeMail = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#email-for-ga360")
        .text();
      var quicklinkMobile = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#tele-for-ga360")
        .text();
      var quicklinkcontractId = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#cid-uuid-for-ga360")
        .text();

      window.dataLayer.push({
        event: "dtvPackages",
        eventAction: action, // ‘See Channels’ or ‘View More Packages’
        eventLabel: label, // Channels in package e.g. 63 Channels. In case of ‘View More Packages’, pass undefined
        package: pName, // Package label shown at the top e.g. Thee, Gold etc. In case of ‘View More Packages’, pass undefined
        price: price, // Whole price tag e.g. ‘Rs. 799.00 per month’. In case of ‘View More Packages’, pass undefined
        specialPromotion: sOffer, // If available, pass ‘yes’ or else ‘no’. In case of ‘View More Packages’, pass undefined
        usermsisdn: quicklinkMobile != "" ? quicklinkMobile : "Not Add", // HASHED MSISDN - user level
        ctridprimary:
          quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // primary contract ID
        email: quicklinkeMail != "" ? quicklinkeMail : "Not Add", // HASHED email - user level
      });
    },

    // ACTIVATE CHANNEL DOR-42143
    activateChannel: function (
      action,
      predailyrental,
      premonthlyrental,
      postpadidrental,
      quicklinkMobile,
      quicklinkcontractId,
      quicklinkeMail
    ) {
      var quicklinkeMail = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#email-for-ga360")
        .text();
      var quicklinkMobile = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#tele-for-ga360")
        .text();
      var quicklinkcontractId = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#cid-uuid-for-ga360")
        .text();

      window.dataLayer.push({
        event: "activateChannel",
        eventAction: action, // Channel name e.g. HBO
        prepaidDailyRentalPrice: predailyrental, // E.g. ‘15.00’
        prepaidMonthlyRentalPrice: premonthlyrental, // E.g. ‘79.00’
        postpaidRentalPrice: postpadidrental, // E.g. ‘59.00’
        usermsisdn: quicklinkMobile != "" ? quicklinkMobile : "Not Add", // HASHED MSISDN - user level
        ctridprimary:
          quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // primary contract ID
        email: quicklinkeMail != "" ? quicklinkeMail : "Not Add", // HASHED email - user level
      });
    },

    // BUNDLE BANNER NAVIGATION DOR-42144
    bundleBannerNavigation: function (
      action,
      label,
      quicklinkMobile,
      quicklinkcontractId,
      quicklinkeMail
    ) {
      var quicklinkeMail = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#email-for-ga360")
        .text();
      var quicklinkMobile = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#tele-for-ga360")
        .text();
      var quicklinkcontractId = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#cid-uuid-for-ga360")
        .text();

      window.dataLayer.push({
        event: "bundleBannerNavigation",
        eventAction: action, // 'Left' or 'Right' based on the arrow click
        eventLabel: label, // Title above the banner e.g. Bundles that...
        usermsisdn: quicklinkMobile != "" ? quicklinkMobile : "Not Add", // HASHED MSISDN - user level
        ctridprimary:
          quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // primary contract ID
        email: quicklinkeMail != "" ? quicklinkeMail : "Not Add", // HASHED email - user level
      });
    },

    // Device View Item DOR-59422
    deviceViewItem: function (
      item_id,
      item_name,
      position,
      item_brand,
      item_category,
      item_category2,
      item_list_name,
      item_variant,
      quicklinkcontractId,
      ga360_price,
      quantity,
      primary_number
    ) {
      window.dataLayer.push({
        event: "view_item",
        ecommerce: {
          currency: "LKR", // Currency Code
          value: ga360_price,
          items: [
            {
              item_id: item_id,
              item_name: item_name, // Name of the product
              index: position, // Position of item in list. E.g. 1, 2, 3 etc.
              item_brand: item_brand, // Brand category of the product E.g Lenovo
              item_category: item_category, // Category of the brand E.g Tablet
              item_category2: item_category2, // 2nd category of the product E.g
              item_list_name: item_list_name, // List name where the packages are listed. E.g. Phone, Tablets, Smart home etc etc.
              item_variant: item_variant,
              contract_id:
                quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // User property contract ID as a key
              price: ga360_price, // price of the product E.g 86069
              quantity: quantity, // Quantity of the product E.g 1
              primary_number: primary_number,
            },
          ],
        },
      });
    },

    // Device Select Item DOR-59422
    deviceSelectItem: function (
      item_id,
      item_name,
      currency_code,
      position,
      item_brand,
      item_category,
      item_category2,
      item_list_name,
      item_variant,
      quicklinkcontractId,
      ga360_price,
      quantity,
      primary_number
    ) {
      window.dataLayer.push({
        event: "select_item",
        ecommerce: {
          currency: currency_code, // Currency Code
          items: [
            {
              item_id: item_id,
              item_name: item_name, // Name of the product
              index: position, // Position of item in list. E.g. 1, 2, 3 etc.
              item_brand: item_brand, // Brand category of the product E.g Lenovo
              item_category: item_category, // Category of the brand E.g Tablet
              item_category2: item_category2, // 2nd category of the product E.g
              item_list_name: item_list_name, // List name where the packages are listed. E.g. Phone, Tablets, Smart home etc etc.
              item_variant: item_variant,
              contract_id:
                quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // User property contract ID as a key
              price: ga360_price, // price of the product E.g 86069
              quantity: quantity, // Quantity of the product E.g 1
              primary_number: primary_number,
            },
          ],
        },
      });
    },

    // Device add to cart DOR-59422
    deviceAddtoCart: function (
      item_id,
      item_name,
      currency_code,
      position,
      item_brand,
      item_category,
      item_list_name,
      item_variant,
      quantity,
      contract_id,
      price,
      value,
      primary_number
    ) {
      window.dataLayer.push({
        event: "add_to_cart",
        ecommerce: {
          currency: currency_code,
          value: value,
          items: [
            {
              item_id: item_id,
              item_name: item_name,
              currency: currency_code,
              index: position,
              item_brand: item_brand,
              item_category: item_category,
              item_list_name: item_list_name,
              item_variant: item_variant,
              contract_id: contract_id,
              price: price,
              quantity: quantity,
              primary_number: primary_number,
            },
          ],
        },
      });
    },

    // DOR-60149 Roaming landing page packages and detail page packages
    roamingPack: function (eventAction, eventLabel, packageName, price) {

      var quicklinkcontractId = $("#my-account-dropdown").find(".dropdown-content .user-details span#cid-uuid-for-ga360").text();
      var quicklinkeMail = $("#my-account-dropdown").find(".dropdown-content .user-details span#email-for-ga360").text();

      window.dataLayer.push({
        event: "idd_roaming_pack",
        event_params: {
          eventCategory: "IDD Roaming Pack",
          eventAction: eventAction,
          eventLabel: eventLabel,
          packageName: packageName,
          price: price,
        },
        user_properties: {
          primary_number: quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // primary contract ID
          eid: quicklinkeMail != "" ? quicklinkeMail : "Not Add", // HASHED email - user level
        }
      });
      
    },

    // DOR-60149 Roaming check Packs
    iddroamingcheckPacks: function (eventLabel) {

      var quicklinkcontractId = $("#my-account-dropdown").find(".dropdown-content .user-details span#cid-uuid-for-ga360").text();
      var quicklinkeMail = $("#my-account-dropdown").find(".dropdown-content .user-details span#email-for-ga360").text();

      window.dataLayer.push({
        event: "idd_roaming_check_packs",
        event_params: {
          eventCategory: "IDD Roaming Pack",
          eventAction: "Check click",
          eventLabel: eventLabel,
        },
        user_properties: {
          primary_number: quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // primary contract ID
          eid: quicklinkeMail != "" ? quicklinkeMail : "Not Add", // HASHED email - user level
        }
      });

    },

    // DOR-60149 Roaming enter number
    iddroamingverifyNumber: function (eventAction, packageName, price) {

      var quicklinkcontractId = $("#my-account-dropdown").find(".dropdown-content .user-details span#cid-uuid-for-ga360").text();
      var quicklinkeMail = $("#my-account-dropdown").find(".dropdown-content .user-details span#email-for-ga360").text();

      window.dataLayer.push({
        event: "idd_roaming_enter_number",
        event_params: {
          eventCategory: "IDD Roaming Pack",
          eventAction: eventAction,
          eventLabel: sessionStorage.getItem('idd_roaming_country'),
          packageName: packageName,
          price: price,
        },
        user_properties: {
          primary_number: quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // primary contract ID
          eid: quicklinkeMail != "" ? quicklinkeMail : "Not Add", // HASHED email - user level
        }
      });
      
    },

    // DOR-60149 Roaming verify otp and resend pin
    iddroamingverifyOtp: function (eventAction, packageName, price) {

      var quicklinkcontractId = $("#my-account-dropdown").find(".dropdown-content .user-details span#cid-uuid-for-ga360").text();
      var quicklinkeMail = $("#my-account-dropdown").find(".dropdown-content .user-details span#email-for-ga360").text();

      window.dataLayer.push({
        event: "idd_roaming_verify_otp",
        event_params: {
          eventCategory: "IDD Roaming Pack",
          eventAction: eventAction,
          eventLabel: sessionStorage.getItem('idd_roaming_country'),
          packageName: packageName,
          price: price,
        },
        user_properties: {
          primary_number: quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // primary contract ID
          eid: quicklinkeMail != "" ? quicklinkeMail : "Not Add", // HASHED email - user level
        }
      });

    },
    
    // DOR-60149 Roaming confirm activate
    iddroamingconfirmactivate: function (eventAction, packageCategory, packageName, price) {

      var quicklinkcontractId = $("#my-account-dropdown").find(".dropdown-content .user-details span#cid-uuid-for-ga360").text();
      var quicklinkeMail = $("#my-account-dropdown").find(".dropdown-content .user-details span#email-for-ga360").text();

      window.dataLayer.push({
        event: "idd_roaming_confirm_activate",
        event_params: {
          eventCategory: "IDD Roaming Pack",
          eventAction: eventAction,
          eventLabel: sessionStorage.getItem('idd_roaming_country'),
          packageCategory: packageCategory,
          packageName: packageName,
          price: price,
          currency: "USD",
          value: price,
        },
        user_properties: {
          primary_number: quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // primary contract ID
          eid: quicklinkeMail != "" ? quicklinkeMail : "Not Add", // HASHED email - user level
        }
      });

    },

    // DOR-60149 Roaming activate success
    iddroamingactivateSuccess: function (packageCategory, packageName, price) {

      var quicklinkcontractId = $("#my-account-dropdown").find(".dropdown-content .user-details span#cid-uuid-for-ga360").text();
      var quicklinkeMail = $("#my-account-dropdown").find(".dropdown-content .user-details span#email-for-ga360").text();

      window.dataLayer.push({
        event: "idd_roaming_activate_success",
        event_params: {
          eventCategory: "IDD Roaming Pack",
          eventAction: "Activation success",
          eventLabel: sessionStorage.getItem('idd_roaming_country'),
          packageCategory: packageCategory,
          packageName: packageName,
          price: price,
          currency: "USD",
          value: price,
          transaction_id: "undefined"
        },
        user_properties: {
          primary_number: quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // primary contract ID
          eid: quicklinkeMail != "" ? quicklinkeMail : "Not Add", // HASHED email - user level
        }
      });

    },

    // DOR-60149 Roaming error
    iddroamingError: function (eventLabel) {

      var quicklinkcontractId = $("#my-account-dropdown").find(".dropdown-content .user-details span#cid-uuid-for-ga360").text();
      var quicklinkeMail = $("#my-account-dropdown").find(".dropdown-content .user-details span#email-for-ga360").text();

      window.dataLayer.push({
        event: "idd_roaming_error",
        event_params: {
          eventCategory: "IDD Roaming Pack",
          eventAction: "error",
          eventLabel: eventLabel,
          packageName: sessionStorage.getItem('idd_roaming_package_name'),
          price: sessionStorage.getItem('idd_roaming_package_price'),
        },
        user_properties: {
          primary_number: quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // primary contract ID
          eid: quicklinkeMail != "" ? quicklinkeMail : "Not Add", // HASHED email - user level
        }
      });

    },

    // DOR-60149 dtv activation select pack
    dtvactivationselectPack: function (eventAction, eventLabel, connection_type, price) {

      var quicklinkcontractId = $("#my-account-dropdown").find(".dropdown-content .user-details span#cid-uuid-for-ga360").text();
      var quicklinkeMail = $("#my-account-dropdown").find(".dropdown-content .user-details span#email-for-ga360").text();

      window.dataLayer.push({
        event: "dtv_activation_select_pack",
        event_params: {
          eventCategory: "DTV Channel Activation",
          eventAction: eventAction,
          eventLabel: eventLabel,
          connection_type: connection_type,
          price: price,
        },
        user_properties: {
          primary_number: quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // primary contract ID
          eid: quicklinkeMail != "" ? quicklinkeMail : "Not Add", // HASHED email - user level
        }
      });

    },

    // DOR-60149 dtv activation enter number
    dtvactivationenterNumber: function (eventAction, eventLabel, price) {

      var quicklinkcontractId = $("#my-account-dropdown").find(".dropdown-content .user-details span#cid-uuid-for-ga360").text();
      var quicklinkeMail = $("#my-account-dropdown").find(".dropdown-content .user-details span#email-for-ga360").text();

      window.dataLayer.push({
        event: "dtv_activation_enter_number",
        event_params: {
          eventCategory: "DTV Channel Activation",
          eventAction: eventAction,
          eventLabel: eventLabel,
          connection_type: sessionStorage.getItem('dtv_activation_connection_type'),
          price: price,
        },
        user_properties: {
          primary_number: quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // primary contract ID
          eid: quicklinkeMail != "" ? quicklinkeMail : "Not Add", // HASHED email - user level
        }
      });

    },

    // DOR-60149 dtv activation verify otp and resend pin
    dtvactivationverifyotp: function (eventAction) {

      var quicklinkcontractId = $("#my-account-dropdown").find(".dropdown-content .user-details span#cid-uuid-for-ga360").text();
      var quicklinkeMail = $("#my-account-dropdown").find(".dropdown-content .user-details span#email-for-ga360").text();

      window.dataLayer.push({
        event: "dtv_activation_verify_otp",
        event_params: {
          eventCategory: "DTV Channel Activation",
          eventAction: eventAction,
          eventLabel: sessionStorage.getItem('dtv_activation_product_title'),
          connection_type: sessionStorage.getItem('dtv_activation_connection_type'),
          price: sessionStorage.getItem('dtv_activation_price'),
        },
        user_properties: {
          primary_number: quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // primary contract ID
          eid: quicklinkeMail != "" ? quicklinkeMail : "Not Add", // HASHED email - user level
        }
      });

    },

    // DOR-60149 dtv activation confirm
    dtvactivationConfirm: function (eventactionConfirm) {

      var quicklinkcontractId = $("#my-account-dropdown").find(".dropdown-content .user-details span#cid-uuid-for-ga360").text();
      var quicklinkeMail = $("#my-account-dropdown").find(".dropdown-content .user-details span#email-for-ga360").text();

      window.dataLayer.push({
        event: "dtv_activation_confirm",
        event_params: {
          eventCategory: "DTV Channel Activation",
          eventAction: eventactionConfirm,
          eventLabel: sessionStorage.getItem('dtv_activation_product_title'),
          connection_type: sessionStorage.getItem('dtv_activation_connection_type'),
          price: sessionStorage.getItem('dtv_activation_price'),
        },
        user_properties: {
          primary_number: quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // primary contract ID
          eid: quicklinkeMail != "" ? quicklinkeMail : "Not Add", // HASHED email - user level
        }
      });

    },

    // DOR-60149 dtv activation enter pin
    // dtvactivationenterpin: function () {
     
    //   var quicklinkcontractId = $("#my-account-dropdown").find(".dropdown-content .user-details span#cid-uuid-for-ga360").text();
    //   var quicklinkeMail = $("#my-account-dropdown").find(".dropdown-content .user-details span#email-for-ga360").text();

    //   window.dataLayer.push({
    //     event: "dtv_activation_enter_pin",
    //     event_params: {
    //       eventCategory: "DTV Channel Activation",
    //       eventAction: sessionStorage.getItem('dtv_activation_product_title'),
    //       eventLabel: eventLabel,
    //       price: sessionStorage.getItem('dtv_activation_price'),
    //     },
    //     user_properties: {
    //       primary_number: quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // primary contract ID
    //       eid: quicklinkeMail != "" ? quicklinkeMail : "Not Add", // HASHED email - user level
    //     }
    //   });

    // },

    // DOR-60149 dtv activation success
    dtvactivationSuccess: function (eventAction) {

      var quicklinkcontractId = $("#my-account-dropdown").find(".dropdown-content .user-details span#cid-uuid-for-ga360").text();
      var quicklinkeMail = $("#my-account-dropdown").find(".dropdown-content .user-details span#email-for-ga360").text();

      window.dataLayer.push({
        event: "dtv_activation_success",
        event_params: {
          eventCategory: "DTV Channel Activation",
          eventAction: eventAction,
          eventLabel: sessionStorage.getItem('dtv_activation_product_title'),
          package_valid: sessionStorage.getItem('dtv_activation_package_valid_1') + ' ' + sessionStorage.getItem('dtv_activation_package_valid_2'),
          connection_type: sessionStorage.getItem('dtv_activation_connection_type'),
          price: sessionStorage.getItem('dtv_activation_price'),

        },
        user_properties: {
          primary_number: quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // primary contract ID
          eid: quicklinkeMail != "" ? quicklinkeMail : "Not Add", // HASHED email - user level
        }
      });

    },

    // DOR-60149 Quick Pay add payment info
    // addpaymentInfo: function (item_id, item_name, index, item_category, price, payment_type) {

    //   var quicklinkcontractId = $("#my-account-dropdown").find(".dropdown-content .user-details span#cid-uuid-for-ga360").text();
    //   var quicklinkMobile = $("#my-account-dropdown").find(".dropdown-content .user-details span#tele-for-ga360").text();
    //   var connection_number = jQuery("#con_number").text();

    //   jQuery.ajax({
    //     url: "/api/aes-encript-for-ga360",
    //     type: 'POST',
    //     data: {
    //       'orginal': connection_number,
    //     },
    //     success: function (response) { 
    //       connection_number = response.encription;

    //       window.dataLayer.push({
    //         event: "add_payment_info",
    //         event_params: {
    //           item_id: item_id,
    //           item_name: item_name != "" ? item_name : "undefined",
    //           currency: "LKR",
    //           index: index,
    //           item_category: item_category,
    //           item_list_name: "quickpay",
    //           price: price,
    //           quantity: "1",
    //           payment_type: payment_type,
    //         },
    //         user_properties: {
    //           contract_id: quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // primary contract ID
    //           primary_number: quicklinkMobile != "" ? quicklinkMobile : connection_number, // HASHED MSISDN - user level
    //         }
    //       });
    //     }
    //   });

    // },

    // DOR-60149 Quick Pay purchase
    // purchase: function (transaction_id, value) {

    //   var quicklinkcontractId = $("#my-account-dropdown").find(".dropdown-content .user-details span#cid-uuid-for-ga360").text();
    //   var quicklinkMobile = $("#my-account-dropdown").find(".dropdown-content .user-details span#tele-for-ga360").text();
    //   var connection_number = jQuery("#con_number").text();

    //   jQuery.ajax({
    //     url: "/api/aes-encript-for-ga360",
    //     type: 'POST',
    //     data: {
    //       'orginal': connection_number,
    //     },
    //     success: function (response) { 
    //       connection_number = response.encription;

    //       window.dataLayer.push({
    //         event: "purchase",
    //         event_params: {
    //           transaction_id: transaction_id,
    //           value: value,
    //           tax: null,
    //           shipping: null,
    //           item_id: sessionStorage.getItem("quick_pay_item_id"),
    //           item_name: sessionStorage.getItem("quick_pay_item_name"),
    //           currency: "LKR",
    //           index: sessionStorage.getItem("quick_pay_index"),
    //           item_category: sessionStorage.getItem("quick_pay_item_category"),
    //           item_list_name: "quickpay",
    //           price: sessionStorage.getItem("quick_pay_price"),
    //           quantity: "1",
    //           payment_type: sessionStorage.getItem("quick_pay_payment_type"),
    //         },
    //         user_properties: {
    //           contract_id: quicklinkcontractId != "" ? quicklinkcontractId : "Not Add", // primary contract ID
    //           primary_number: quicklinkMobile != "" ? quicklinkMobile : connection_number, // HASHED MSISDN - user level
    //         }
    //       });

    //     }
    //   });
    // },

    // DOR-60149 Quick Pay transaction fail
    // quickpaytransactionFail: function (event_label) {

    //   window.dataLayer.push({
    //     event: "quickpay_transaction_fail",
    //     event_params: {
    //       event_category: "Quick Pay",
    //       event_action: "transaction",
    //       event_label: event_label,
    //       payment_type: sessionStorage.getItem("quick_pay_payment_type"),
    //       package_type: sessionStorage.getItem("quick_pay_item_category"),
    //     }
    //   })

    // },

    // DOR-60149 Quick Pay view card
    // quickpayviewCard: function (event_action, payment_type, package_type) {

    //   window.dataLayer.push({
    //     event: "quickpay_view_card",
    //     event_params: {
    //       event_category: "Quick Pay",
    //       event_action: event_action,
    //       event_label: "Click",
    //       payment_type: payment_type,
    //       package_type: package_type,
    //     }
    //   })

    // },

    //Self Activation ID verification - error 
    
    IDverification: function (event_category, event_action, event_label, user_type, package_type, plan_selected, plan_name, plan_cost, add_on, verification_method) {

      window.dataLayer.push({
        event: "self_activation_id_verification_error",
        ecommerce: {
          items: [
            {
              'event_category': event_category,
              'event_action': event_action,
              'event_label': event_label,
              'user_type': user_type,
              'package_type': package_type,
              'plan_selected': plan_selected,
              'plan_name': plan_name,
              'plan_cost': plan_cost,
              'add_on': add_on,
              'verification_method': verification_method
            }
          ]
        }
      });
    },
  

    // Self Activation Verify Address
    VerifyAddress: function (event_category, event_action, event_label, user_type, package_type, plan_selected, plan_name, plan_cost, add_on, address_type) {

      window.dataLayer.push({
        event: "self_activation_verify_address",
        ecommerce: {
          items: [
            {
              'event_category': event_category,
              'event_action': event_action,
              'event_label': event_label,
              'user_type': user_type,
              'package_type': package_type,
              'plan_selected': plan_selected,
              'plan_name': plan_name,
              'plan_cost': plan_cost,
              'add_on': add_on,
              'address_type': address_type
            }
          ]
        }
      });
    },

    // var paymentstatus = drupalSettings.self_activation_row["payment_status"];

    // Self Activation Confirm and Pay
    ConfirmPay: function (event_category, event_action, event_label, user_type, package_type, plan_selected, plan_name, plan_cost, add_on, payment_method) {

      window.dataLayer.push({
        event: "self_activation_conifrm_pay_selection",
        ecommerce: {
          items: [
            {
              'event_category': event_category,
              'event_action': event_action,
              'event_label': event_label,
              'user_type': user_type,
              'package_type': package_type,
              'plan_selected': plan_selected,
              'plan_name': plan_name,
              'plan_cost': plan_cost,
              'add_on': add_on,
              'payment_method': payment_method
            }
          ]
        }
      });
    },

    // Self Activation Confirm and Pay - Faild
    ConfirmPayFaild: function (event_category, event_action, event_label, user_type, package_type, plan_selected, plan_name, plan_cost, add_on, payment_method, order_id, order_date) {

      window.dataLayer.push({
        event: "self_activation_failed",
        ecommerce: {
          items: [
            {
              'event_category': event_category,
              'event_action': event_action,
              'event_label': event_label,
              'user_type': user_type,
              'package_type': package_type,
              'plan_selected': plan_selected,
              'plan_name': plan_name,
              'plan_cost': plan_cost,
              'add_on': add_on,
              'payment_method': payment_method,
              'order_id': order_id,
              'order_date': order_date
            }
          ]           
        }
      });
    },
  };

  // channelPacks DOR-42761
  jQuery(document).on(
    "click",
    "#dtv-all-channel-bundles-block a.nav-link",
    function () {
      var title = $(this).text().toLowerCase();
      Drupal.behaviors.ga360.listOfchannelPacks(title, title, title);
    }
  );

  // 9.2.4 DTV SECTIONS - DOR-42150
  jQuery("body").on(
    "click",
    "#dtv-all-packages-with-carousal nav a",
    function () {
      var eId = this.getAttribute("href");
      var label = jQuery(this).html();
      Drupal.behaviors.ga360.getContent(eId, label);
    }
  );

  // 9.2.4 DTV SECTIONS - DOR-42150
  jQuery("body").on(
    "click",
    "#dtv-all-packages-with-carousal .slick-arrow",
    function () {
      var eId = jQuery("#dtv-all-packages-with-carousal nav a.active").attr(
        "href"
      );
      var label = jQuery(this).attr("id");
      Drupal.behaviors.ga360.getContent(eId, label);
    }
  );

  jQuery("#main-carousel-bottom-quick-links-section a#quick-btn").click(
    function () {
      var gTagName = jQuery(".g-tag-name").text().trim();
      var list = getListValues(gTagName);
      var label = jQuery.trim(
        jQuery(
          "#main-carousel-bottom-quick-links-section .quick-links-label"
        ).text()
      );
      var cNumber = btoa(
        jQuery.trim(
          jQuery(
            "#main-carousel-bottom-quick-links-section .quick-links-input-box input"
          ).val()
        )
      );

      Drupal.behaviors.ga360.pushDataForTopLinkGoButton(
        list[0],
        list[1],
        label,
        cNumber,
        undefined,
        undefined,
        undefined
      );
    }
  );

  jQuery("#faq-content-block .rj-accordion-header").click(function () {
    var chk_state = jQuery(
      "div.rj-accordion-body",
      jQuery(this).parent()
    ).hasClass("chk-state");
    if (!chk_state) {
      var label = jQuery.trim(jQuery(".faq-question", this).text());
      Drupal.behaviors.ga360.dataPushForFAQClick("Question", label);
    }
  });

  jQuery("#faq-content-block .rj-accordion-body a.btn").click(function () {
    var pElement = jQuery(this).parent().parent().parent().parent().parent();
    var label = jQuery.trim(
      jQuery(".rj-accordion-header .faq-question", pElement).text()
    );
    var action = jQuery.trim(jQuery(this).text());
    Drupal.behaviors.ga360.dataPushForFAQClick(action, label);
  });

  jQuery("body").on(
    "click",
    "#list-of-channels-section button.slick-arrow",
    function () {
      Drupal.behaviors.ga360.listOfChannelsDTV(
        "Navigation",
        this.getAttribute("label"),
        jQuery("#list-of-channels-section h3").text().trim()
      );
    }
  );

  jQuery("body").on(
    "click",
    "#list-of-channels-section nav .nav-tabs a",
    function () {
      var label = " Channels";
      var count = Number(jQuery("h4", this).text().trim());
      label = count + label;
      if (count == 1) label = count + " Channel";
      Drupal.behaviors.ga360.listOfChannelsDTV(
        jQuery("p", this).text().trim(),
        label,
        jQuery("#list-of-channels-section h3").text().trim()
      );
    }
  );

  jQuery("#main-carousel-bottom-quick-links-section .links a").click(
    function () {
      var gTagName = jQuery(".g-tag-name").text().trim();
      var action = jQuery(".link-sub-title p", this).text().trim();

      switch (gTagName) {
        case "in-home-landing":
          Drupal.behaviors.ga360.genericQuickLinkEvent(
            "inHomeTopPanel",
            action,
            undefined,
            undefined,
            undefined
          );
          break;
        case "dtv-landing":
          Drupal.behaviors.ga360.genericQuickLinkEvent(
            "dtvTopPanel",
            action,
            undefined,
            undefined,
            undefined
          );
          break;
        case "viu-hub-landing":
          // Data layer push function
          break;
        case "viu-mini-landing":
          Drupal.behaviors.ga360.genericQuickLinkEvent(
            "viuMiniTopPanel",
            action,
            undefined,
            undefined,
            undefined
          );
          break;
        case "hbb-landing":
          Drupal.behaviors.ga360.genericQuickLinkEvent(
            "hbbTopPanel",
            action,
            undefined,
            undefined,
            undefined
          );
          break;
        case "hbb-prepaid":
          Drupal.behaviors.ga360.genericQuickLinkEvent(
            "hbbTopPanel",
            action,
            undefined,
            undefined,
            undefined
          );
          break;
        case "hbb-postpaid":
          Drupal.behaviors.ga360.genericQuickLinkEvent(
            "hbbTopPanel",
            action,
            undefined,
            undefined,
            undefined
          );
          break;
      }
    }
  );

  jQuery("#2-container-layout-1 #entetainment-container a.btn").click(
    function () {
      var topElement = jQuery(this).closest("#2-container-layout-1");
      var label = jQuery.trim(jQuery(this).text());
      var title = jQuery.trim(jQuery(".main-title div", topElement).text());

      pushDataLayer(
        undefined,
        label,
        title,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      );
    }
  );

  jQuery("#2-container-layout-1 #offer-container a.btn").click(function () {
    var topElement = jQuery(this).closest("#2-container-layout-1");
    var action = jQuery.trim(
      jQuery("#offer-container .title div", topElement).text()
    );
    var label = jQuery.trim(jQuery(this).text());
    var title = jQuery.trim(jQuery(".main-title div", topElement).text());

    pushDataLayer(
      action,
      label,
      title,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );
  });

  jQuery(".general-container .section .cta-links a").click(function () {
    var topElement = jQuery(this).closest(".general-container");
    var action = jQuery.trim(
      jQuery(".section .section-header", topElement).text()
    );
    var label = jQuery.trim(jQuery(this).text());
    var title = jQuery.trim(jQuery(".ribbon", topElement).text());

    pushDataLayer(
      action,
      label,
      title,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );
  });

  jQuery("body").on(
    "click",
    "#carousel-container .cap-content .cta-buttons a, #carousel-container nav .slick-arrow",
    function () {
      var topElement = jQuery(this).closest("#carousel-container");
      var action = jQuery.trim(
        jQuery(
          "div.slick-active .cap-content-section .banner-title",
          topElement
        ).text()
      );
      var label = jQuery.trim(jQuery(this).text());

      if (jQuery(this).hasClass("slick-arrow"))
        label = jQuery.trim(this.getAttribute("aria-label"));

      pushDataLayer(
        action,
        label,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      );
    }
  );

  jQuery(
    "#2-container-layout-2 #content-1 a.btn, #2-container-layout-2 #content-2 a.btn"
  ).click(function () {
    var topElement = jQuery(this).closest("#content-1");

    if (jQuery(this).closest("#content-2").length)
      topElement = jQuery(this).closest("#content-2");

    var action = jQuery.trim(jQuery(".title div", topElement).text());
    var label = jQuery.trim(jQuery(this).text());

    pushDataLayer(
      action,
      label,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );
  });

  jQuery("#web_mega_menu .card-body a").click(function () {
    var topElement = "";
    var action = "";
    var label = jQuery.trim(jQuery(this).text());
    var destUrl = this.getAttribute("href");

    if (jQuery(this).hasClass("level-2")) {
      action = jQuery(this).text().trim();
    } else if (jQuery(this).hasClass("level-3")) {
      if (jQuery(this).hasClass("no-child")) {
        action = undefined;
      } else {
        topElement = jQuery(this).closest("li.has-child");
        action = jQuery("a.level-2", topElement).text().trim();
      }
    }

    if (jQuery(this).hasClass("mega-menu-in-home"))
      Drupal.behaviors.ga360.inHomeMegaMenu(
        action,
        label,
        destUrl,
        undefined,
        undefined,
        undefined
      );
  });

  // 12.1.4 HBB SECTIONS - DOR-42111
  jQuery("body").on(
    "click",
    "#hbb-packages-postpaid-w-wo-carousel .sp-promo",
    function () {
      var gTagName = jQuery(".g-tag-name").text().trim();
      var parentElement = jQuery(this).closest(".card-body");
      var action = "";
      var label = "";

      var packName =
        jQuery(".capacity", parentElement).text().trim() +
        " " +
        jQuery(".subtext-2", parentElement).text().trim();
      var price =
        jQuery(".price", parentElement).text().trim() +
        " " +
        jQuery(".duration-label", parentElement).text().trim();
      var category = jQuery(".badge-container p", parentElement).text().trim();

      if (jQuery(this).hasClass("slick-arrow"))
        label = jQuery.trim(this.getAttribute("aria-label"));

      if (gTagName == "hbb-all-packages") {
        action = jQuery(this).text().trim();
        label = jQuery("#hbb-packages-postpaid-w-wo-carousel h2").text().trim();
        Drupal.behaviors.ga360.hbbPackageSections(
          action,
          label,
          packName,
          price,
          category,
          undefined,
          undefined,
          undefined
        );
      } else {
        action = jQuery("#hbb-packages-postpaid-w-wo-carousel h2")
          .text()
          .trim();
        label = jQuery(this).text().trim();
        pushDataLayer(
          action,
          label,
          undefined,
          packName,
          price,
          category,
          undefined,
          undefined,
          undefined
        );
      }
    }
  );

  // 12.1.4 HBB SECTIONS - DOR-42111
  jQuery("body").on(
    "click",
    "#hbb-packages-postpaid-w-wo-carousel .sliding-flex-box .slick-arrow",
    function () {
      var action = jQuery("#hbb-packages-postpaid-w-wo-carousel h2")
        .text()
        .trim();
      var label = jQuery(this).attr("id").trim();
      jQuery(".card.slick-active", jQuery(this).parent()).each(function (
        index,
        element
      ) {
        var packName =
          jQuery("h4", element).text().trim() +
          " " +
          jQuery(".subtext-2", element).text().trim();
        var price =
          jQuery(".price", element).text().trim() +
          " " +
          jQuery(".duration-label", element).text().trim();
        var category = jQuery(".badge-container p", element).text().trim();

        pushDataLayer(
          action,
          label,
          undefined,
          packName,
          price,
          category,
          undefined,
          undefined,
          undefined
        );
      });
    }
  );

  // 12.1.4 HBB SECTIONS - DOR-42111
  jQuery("body").on(
    "click",
    "#hbb-packages-postpaid-w-wo-carousel .view-more-link",
    function () {
      var action = jQuery("#hbb-packages-postpaid-w-wo-carousel h2")
        .text()
        .trim();
      var label = jQuery(this).text().trim();

      pushDataLayer(
        action,
        label,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      );
    }
  );

  // 12.1.4 HBB SECTIONS - DOR-42111
  jQuery("body").on(
    "click",
    "#hbb_addon_group_all_with_carousal nav .nav-tabs a",
    function () {
      var id = jQuery(this).attr("href");
      var action = jQuery("#hbb_addon_group_all_with_carousal div h2")
        .text()
        .trim();
      var label = jQuery(this).text().trim();

      jQuery(".card.slick-active", id).each(function (index, element) {
        var title = jQuery(element).attr("pname").trim();
        pushDataLayer(
          action,
          label,
          title,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        );
      });
    }
  );

  // 12.1.4 HBB SECTIONS - DOR-42111
  jQuery("body").on(
    "click",
    "#hbb_addon_group_all_with_carousal .tab-pane .slick-arrow",
    function () {
      var action = jQuery("#hbb_addon_group_all_with_carousal div h2")
        .text()
        .trim();
      var label = jQuery(this).attr("label").trim();
      jQuery(
        "#hbb_addon_group_all_with_carousal .tab-pane.active .card.slick-active"
      ).each(function (index, element) {
        var title = jQuery(element).attr("pname").trim();
        pushDataLayer(
          action,
          label,
          title,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        );
      });
    }
  );

  // 12.1.4 HBB SECTIONS - DOR-42111
  jQuery("body").on(
    "click",
    "#hbb_addon_group_all_with_carousal .view-more-link",
    function () {
      var action = jQuery("#hbb_addon_group_all_with_carousal div h2")
        .text()
        .trim();
      var label = jQuery(this).text().trim();

      pushDataLayer(
        action,
        label,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      );
    }
  );

  // 12.1.4 HBB SECTIONS - DOR-42111
  jQuery("body").on(
    "click",
    ".hbb-add-on-group-without-carousal .view-more-link",
    function () {
      var action = jQuery(".hbb-add-on-group-without-carousal div h2")
        .text()
        .trim();
      var label = jQuery(this).text().trim();

      pushDataLayer(
        action,
        label,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      );
    }
  );

  var w = 1;
  jQuery(document).on(
    "change",
    "#hbb-pack-comparison-web .selectpicker",
    function () {
      if (w <= 3) {
        w++;
        return false;
      }
      pushGADetailsForHBBComparison(this);
      w++;
    }
  );

  var m = 1;
  jQuery(document).on(
    "change",
    "#hbb-pack-comparison-mobile .selectpicker",
    function () {
      if (m <= 2) {
        m++;
        return false;
      }
      pushGADetailsForHBBComparison(this);
      m++;
    }
  );

  function pushGADetailsForHBBComparison(obj) {
    var selectedDropdown = 0;

    var label = jQuery(obj).children("option:selected").text().trim();

    if (jQuery(obj).hasClass("package-1")) selectedDropdown = 1;
    if (jQuery(obj).hasClass("package-2")) selectedDropdown = 2;
    if (jQuery(obj).hasClass("package-3")) selectedDropdown = 3;

    setTimeout(function () {
      var price = jQuery(
        "#hbb-pack-comparison-web .monthly-rental-" + selectedDropdown
      )
        .text()
        .trim();
      var anyTimeData = jQuery(
        "#hbb-pack-comparison-web .anytime-data-" + selectedDropdown
      )
        .text()
        .trim();
      var nightTimeData = jQuery(
        "#hbb-pack-comparison-web .night-data-" + selectedDropdown
      )
        .text()
        .trim();
      var bonusData = jQuery(
        "#hbb-pack-comparison-web .bonus-data-" + selectedDropdown
      )
        .text()
        .trim();
      var gamerdata = jQuery(
        "#hbb-pack-comparison-web .gamer-data-" + selectedDropdown
      )
        .text()
        .trim();

      Drupal.behaviors.ga360.hbbPackageComparison(
        "Package Dropdown",
        label,
        price,
        anyTimeData,
        nightTimeData,
        bonusData,
        gamerdata
      );
    }, 0);
  }

  function pushDataLayer(
    action,
    label,
    title,
    pName,
    price,
    category,
    msisdn,
    primary,
    email
  ) {
    var gTagName = jQuery(".g-tag-name").text().trim();
    switch (gTagName) {
      case "in-home-landing":
        Drupal.behaviors.ga360.inHomeSections(
          action,
          label,
          title,
          msisdn,
          primary,
          email
        );
        break;
      case "dtv-landing":
        Drupal.behaviors.ga360.dtvSections(
          action,
          label,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        );
        break;
      case "viu-hub-landing":
        // Data layer push function
        break;
      case "viu-mini-landing":
        // Data layer push function
        break;
      case "hbb-landing":
        Drupal.behaviors.ga360.hbbSections(
          action,
          label,
          title,
          pName,
          price,
          category,
          msisdn,
          primary,
          email
        );
        break;
      case "hbb-prepaid":
        Drupal.behaviors.ga360.hbbSections(
          action,
          label,
          title,
          pName,
          price,
          category,
          msisdn,
          primary,
          email
        );
        break;
      case "hbb-postpaid":
        Drupal.behaviors.ga360.hbbSections(
          action,
          label,
          title,
          pName,
          price,
          category,
          msisdn,
          primary,
          email
        );
        break;
    }
  }

  function getListValues(gTagName) {
    var list = [];
    switch (gTagName) {
      case "in-home-landing":
        list = ["paybillReloadGo", "In Home"];
        break;
      case "dtv-landing":
        list = ["paybillReloadGo", "DTV"];
        break;
      case "viu-hub-landing":
        list = ["paybillReloadGo", "VIU Hub"];
        break;
      case "viu-mini-landing":
        list = ["paybillReloadGo", "VIU Mini"];
        break;
      case "hbb-landing":
        list = ["paybillReloadSearch", "HBB Landing"];
        break;
      case "hbb-prepaid":
        list = ["paybillReloadSearch", "HBB Prepaid"];
        break;
      case "hbb-postpaid":
        list = ["paybillReloadSearch", "HBB Postpaid"];
        break;
    }
    return list;
  }

  function validateEmail(email) {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  // 9.6.4 ADD TO CART DOR-42167
  //   jQuery(document).ready(function () {
  //       var gTagName = jQuery(".g-tag-name").text().trim();
  //       alert("text");
  //     switch (gTagName) {
  //       case 'dtv-product-detail':
  //         let objectSession = JSON.parse(sessionStorage.getItem('dtvga_obj'));
  //         Drupal.behaviors.ga360.productDetailCommon('All Channel Packs', objectSession);
  //         break;
  //     }
  //});

  // Product click DOR-42159
  jQuery(document).on(
    "click",
    "#dtv-all-packages-with-carousal .dtv-card a",
    function () {
      // $(this).closest('.card').siblings('.card.slick-cloned').remove();

      let pElement = jQuery(this).closest(".card-body");

      let ga360_position = jQuery(this).closest(".card").index() + 1;
      let ga360_dimension30Exists = $(this).prev().attr("style");
      let ga360_dimension30 = false;
      if (ga360_dimension30Exists == "display: flex") {
        ga360_dimension30 = true;
      }
      let ga360_dimension29 = undefined;
      let ga360_price = jQuery(".p-3:eq(0) h5", pElement)
        .text()
        .trim()
        .toLowerCase();
      let checkPriceHasNumbers = Drupal.behaviors.ga360.hasNumber(ga360_price); // check digits exists in this string.
      if (checkPriceHasNumbers) {
        ga360_price = (ga360_price.replace(/\D/g, "") / 100).toFixed(2);
      } else {
        ga360_price = "0.00";
      }
      let ga360_name = jQuery(".p-3:eq(0) h4", pElement)
        .text()
        .trim()
        .toLowerCase();
      let ga360_id = jQuery(this).attr("href").split("=").pop().toLowerCase();
      let ga360_category = jQuery(
        ".p-3:eq(0) div.badge-container p:eq(0)",
        pElement
      )
        .text()
        .trim()
        .toLowerCase();
      let ga360_variant = undefined;
      let ga360_brand = "dtv packages";

      sessionStorage.setItem("clicked_ga360_list", "tailored packages");
      sessionStorage.setItem("clicked_ga360_id", ga360_id);
      sessionStorage.setItem("clicked_ga360_name", ga360_name);
      sessionStorage.setItem("clicked_ga360_price", ga360_price);
      sessionStorage.setItem("clicked_ga360_category", ga360_category);
      sessionStorage.setItem("clicked_ga360_variant", ga360_variant);
      sessionStorage.setItem("clicked_ga360_position", ga360_position);
      sessionStorage.setItem("clicked_ga360_dimension29", ga360_dimension29);
      sessionStorage.setItem("clicked_ga360_dimension30", ga360_dimension30);

      var obj = {
        name: ga360_name,
        id: ga360_id,
        price: ga360_price,
        brand: ga360_brand,
        category: ga360_category,
        variant: ga360_variant,
        position: ga360_position,
        dimension29: ga360_dimension29,
        dimension30: ga360_dimension30,
      };
      Drupal.behaviors.ga360.productClickCommon(
        sessionStorage.getItem("clicked_ga360_list").toLowerCase(),
        obj
      );
    }
  );

  jQuery(document).on(
    "click",
    ".channel-details-section a.ga360-click-order-now",
    function () {
      let currency = $(this).attr("pcurrency").toLowerCase();

      var obj = {
        name: sessionStorage.getItem("clicked_ga360_name"),
        id: sessionStorage.getItem("clicked_ga360_id"),
        price: sessionStorage.getItem("clicked_ga360_price"),
        brand: sessionStorage.getItem("clicked_ga360_brand"),
        category: sessionStorage.getItem("clicked_ga360_category"),
        variant: sessionStorage.getItem("clicked_ga360_variant"),
        position: sessionStorage.getItem("clicked_ga360_position"),
        quantity: 1,
        dimension29: sessionStorage.getItem("clicked_ga360_dimension29"),
        dimension30: sessionStorage.getItem("clicked_ga360_dimension30"),
      };
      Drupal.behaviors.ga360.productAddToCartCommon(
        currency,
        sessionStorage.getItem("clicked_ga360_list").toLowerCase(),
        obj
      );
    }
  );

  // 9.4.3 PRODUCT DETAILS - DOR-42160
  jQuery(document).ready(function () {
    var gTagName = jQuery(".g-tag-name").text().trim();
    switch (gTagName) {
      case "dtv-product-detail":
        sessionStorage.setItem("clicked_ga360_brand", "dtv packages");
        var obj = {
          name: sessionStorage.getItem("clicked_ga360_name"),
          id: sessionStorage.getItem("clicked_ga360_id"),
          price: sessionStorage.getItem("clicked_ga360_price"),
          brand: sessionStorage.getItem("clicked_ga360_brand"),
          category: sessionStorage.getItem("clicked_ga360_category"),
          variant: sessionStorage.getItem("clicked_ga360_variant"),
          position: sessionStorage.getItem("clicked_ga360_position"),
          dimension29: sessionStorage.getItem("clicked_ga360_dimension29"),
          dimension30: sessionStorage.getItem("clicked_ga360_dimension30"),
        };
        console.log(sessionStorage.getItem("clicked_ga360_dimension29"));
        console.log(sessionStorage.getItem("clicked_ga360_dimension30"));
        console.log(sessionStorage.getItem("clicked_ga360_list"));
        Drupal.behaviors.ga360.productDetailCommon(
          sessionStorage.getItem("clicked_ga360_list"),
          obj
        );
        break;

      default:
        break;
    }
  });

  // 12.4.2 PRODUCT CLICK HBB - DOR-42124
  jQuery(document).on(
    "click",
    "#hbb-packages-postpaid-w-wo-carousel .dtv-card a",
    function () {
      // $(this).closest('.card').siblings('.card.slick-cloned').remove();

      let pElement = jQuery(this).closest(".card-body");

      let ga360_position = jQuery(this).closest(".card").index() + 1;
      //let ga360_dimension31Exists = $(this).prev().attr('style');
      // let ga360_dimension31 = false;
      // if (ga360_dimension31Exists == 'display: flex') {
      //   ga360_dimension31 = true;
      // }
      // let ga360_dimension31 = undefined;
      let ga360_price = jQuery(".p-3:eq(0) h5", pElement)
        .text()
        .trim()
        .toLowerCase();
      let checkPriceHasNumbers = Drupal.behaviors.ga360.hasNumber(ga360_price); // check digits exists in this string.
      if (checkPriceHasNumbers) {
        ga360_price = (ga360_price.replace(/\D/g, "") / 100).toFixed(2);
      } else {
        ga360_price = "0.00";
      }
      let ga360_name = jQuery(
        ".p-3:eq(0) div.badge-container p:eq(0)",
        pElement
      )
        .text()
        .trim()
        .toLowerCase();
      let ga360_id = jQuery(this).attr("href").split("=").pop().toLowerCase();
      let ga360_category = jQuery(".p-3:eq(0) h4", pElement)
        .text()
        .trim()
        .toLowerCase();
      let ga360_variant = jQuery(this).attr("nightvalues").toLowerCase();
      let ga360_brand = "HBB Packages";

      if (ga360_variant == "{{ga_data_cap_value}} {{ga_data_cap_unit}}") {
        ga360_variant = "N/A";
      }

      sessionStorage.setItem("clicked_ga360_list", "tailored packages");
      sessionStorage.setItem("clicked_ga360_id", ga360_id);
      sessionStorage.setItem("clicked_ga360_name", ga360_name);
      sessionStorage.setItem("clicked_ga360_price", ga360_price);
      sessionStorage.setItem("clicked_ga360_brand", ga360_brand);
      sessionStorage.setItem("clicked_ga360_category", ga360_category);
      sessionStorage.setItem("clicked_ga360_variant", ga360_variant);
      sessionStorage.setItem("clicked_ga360_position", ga360_position);

      var obj = {
        name: ga360_name,
        id: ga360_id,
        price: ga360_price,
        brand: ga360_brand,
        category: "Anytime Data - " + ga360_category,
        variant: "Night Data - " + ga360_variant,
        position: ga360_position,
      };
      Drupal.behaviors.ga360.productClickCommon(
        sessionStorage.getItem("clicked_ga360_list").toLowerCase(),
        obj
      );
    }
  );

  // 12.4.3 PRODUCT DETAIL HBB - DOR-42126
  jQuery(document).ready(function () {
    var gTagName = jQuery(".g-tag-name").text().trim();
    switch (gTagName) {
      case "hbb-product-detail":
        sessionStorage.setItem("clicked_ga360_brand", "HBB Packages");
        var obj = {
          name: sessionStorage.getItem("clicked_ga360_name"),
          id: sessionStorage.getItem("clicked_ga360_id"),
          price: sessionStorage.getItem("clicked_ga360_price"),
          brand: sessionStorage.getItem("clicked_ga360_brand"),
          category:
            "Anytime Data - " +
            sessionStorage.getItem("clicked_ga360_category"),
          variant:
            "Night Data - " + sessionStorage.getItem("clicked_ga360_variant"),
          position: sessionStorage.getItem("clicked_ga360_position"),
        };

        Drupal.behaviors.ga360.productDetailCommon(
          sessionStorage.getItem("clicked_ga360_list"),
          obj
        );
        break;

      default:
        break;
    }
  });

  // Product click DOR-42159
  jQuery(document).on(
    "click",
    "#dtv-channel-bundles-prepaid .card a, #dtv-channel-bundles-postpaid .card a",
    function () {
      $(this).closest(".card").siblings(".card.slick-cloned").remove();

      let pElement = jQuery(this).closest(".card-body");
      let ga36o_list = jQuery(".dtv-channel-bundles-block h2")
        .text()
        .trim()
        .replace(/\s\s+/g, " ");
      let ga360_name = jQuery("h4.pkg-see-channels-popup", pElement)
        .text()
        .trim()
        .replace(/\s\s+/g, " ");
      let ga360_id = jQuery("h4.pkg-see-channels-popup", pElement)
        .attr("data-id")
        .trim()
        .replace(/\s\s+/g, " ");
      let ga360_price = undefined;
      let ga360_brand = "dtv channel packs";
      let ga360_category = jQuery("h4.pkg-see-channels-popup", pElement)
        .attr("data-title")
        .trim()
        .replace(/\s\s+/g, " ");
      let ga360_variant = undefined;
      let ga360_position = jQuery(this).closest(".card").index() + 1;

      sessionStorage.setItem("clicked_ga360_list", ga36o_list.toLowerCase());
      sessionStorage.setItem("clicked_ga360_name", ga360_name.toLowerCase());
      sessionStorage.setItem("clicked_ga360_id", ga360_id);
      sessionStorage.setItem("clicked_ga360_price", ga360_price);
      sessionStorage.setItem("clicked_ga360_brand", ga360_brand.toLowerCase());
      sessionStorage.setItem(
        "clicked_ga360_category",
        ga360_category.toLowerCase()
      );
      sessionStorage.setItem("clicked_ga360_variant", ga360_variant);
      sessionStorage.setItem("clicked_ga360_position", ga360_position);

      var obj = {
        name: ga360_name,
        id: ga360_id,
        price: ga360_price,
        brand: ga360_brand,
        category: ga360_category,
        variant: ga360_variant,
        position: ga360_position,
      };

      Drupal.behaviors.ga360.productClickCommon(ga36o_list.toLowerCase(), obj);
    }
  );

  // DTV Packages DOR-42154
  jQuery(document).on("click", ".pkg-see-channels", function () {
    var eventaction = $(this).text();
    var eventLabel = $(this).prev("h4").text();
    var package = $(this).parent().children("div:eq(0)").find("p").text();
    var price = $(this).parent().children("h5").text();
    var specialPromotion = $(this)
      .parent()
      .next("div.card-content-section")
      .find("div p.sp-promo").length;
    var sppromo = "No";
    if (specialPromotion > 0) {
      sppromo = "Yes";
    }
    Drupal.behaviors.ga360.dtvPackages(
      eventaction,
      eventLabel,
      package,
      price,
      sppromo,
      undefined,
      undefined,
      undefined
    );
  });

  // ACTIVATE CHANNEL DOR-42143
  jQuery(document).on("click", ".ga-btn", function () {
    var prepaidDailyRentalPrice = undefined;
    var prepaidMonthlyRentalPrice = undefined;
    var postpaidRentalPrice = undefined;
    if ($(".prepaid-daily-rental").length > 0) {
      prepaidDailyRentalPrice = $(".prepaid-daily-rental").text();
    }

    if ($(".prepaid-monthly-rental").length > 0) {
      prepaidMonthlyRentalPrice = $(".prepaid-monthly-rental").text();
    }

    if ($(".postpaid-rental").length > 0) {
      postpaidRentalPrice = $(".postpaid-rental").text();
    }
    var eventAction = $(".ga-channel-name").text();

    Drupal.behaviors.ga360.activateChannel(
      eventAction,
      prepaidDailyRentalPrice,
      prepaidMonthlyRentalPrice,
      postpaidRentalPrice,
      undefined,
      undefined,
      undefined
    );
  });

  // 9.6.4 ADD TO CART DOR-42167
  jQuery(document).on(
    "click",
    "#dtv-all-channel-bundles-block .card-all-channels a",
    function () {
      var name = $(this).parent().siblings("h4.pkg-see-channels-popup").text();
      var id = $(this)
        .parent()
        .siblings("h4.pkg-see-channels-popup")
        .attr("data-id");
      var category = $(this)
        .parent()
        .siblings("h4.pkg-see-channels-popup")
        .attr("data-title");
      var price = $(this).parent().siblings("h5.price-lbl").text();
      var position = $(this).closest(".ga360-card").index() + 1;
      var currency = price.split(" ")[0];
      var obj = {
        name: name,
        id: id,
        category: category,
        price: price,
        position: position,
        brand: "DTV Channel Packs",
        variant: undefined,
      };
      sessionStorage.setItem("dtvga_currency", currency);
      sessionStorage.setItem("dtvga_obj", JSON.stringify(obj));
      Drupal.behaviors.ga360.productClickCommon("All Channel Packs", obj);
    }
  );

  // 9.6.4 ADD TO CART DOR-42167
  jQuery(document).on(
    "click",
    ".dtv-channel-bundle-summary-block .ga360-btn",
    function () {
      let objectSession = JSON.parse(sessionStorage.getItem("dtvga_obj"));
      Drupal.behaviors.ga360.productAddToCartCommon(
        sessionStorage.getItem("dtvga_currency").toLowerCase(),
        "All Channel Packs",
        objectSession
      );
    }
  );

  // 9.6.4 ADD TO CART DOR-42167
  jQuery(document).on(
    "click",
    "#dtv-channels-bundle-section .ga360-btn",
    function () {
      let objectSession = JSON.parse(sessionStorage.getItem("dtvga_obj"));
      Drupal.behaviors.ga360.productAddToCartCommon(
        sessionStorage.getItem("dtvga_currency").toLowerCase(),
        "All Channel Packs",
        objectSession
      );
    }
  );

  // 9.1.3 BUNDLE BANNER NAVIGATION DOR-42144
  jQuery(document).on(
    "click",
    "#dtv-channels-bundle-section button.slick-arrow",
    function () {
      var eventAction = jQuery(this).attr("label");
      var eventLabel = jQuery("h3.main-title").text();
      Drupal.behaviors.ga360.bundleBannerNavigation(
        eventAction,
        eventLabel,
        undefined,
        undefined,
        undefined
      );
    }
  );

  // 12.4.2 PRODUCT CLICK - DOR-42124 HBB WEB
  jQuery(document).on(
    "click",
    "#hbb-pack-comparison-web .bottom-button",
    function () {
      var selectedButton = 0;

      if (jQuery(this).hasClass("bottom-button-1")) selectedButton = 1;
      if (jQuery(this).hasClass("bottom-button-2")) selectedButton = 2;
      if (jQuery(this).hasClass("bottom-button-3")) selectedButton = 3;

      var id = jQuery("a.btn-get-package", this).attr("href");
      idValue = id.split("&", 2);
      idValue = idValue[0].split("=", 2);
      idValue = idValue[1];

      var name = jQuery("#hbb-pack-comparison-web .package-" + selectedButton)
        .children("option:selected")
        .text()
        .trim();
      var price = jQuery(
        "#hbb-pack-comparison-web .monthly-rental-" + selectedButton
      )
        .text()
        .trim();
      var brand = "HBB Packages";
      var anyData = jQuery(
        "#hbb-pack-comparison-web .anytime-data-" + selectedButton
      )
        .text()
        .trim();
      var nightData = jQuery(
        "#hbb-pack-comparison-web .night-data-" + selectedButton
      )
        .text()
        .trim();
      var position = jQuery(this).index() + 1;

      if (nightData == "-") {
        nightData = "N/A";
      }

      Drupal.behaviors.ga360.productClick(
        "Package Comparison",
        name,
        idValue,
        price,
        brand,
        anyData,
        nightData,
        position
      );
    }
  );

  // 12.4.2 PRODUCT CLICK - DOR-42124 HBB MOB
  jQuery(document).on(
    "click",
    "#hbb-pack-comparison-mobile .bottom-button",
    function () {
      var selectedButton = 0;

      if (jQuery(this).hasClass("bottom-button-1")) selectedButton = 1;
      if (jQuery(this).hasClass("bottom-button-2")) selectedButton = 2;
      if (jQuery(this).hasClass("bottom-button-3")) selectedButton = 3;

      var id = jQuery("a.btn-get-package", this).attr("href");
      idValue = id.split("&", 2);
      idValue = idValue[0].split("=", 2);
      idValue = idValue[1];

      var name = jQuery(
        "#hbb-pack-comparison-mobile .package-" + selectedButton
      )
        .children("option:selected")
        .text()
        .trim();
      var price = jQuery(
        "#hbb-pack-comparison-mobile .monthly-rental-" + selectedButton
      )
        .text()
        .trim();
      var brand = "HBB Packages";
      var anyData = jQuery(
        "#hbb-pack-comparison-mobile .anytime-data-" + selectedButton
      )
        .text()
        .trim();
      var nightData = jQuery(
        "#hbb-pack-comparison-mobile .night-data-" + selectedButton
      )
        .text()
        .trim();
      var position = jQuery(this).index() + 1;

      if (nightData == "-") {
        nightData = "N/A";
      }

      Drupal.behaviors.ga360.productClick(
        "Package Comparison",
        name,
        idValue,
        price,
        brand,
        anyData,
        nightData,
        position
      );
    }
  );

  // 12.4.2 PRODUCT CLICK - DOR-42124 HBB Other Package
  jQuery(document).on("click", "#block-hbbotherpackages .card", function () {
    var name = jQuery(this).attr("name");
    var id = jQuery(this).attr("pid");
    var price = undefined;
    var brand = "HBB Packages";
    var anyData = undefined;
    var nightData = undefined;
    var position = jQuery(this).index() + 1;

    Drupal.behaviors.ga360.productClick(
      "Other Packages",
      name,
      id,
      price,
      brand,
      anyData,
      nightData,
      position
    );
  });

  // Device View Item DOR-59422
  jQuery(document).on(
    "click",
    "#new-arrivals-list-view-grid .buy-now-button a, .view-shop-most-popular .buy-now-button a, .product-catalog-view .buy-now-button a",
    function () {
      let pElement = jQuery(this).closest(
        ".product-catalog, .product-taeser-view"
      );
      let item_id = undefined;
      let item_name = jQuery("div.field--name-title", pElement).text();
      let position = jQuery(this).closest(".views-row").index() + 1;
      let item_brand = undefined;
      let item_category = undefined;
      let item_category2 = undefined;
      let item_list_name = jQuery(
        ".field--type-viewsreference .viewsreference--view-title"
      )
        .text()
        .trim();

      if (jQuery(this).is("#new-arrivals-list-view-grid a")) {
        // Element with ID '#new-arrivals-list-view-grid' was clicked
        item_list_name = jQuery(
          ".field--type-viewsreference .viewsreference--view-title:eq(0)"
        )
          .text()
          .trim();
      } else if (jQuery(this).is(".view-shop-most-popular a")) {
        // Element with class 'view-shop-most-popular' was clicked
        item_list_name = jQuery(
          ".field--type-viewsreference .viewsreference--view-title:eq(1)"
        )
          .text()
          .trim();
      }

      let item_variant = undefined;
      let quicklinkcontractId = $("#my-account-dropdown")
        .find(".dropdown-content .user-details span#cid-uuid-for-ga360")
        .text();
      let ga360_price = jQuery("div.field--name-price", pElement).text();
      let checkPriceHasNumbers = Drupal.behaviors.ga360.hasNumber(ga360_price); // check digits exists in this string.
      if (checkPriceHasNumbers) {
        ga360_price = (ga360_price.replace(/\D/g, "") / 100).toFixed(2);
      } else {
        ga360_price = "0.00";
      }
      let quantity = "1";
      var primary_number = $("#my-account-dropdown").find(".dropdown-content .user-details span#tele-for-ga360").text();

      sessionStorage.setItem("item_id", item_id);
      sessionStorage.setItem("item_name", item_name);
      sessionStorage.setItem("position", position);
      sessionStorage.setItem("item_brand", item_brand);
      sessionStorage.setItem("item_category", item_category);
      sessionStorage.setItem("item_category2", item_category2);
      sessionStorage.setItem("item_list_name", item_list_name);
      sessionStorage.setItem("item_variant", item_variant);
      sessionStorage.setItem("quicklinkcontractId", quicklinkcontractId);
      sessionStorage.setItem("item_variant", item_variant);
      sessionStorage.setItem("ga360_price", ga360_price);

      Drupal.behaviors.ga360.deviceViewItem(
        item_id,
        item_name,
        position,
        item_brand,
        item_category,
        item_category2,
        item_list_name,
        item_variant,
        quicklinkcontractId,
        ga360_price,
        quantity,
        primary_number
      );
    }
  );

  // Device Select Item DOR-59422
  jQuery(document).on("click", ".commerce-product .add-to-cart", function () {
    let sku,
      ga360_sku,
      item_variant_color,
      element,
      item_category_type = undefined;
    sku = $("input[name=sku]").attr("value");

    element = document.querySelector(".color_field__swatch");
    // item_variant_color = element.style.backgroundColor;
    item_variant_color = drupalSettings.dialog_shop.cart.colour_name;
    item_category_type = drupalSettings.dialog_shop.category_type;
    item_device_lob = drupalSettings.dialog_shop.cart.lob;

    ga360_variant = sessionStorage.setItem("item_variant", item_variant_color);
    ga360_sku = sessionStorage.setItem("ga360_sku", sku);
    ga360_category = sessionStorage.setItem(
      "ga360_category",
      item_category_type
    );
    device_lob = sessionStorage.setItem("device_lob", item_device_lob);

    let item_id = sku;
    let item_name =
      sessionStorage.getItem("item_name") != "undefined"
        ? sessionStorage.getItem("item_name")
        : undefined;
    let currency_code = "LKR";
    let position =
      sessionStorage.getItem("position") != "undefined"
        ? sessionStorage.getItem("position")
        : undefined;
    let item_brand =
      sessionStorage.getItem("item_name") != "undefined"
        ? sessionStorage.getItem("item_name")
        : undefined;
    let item_category = item_category_type;
    let item_category2 = sessionStorage.getItem("item_category2");
    let item_list_name = sessionStorage.getItem("item_list_name");
    let item_variant = item_variant_color;
    let contract_id = sessionStorage.getItem("quicklinkcontractId");
    let price = sessionStorage.getItem("ga360_price");
    let quantity = "1";
    let value = sessionStorage.getItem("ga360_price");
    var primary_number = $("#my-account-dropdown").find(".dropdown-content .user-details span#tele-for-ga360").text();

    Drupal.behaviors.ga360.deviceAddtoCart(
      item_id,
      item_name,
      currency_code,
      position,
      item_brand,
      item_category,
      item_list_name,
      item_variant,
      quantity,
      contract_id,
      price,
      value,
      primary_number
    );
    // Drupal.behaviors.ga360.deviceviewCart(
    //   item_id,
    //   item_name,
    //   currency_code,
    //   position,
    //   item_brand,
    //   item_category,
    //   item_category2,
    //   item_list_name,
    //   item_variant,
    //   quantity,
    //   contract_id,
    //   price
    // );
  });

  // device view cart
  // jQuery(document).on("click", ".header-buttons .btn-cart", function () {
  // jQuery(document).ready(function () {
  //   if (jQuery('.o2a-shopping-cart-container').length) {
  //     // console.log("test device");

  //     let sku,
  //       ga360_sku,
  //       item_variant_color,
  //       element,
  //       item_category_type = undefined;
  //     sku = $("input[name=sku]").attr("value");

  //     element = document.querySelector(".color_field__swatch");
  //     // item_variant_color = element.style.backgroundColor;
  //     item_variant_color = drupalSettings.dialog_shop.cart.colour_name;
  //     item_category_type = drupalSettings.dialog_shop.category_type;
  //     item_device_lob = drupalSettings.dialog_shop.cart.lob;

  //     ga360_variant = sessionStorage.setItem("item_variant", item_variant_color);
  //     ga360_sku = sessionStorage.setItem("ga360_sku", sku);
  //     ga360_category = sessionStorage.setItem(
  //       "ga360_category",
  //       item_category_type
  //     );
  //     device_lob = sessionStorage.setItem("device_lob", item_device_lob);

  //     let item_id = sku;
  //     let item_name =
  //       sessionStorage.getItem("item_name") != "undefined"
  //         ? sessionStorage.getItem("item_name")
  //         : undefined;
  //     let currency_code = "LKR";
  //     let position =
  //       sessionStorage.getItem("position") != "undefined"
  //         ? sessionStorage.getItem("position")
  //         : undefined;
  //     let item_brand =
  //       sessionStorage.getItem("item_name") != "undefined"
  //         ? sessionStorage.getItem("item_name")
  //         : undefined;
  //     let item_category = item_category_type;
  //     let item_category2 = sessionStorage.getItem("item_category2");
  //     let item_list_name = sessionStorage.getItem("item_list_name");
  //     let item_variant = item_variant_color;
  //     let contract_id = sessionStorage.getItem("quicklinkcontractId");
  //     let price = sessionStorage.getItem("ga360_price");
  //     let quantity = "1";
  //     let value = sessionStorage.getItem("ga360_price");
  //     var primary_number = $("#my-account-dropdown").find(".dropdown-content .user-details span#tele-for-ga360").text();

  //     Drupal.behaviors.ga360.deviceviewCart(
  //       item_id,
  //       item_name,
  //       currency_code,
  //       position,
  //       item_brand,
  //       item_category,
  //       item_list_name,
  //       item_variant,
  //       quantity,
  //       contract_id,
  //       price,
  //       primary_number
  //     );
  //   }
  // });

  // DOR-60149 Roaming check Packs
  jQuery(document).on("click", "#country-wise-idd .bootstrap-autocomplete .dropdown-item.active", function () {

    var eventLabel= jQuery("#roaming-packs-country-list").val();

    Drupal.behaviors.ga360.iddroamingcheckPacks(eventLabel);
  });

  // DOR-60149 Roaming landing page packages and detail page packages
  jQuery(document).on("click", "#ga360-data .roaming-button-text", function () {
    
    var pElement = jQuery(this).closest(".card");
    var eventLabel= jQuery("#roaming-packs-country-list").val();
    var packageName = jQuery(".pck-title", pElement).text();
    var price = jQuery(".flex-remove-translate h5", pElement).text();
    var eventAction = jQuery(".roaming-button-text", pElement).text();

    sessionStorage.setItem("idd_roaming_country", eventLabel);

    Drupal.behaviors.ga360.roamingPack(eventAction, eventLabel, packageName, price);

  });

  // DOR-60149 Roaming enter number
  jQuery(document).on("click", "#validate-step", function () {

    if (jQuery('.roaming-services').length > 0) {

      var packageName = jQuery("#product-title").text();
      var price = jQuery("#prod-price").text();
      var eventAction = jQuery("#validate-step").text();

      Drupal.behaviors.ga360.iddroamingverifyNumber(eventAction, packageName, price);
      
    }
    
  });

  // DOR-60149 Roaming verify otp and resend pin
  jQuery(document).on("click", "#o2a-verify-otp, #resend-otp", function () {

    if (jQuery('.roaming-services').length > 0) {

      var packageName = jQuery("#product-title").text();
      var price = jQuery("#prod-price").text();

      if (jQuery(this).attr('id') == "o2a-verify-otp" ) {
        var eventAction = jQuery("#o2a-verify-otp").text();
      } else {
        var eventAction = jQuery("#resend-otp").text();
      }

      Drupal.behaviors.ga360.iddroamingverifyOtp(eventAction, packageName, price);
    }

  });

  // DOR-60149 Roaming confirm activate
  jQuery(document).on("click", ".confirm-step", function () {

    if (jQuery('.roaming-services').length > 0) {

      var eventAction = jQuery(".ga360-name").text();
      var packageCategory = jQuery(".connection_type").text();
      var packageName = jQuery(".package_name").text();
      var price = jQuery(".ga360-price").text();
      price = price.replace(/[^0-9.]/g, '');

      sessionStorage.setItem("idd_roaming_package_category", packageCategory);
      sessionStorage.setItem("idd_roaming_package_name", packageName);
      sessionStorage.setItem("idd_roaming_package_price", price);

      Drupal.behaviors.ga360.iddroamingconfirmactivate(eventAction, packageCategory, packageName, price);

      Drupal.behaviors.ga360.iddroamingactivateSuccess(packageCategory, packageName, price);
      
    }

  });

  // DOR-60149
  jQuery(document).ready(function () {

    // DOR-60149 Roaming error
    if (jQuery('.ga360-page-load').length > 0) {

      var eventLabel = jQuery(".ga360-label").text();

      Drupal.behaviors.ga360.iddroamingError(eventLabel);
    }

    // DOR-60149 Quick Pay purchase
    // if (jQuery('.quick-pay-Success-page').length > 0) {
      
    //   var transaction_id = jQuery(".transaction-id").text();
    //   var value = jQuery(".total-section .total").text();

    //   Drupal.behaviors.ga360.purchase(transaction_id, value);

    // }

    // DOR-60149 Quick Pay transaction fail
    // if (jQuery('.quick-pay-Fail-page').length > 0) {
      
    //   var event_label = jQuery(".payment-failed-title").text();
    //   event_label = event_label.replace("!", "");

    //   Drupal.behaviors.ga360.quickpaytransactionFail(event_label);

    // }

    // DOR-60149 dtv activation success
    if (jQuery('.day-pass-successful').length > 0) {

      var eventAction = jQuery(".daypass-act-successful-title").text();

      Drupal.behaviors.ga360.dtvactivationSuccess(eventAction);

    }

  });

  // DOR-60149 dtv activation select pack
  jQuery(document).on("click", ".dtv-day-pass-section .ga360-dtv-pass", function () {

    var pElement = jQuery(this).closest(".card");
    var eventAction= jQuery(".ga360-dtv-pass", pElement).text();
    var eventLabel= jQuery(".pak-name", pElement).text();
    var connection_type= jQuery(".common-nav-tab .nav-link.active h5").text();
    var price = jQuery(".day-pass-price", pElement).text();

    var package_valid_1 = jQuery(".daypass-valid-text-1", pElement).text();
    var package_valid_2 = jQuery(".daypass-valid-text-2", pElement).text();

    sessionStorage.setItem("dtv_activation_package_valid_1", package_valid_1);
    sessionStorage.setItem("dtv_activation_package_valid_2", package_valid_2);

    sessionStorage.setItem("dtv_activation_connection_type", connection_type);

    Drupal.behaviors.ga360.dtvactivationselectPack(eventAction, eventLabel, connection_type, price);
  });

  // DOR-60149 dtv activation enter number
  jQuery(document).on("click", "#validate-step", function () {

    if (jQuery('.dtv-day-pass').length > 0) {

      var eventAction = jQuery("#flow-stepper").find(".activation-flow.activated").text();
      var eventLabel = jQuery("#product-title").text();
      var price = jQuery("#prod-price").text();

      sessionStorage.setItem("dtv_activation_product_title", eventLabel);
      sessionStorage.setItem("dtv_activation_price", price);

      Drupal.behaviors.ga360.dtvactivationenterNumber(eventAction, eventLabel, price);

    }

  });

  // DOR-60149 dtv activation verify otp and resend pin
  jQuery(document).on("click", "#o2a-verify-otp, #resend-otp", function () {

    if (jQuery('.dtv-day-pass').length > 0) {

      if (jQuery(this).attr('id') == "o2a-verify-otp" ) {
        var eventAction = jQuery("#o2a-verify-otp").text();
      } else {
        var eventAction = jQuery("#resend-otp").text();
      }

      Drupal.behaviors.ga360.dtvactivationverifyotp(eventAction);

    }

  });

  // DOR-60149 dtv activation confirm
  jQuery(document).on("click", ".confirm-step", function () {

    if (jQuery('.dtv-day-pass').length > 0) {

      var eventactionConfirm = jQuery(".dtv-day-pass-confirm").text();

      Drupal.behaviors.ga360.dtvactivationConfirm(eventactionConfirm);

    }

  });

  // DOR-60149 Quick Pay add payment info
  // $('.paybill-reload-page #order-confirm').on('click', function () {

  //   var index = jQuery(".packages-cards .card.active-card").index() + 1;
  //   var price_val = jQuery("#nav-tabContent .active .ga360-price").val();
  //   var price_card = jQuery(".packages-cards .card.active-card .ga360-price").text();

  //   if (price_val) {
  //     var price = price_val;
  //   }
  //   else if (price_card) {
  //     var price = price_card;
  //   }

  //   var tab_name = jQuery("#nav-tab .active").attr("tab-code");

  //   if ((tab_name == 'data_cards') || (tab_name == 'voice')) {
  //     item_id = jQuery("#package-activate-cards-1 .active-card, #package-activate-cards-2 .active-card").attr("pcode");
  //     item_name = jQuery(".packages-cards .card.active-card .ga360-pck-name").text();
  //   }

  //   if (item_id === "null") {
  //     item_id = "undefined";
  //   }

  //   if ((tab_name == 'pay_bill') || (tab_name == 'reload')) {
  //     var staticValue = "id_"; // Replace "id_" with your actual static value
  //     var item_id = staticValue + parseInt(jQuery("#nav-tabContent .tab-pane.active .ga360-price").val());
  //   }

  //   if (tab_name == 'pay_bill') {
  //     item_name = "Pay Bill - paybill";
  //   }
  //   else if (tab_name == 'reload') {
  //     item_name = "Reload - reload";
  //   }

  //   var item_category = jQuery("#nav-tab .active").text();
  //   var payment_type = jQuery(".card-payment-method.active-card .ga360-method-name").text();
    
  //   sessionStorage.setItem("quick_pay_item_id", item_id);
  //   sessionStorage.setItem("quick_pay_item_name", item_name);
  //   sessionStorage.setItem("quick_pay_index", index);
  //   sessionStorage.setItem("quick_pay_item_category", item_category);
  //   sessionStorage.setItem("quick_pay_price", price);
  //   sessionStorage.setItem("quick_pay_payment_type", payment_type);

  //   Drupal.behaviors.ga360.addpaymentInfo(item_id, item_name, index, item_category, price, payment_type);

  // });

  // DOR-60149 Quick Pay view card
  // jQuery(document).on("click", ".paybill-reload-page .ga360-view-card", function () {

  //   var package_type = jQuery("#nav-tab .active").text();
  //   var event_action = jQuery("#nav-tabContent .active.show .ga360-view-card").text();

  //   var element = $(".card-payment-method");

  //   if (element.hasClass("active-card")) {
  //     var payment_type = jQuery(".card-payment-method.active .ga360-method-name").text();
  //   } else {
  //     var payment_type = "N/A";
  //   }

  //   Drupal.behaviors.ga360.quickpayviewCard(event_action, payment_type, package_type);
    
  // });
  
  //Self Activation ID verification - error 
  $('#id-verify-btn').on('click', function () {

    let event_category = "Self Activation";
    let event_action = "id verification";
    let event_label = "Error screen";
    var user_type = sessionStorage.getItem("clicked_ga360_user_type");
    let package_type = drupalSettings.self_activation_row["paid_mode"];
    let plan_selected = JSON.parse(drupalSettings.self_activation_row["more_data"]).packageName;
    let plan_name = sessionStorage.getItem('packageList');
    let plan_cost = Number(sessionStorage.getItem('price_ga360'))
    let add_on = sessionStorage.getItem('packageList');
    let verification_method = document.querySelector('label[for="standardInput"]').textContent.trim().split(' ')[0];
      
      Drupal.behaviors.ga360.IDverification(event_category, event_action, event_label, user_type, package_type, plan_selected, plan_name, plan_cost, add_on, verification_method);
  });

// Self Activation Verify Address
$('#nextButton2').on('click', function () {

    let event_category = "Self Activation";
    let event_action = "verify address";
    var selectedRadioButton = $("input[type='radio'][id='selfactlocal']:checked, input[type='radio'][id='selfactlocal1']:checked");
    var event_label = selectedRadioButton.siblings('label.custom-control-label').first().text();
    var user_type = sessionStorage.getItem("clicked_ga360_user_type");
    let package_type = drupalSettings.self_activation_row["paid_mode"];
    let plan_selected = JSON.parse(drupalSettings.self_activation_row["more_data"]).packageName;
    let plan_name = sessionStorage.getItem('packageList');
    let plan_cost = Number(sessionStorage.getItem('price_ga360'));
    let add_on = sessionStorage.getItem('packageList');
    var selectedRadioButton = $("input[type='radio'][id='selfactlocal']:checked, input[type='radio'][id='selfactlocal1']:checked");
    var address_type = selectedRadioButton.siblings('label.custom-control-label').first().text();
  
  Drupal.behaviors.ga360.VerifyAddress(event_category, event_action, event_label, user_type, package_type, plan_selected, plan_name, plan_cost, add_on, address_type);

});

// Self Activation Confirm and Pay
jQuery(document).on('click', '#submit-confirm-pay', function () {
  
  let event_category = "Self Activation";
  let event_action = "confirm and pay";
  let event_label = "payment selection";
  var user_type = sessionStorage.getItem("clicked_ga360_user_type");
  let package_type = drupalSettings.self_activation_row["paid_mode"];
  let plan_selected = JSON.parse(drupalSettings.self_activation_row["more_data"]).packageName;
  let plan_name = sessionStorage.getItem('packageList');
  let plan_cost = Number(sessionStorage.getItem('price_ga360'));
  let add_on = sessionStorage.getItem('packageList');
  let payment_method = drupalSettings.self_activation_row["payment_type"];
  
  Drupal.behaviors.ga360.ConfirmPay(event_category,event_action,event_label,user_type, package_type, plan_selected, plan_name, plan_cost, add_on, payment_method);

});

// Self Activation Confirm and Pay - Faild
jQuery(document).ready(function () {
  if (drupalSettings.self_activation_row["payment_status"] == "0" ) {

      let event_category = "Self Activation";
      let event_action = "confirm and pay";
      let event_label = "payment failed";
      var user_type = sessionStorage.getItem("clicked_ga360_user_type");
      let package_type = drupalSettings.self_activation_row["paid_mode"];
      let plan_selected = JSON.parse(drupalSettings.self_activation_row["more_data"]).packageName;
      let plan_name = sessionStorage.getItem('packageList');
      let plan_cost = Number(sessionStorage.getItem('price_ga360'));
      let add_on = sessionStorage.getItem('packageList');
      let payment_method = drupalSettings.self_activation_row["payment_type"];
      let order_id = undefined;
      let order_date = jQuery(".ga360-date").text().split('|')[0].trim();

      Drupal.behaviors.ga360.ConfirmPayFaild(event_category,event_action,event_label,user_type, package_type, plan_selected, plan_name, plan_cost, add_on, payment_method, order_id, order_date);
  }
});


})(jQuery, Drupal);

// Self Activation Global Page Scripting

try {
  document.getElementById("self-act-start").addEventListener("click", () => {

    // Self Activation CustomEvents triggers
    Drupal.behaviors.ga360.selfActivationStartPage()
  });
} catch { }

try {
  document.getElementById("browser-error-ok-button").addEventListener("click", () => {

    // Self Activation CustomEvents triggers
    Drupal.behaviors.ga360.selfActivationStartPageCompatabilityError()
  });
} catch { }

try {
  document.getElementById("how-to-video").addEventListener("click", () => {

    // Self Activation CustomEvents triggers
    Drupal.behaviors.ga360.selfActivationVideo()
  });
} catch {}

try {
  document.getElementById("next-pack-selection").addEventListener("click", () => {
    
    // Self Activation Ecommerce triggers
    eventParameters = Drupal.behaviors.ga360.SAItems("view_item_list")
    
    // Self Activation CustomEvents triggers
    Drupal.behaviors.ga360.selfActivationSelectPackage(eventParameters)
  });
} catch {}

try {
  document.getElementById("next-sim-details").addEventListener("click", () => {
    
    // Self Activation Ecommerce triggers
    eventParameters = Drupal.behaviors.ga360.SAItems("select_item")
    
    // Self Activation CustomEvents triggers
    Drupal.behaviors.ga360.selfActivationSimDetails(eventParameters)
  });

} catch {}

try {
  document.getElementById("next-contact-details").addEventListener("click", () => {

    // Self Activation CustomEvents triggers
    Drupal.behaviors.ga360.selfActivationContactDetails()
  });

  document.getElementById("change-contact-details").addEventListener("click", () => {

    // Self Activation CustomEvents triggers
    Drupal.behaviors.ga360.selfActivationContactDetails()
  });
} catch { }

try {
  document.getElementById("next-select-number").addEventListener("click", () => {
    
    // Self Activation Ecommerce triggers
    eventParameters = Drupal.behaviors.ga360.SAItems("add_to_cart")

    
    // Self Activation CustomEvents triggers
    Drupal.behaviors.ga360.selfActivationSelectNumber(eventParameters)
  });
} catch { }

try {
  document.getElementById("self-activation-verify-otp").addEventListener("click", () => {
    
    // Self Activation Ecommerce triggers
    eventParameters = Drupal.behaviors.ga360.SAItems("view_item")
  });
} catch { }

try {
  document.getElementById("id-verification-next").addEventListener("click", () => {
    
    // Self Activation Ecommerce triggers
    Drupal.behaviors.ga360.SAIdVerification()

  });
} catch { }

try {
  document.getElementById("nextButton2").addEventListener("click", () => {
    
    // Self Activation Ecommerce triggers
    Drupal.behaviors.ga360.SABeginCheckout()
  });
} catch { }

try {
  document.getElementById("verify-yourself-next").addEventListener("click", () => {
    
    // Self Activation Ecommerce triggers
    Drupal.behaviors.ga360.SAAddShippingInfo()
  });
}catch{}

try {

  // Self Activation Ecommerce triggers
  document.getElementById("submit-confirm-pay").addEventListener("click", Drupal.behaviors.ga360.SAAddPaymentInfo);
} catch { }

if (document.getElementById("success_icon") != null) {
  
  // Self Activation Ecommerce triggers
  Drupal.behaviors.ga360.SAPurchase();
}

