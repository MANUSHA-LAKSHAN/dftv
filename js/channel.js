(function ($, Drupal, drupalSettings) {
    Drupal.behaviors.channel = {
        attach: function (context, settings) {


            'use strict';
            var query

            $('#search-btn-submit').addClass("d-none");

            $('.advancedAutoComplete').on('autocomplete.select', function (evt, item) {
                window.location.href = drupalSettings.dtv_pdp_url + "?channel=" + item.param + "&id=" + item.id;
                Drupal.behaviors.ga360.dtvChannelSearch(item.text);
                return true;
            });

            $('.advancedAutoComplete').autoComplete({
                resolver: 'custom',
                minLength: 2,
                events: {
                    
                    search: function (qry, callback) {
                        
                        $.ajax(
                            '/data/get_channel_details/' + qry,
                        ).done(function (res) {
                            var data = [];
                            for (const [key, value] of Object.entries(res)) {
                                data.push({
                                    id: value['id'],
                                    text: value['title'],
                                    value: value['title'],
                                    param: value['param'],
                                    selected: false,
                                    imageSrc: value['img']
                                });

                            }
                            callback($.map(data, function (value, key) {
                                return {
                                    text: value.text,
                                    value: value.value,
                                    param: value.param,
                                    data: value,
                                    imageSrc: value.imageSrc,
                                    id: value.id
                                }
                            }))

                        });
                    },

                },



                formatResult: function (item) {
                    
                    var text = query ? item.text.replace(new RegExp("(" + query + ")", "gi"), '<b>$1</b>') : item.text
                    return {
                        id: item.value, text: item.text, html: text + ' <img src=' + item.imageSrc + ' width="60"' +
                            ' style="float:right"' + '>'
                    }
                },

                noResultsText: drupalSettings.no_results,

            }


            );
            $('.advancedAutoComplete').on('autocomplete.select', function (evt, item) {
                window.location.href = drupalSettings.dtv_pdp_url + "?channel=" + item.param + "&id=" + item.id;
                return true;
            });
        }
    }
})(jQuery, Drupal, drupalSettings);
