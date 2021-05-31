/*=========================================================================================
    File Name: form-select2.js
    Description: Select2 is a jQuery-based replacement for select boxes.
    It supports searching, remote data sets, and pagination of results.
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Pixinvent
    Author URL: hhttp://www.themeforest.net/user/pixinvent
==========================================================================================*/
(function (window, document, $) {
  'use strict';
  var selectAjax = $('.select2-data-ajax');

  FHIR.oauth2.ready().then(client => {
    // Loading remote data
    selectAjax.wrap('<div class="position-relative"></div>').select2({
      dropdownAutoWidth: true,
      dropdownParent: selectAjax.parent(),
      width: '100%',
      ajax: {
        url: 'https://fhirauth.lrwvcusn.static-test-account.isccloud.io/oauth2/Patient?_sort=-_lastUpdated',
        headers: {"authorization": `Bearer ${client.state.tokenResponse.access_token}`},
        dataType: 'json',
        delay: 250,
        data: function (params) {
          return {
            q: params.term, // search term
            page: params.page
          };
        },
        processResults: function (data, params) {
          console.log(data,params)
          // parse the results into the format expected by Select2
          // since we are using custom formatting functions we do not need to
          // alter the remote JSON data, except to indicate that infinite
          // scrolling can be used
          params.page = params.page || 1;
  
          return {
            results: data.entry.slice(1),
            pagination: {
              more: params.page * 30 < data.entry.length
            }
          };
        },
        cache: true
      },
      // placeholder: 'Search for a repository',
      escapeMarkup: function (markup) {
        return markup;
      }, // let our custom formatter work
      minimumInputLength: 1,
      templateResult: formatRepo,
      templateSelection: formatRepoSelection
    });

    function formatRepo(repo) {
      if (repo.loading) return repo.text;
  
      var markup = repo.resource.name[0].given[0];
  
      return markup;
    }
  
    function formatRepoSelection(repo) {
      return repo.resource.name[0].given[0];
    }
  })
})(window, document, jQuery);
