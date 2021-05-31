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
  var select = $('.select2'),
    selectIcons = $('.select2-icons'),
    maxLength = $('.max-length'),
    hideSearch = $('.hide-search'),
    selectArray = $('.select2-data-array'),
    selectAjax = $('.select2-data-ajax'),
    selectLg = $('.select2-size-lg'),
    selectSm = $('.select2-size-sm'),
    selectInModal = $('.select2InModal');

  select.each(function () {
    var $this = $(this);
    $this.wrap('<div class="position-relative"></div>');
    $this.select2({
      // the following code is used to disable x-scrollbar when click in select input and
      // take 100% width in responsive also
      dropdownAutoWidth: true,
      width: '100%',
      dropdownParent: $this.parent()
    });
  });

  // Select With Icon
  selectIcons.each(function () {
    var $this = $(this);
    $this.wrap('<div class="position-relative"></div>');
    $this.select2({
      dropdownAutoWidth: true,
      width: '100%',
      minimumResultsForSearch: Infinity,
      dropdownParent: $this.parent(),
      templateResult: iconFormat,
      templateSelection: iconFormat,
      escapeMarkup: function (es) {
        return es;
      }
    });
  });

  // Format icon
  function iconFormat(icon) {
    var originalOption = icon.element;
    if (!icon.id) {
      return icon.text;
    }

    var $icon = feather.icons[$(icon.element).data('icon')].toSvg() + icon.text;

    return $icon;
  }

  // Limiting the number of selections
  maxLength.wrap('<div class="position-relative"></div>').select2({
    dropdownAutoWidth: true,
    width: '100%',
    maximumSelectionLength: 2,
    dropdownParent: maxLength.parent(),
    placeholder: 'Select maximum 2 items'
  });

  // Hide Search Box
  hideSearch.select2({
    placeholder: 'Select an option',
    minimumResultsForSearch: Infinity
  });

  // Loading array data
  var data = [
    { id: 0, text: 'enhancement' },
    { id: 1, text: 'bug' },
    { id: 2, text: 'duplicate' },
    { id: 3, text: 'invalid' },
    { id: 4, text: 'wontfix' }
  ];
  window.dataArray = data

  // $('.select2-data-array').data("select2").dropdown.$search.val()
  // var newOption = new Option('test', 6, false, false);
  // $('.select2-data-array').append(newOption).trigger('change');
  // $('.select2-data-array').val(null).trigger('change');
  // $('.select2-search__field')[0].addEventListener('keydown', function(event) {console.log(event)});
  // $('.select2-search__field')[0].addEventListener('keydown', function(event) {console.log(event)}, true);

// $('.select2-data-array').on('select2:open', function (e) {
//   $('.select2-search__field')[0].addEventListener('keypress', function (event) {
//     new Promise((resolve, reject) => {
//       // setTimeout(resolve, 0);
//       FHIR.oauth2.ready()
//         .then(client => {
//           const query = new URLSearchParams();
//           query.set("_sort", "-_lastUpdated");
//           return client.request(`Patient?${query}`)
//             .then((bundle) => {
//               resolve();
//             });
//         });
//     })
//       .then(() => {
//         console.log('aqui')
//         var newElement = {
//           id: window.dataArray.length,
//           text: `item ${window.dataArray.length}`
//         };
//         window.dataArray.push(newElement)
//         var newOption = new Option(newElement.text, newElement.id, false, false);
//         $('.select2-data-array').append(newOption).trigger('change');
//         $('.select2-data-array').trigger('select2:close');
//         $('.select2-data-array').trigger('select2:open');
//         $('.select2-data-array').trigger('change');
//       })
//       .catch(console.error)
//   });
// });

  selectArray.wrap('<div class="position-relative"></div>').select2({
    dropdownAutoWidth: true,
    dropdownParent: selectArray.parent(),
    width: '100%',
    data: data
  });

// client.state.tokenResponse.access_token

// $.ajax({
//   url: "https://fhirauth.lrwvcusn.static-test-account.isccloud.io/oauth2/Patient?_sort=-_lastUpdated",headers: {"authorization": "Bearer eyJraWQiOiIxZ1RNTUFHU3U1NXJwTFdReUdQUzlJenppbk5icElBUDFHREhtK1ZpUDdvPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIzNGU0MTFlNS03MThkLTQ4Y2YtODAzNi04OTk3NzNlMDJiNTgiLCJldmVudF9pZCI6IjYyNjU1ZWZkLWU2ZDItNDY1YS05Yjc0LWIyZGU2MDc1NzY0YiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgdXNlclwvKi4qIiwiYXV0aF90aW1lIjoxNjIyNDEwNjE1LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl92TWFlQkJzQXYiLCJleHAiOjE2MjI0MTQyMTUsImlhdCI6MTYyMjQxMDYxNiwidmVyc2lvbiI6MiwianRpIjoiZGJkYjllZjYtOWQxZS00YTJhLTk2MDMtMzkyOTg2OGMzYjM4IiwiY2xpZW50X2lkIjoiM3JxNDI1ZWxtNjY2Z25tcDE4NjBsaTlhZWoiLCJ1c2VybmFtZSI6ImlyaXNvbmZoaXIifQ.uUwROwzaxJp-dcFP3FVrEKldgyehI4Skeoe8pbtmTicJjTciJNhKcxm71qOaYi0coChPkyNuNDO_zgg0xmVWb771cLLd2AI1bh10Ad8TOihNueRO_WgzVbOTtNygIj1TmxJC7HrlNarIkYeN5DL0jt16f5bQ0J3A_XnktiaxbFxqIar2m5IOJdZq849YAGOzA56vBXG149RaqJc5tiv9uly3h2abx22f07S5I732OschHo6YUhixMumsSC0B0IjzU9kYMOLx7h0rXIoCyMPU5_ZVFcu_gP-LAz0UKr0NJhdF2jb0pMGljqP5gGZzP3UnMmmUNaAycuA8wuPqj7Z6fg"}
// }).done(function(data) {
//   console.log(data);
// });

// FHIR.oauth2.ready().then(client => {
//   $.ajax({
//     url: "https://fhirauth.lrwvcusn.static-test-account.isccloud.io/oauth2/Patient?_sort=-_lastUpdated",headers: {"authorization": `Bearer ${client.state.tokenResponse.access_token}`}
//   }).done(function(data) {
//     console.log(data);
//   });
// })

  // Loading remote data
  selectAjax.wrap('<div class="position-relative"></div>').select2({
    dropdownAutoWidth: true,
    dropdownParent: selectAjax.parent(),
    width: '100%',
    ajax: {
      url: 'https://api.github.com/search/repositories',
      dataType: 'json',
      delay: 250,
      data: function (params) {
        return {
          q: params.term, // search term
          page: params.page
        };
      },
      processResults: function (data, params) {
        // parse the results into the format expected by Select2
        // since we are using custom formatting functions we do not need to
        // alter the remote JSON data, except to indicate that infinite
        // scrolling can be used
        params.page = params.page || 1;

        return {
          results: data.items,
          pagination: {
            more: params.page * 30 < data.total_count
          }
        };
      },
      cache: true
    },
    placeholder: 'Search for a repository',
    escapeMarkup: function (markup) {
      return markup;
    }, // let our custom formatter work
    minimumInputLength: 1,
    templateResult: formatRepo,
    templateSelection: formatRepoSelection
  });

  function formatRepo(repo) {
    console.log(repo)
    if (repo.loading) return repo.text;

    var markup =
      "<div class='select2-result-repository clearfix'>" +
      "<div class='select2-result-repository__avatar'><img src='" +
      repo.owner.avatar_url +
      "' /></div>" +
      "<div class='select2-result-repository__meta'>" +
      "<div class='select2-result-repository__title'>" +
      repo.full_name +
      '</div>';

    if (repo.description) {
      markup += "<div class='select2-result-repository__description'>" + repo.description + '</div>';
    }

    markup +=
      "<div class='select2-result-repository__statistics'>" +
      "<div class='select2-result-repository__forks'>" +
      feather.icons['share-2'].toSvg({ class: 'mr-50' }) +
      repo.forks_count +
      ' Forks</div>' +
      "<div class='select2-result-repository__stargazers'>" +
      feather.icons['star'].toSvg({ class: 'mr-50' }) +
      repo.stargazers_count +
      ' Stars</div>' +
      "<div class='select2-result-repository__watchers'>" +
      feather.icons['eye'].toSvg({ class: 'mr-50' }) +
      repo.watchers_count +
      ' Watchers</div>' +
      '</div>' +
      '</div></div>';

    return markup;
  }

  function formatRepoSelection(repo) {
    return repo.full_name || repo.text;
  }

  // Sizing options

  // Large
  selectLg.each(function () {
    var $this = $(this);
    $this.wrap('<div class="position-relative"></div>');
    $this.select2({
      dropdownAutoWidth: true,
      dropdownParent: $this.parent(),
      width: '100%',
      containerCssClass: 'select-lg'
    });
  });

  // Small
  selectSm.each(function () {
    var $this = $(this);
    $this.wrap('<div class="position-relative"></div>');
    $this.select2({
      dropdownAutoWidth: true,
      dropdownParent: $this.parent(),
      width: '100%',
      containerCssClass: 'select-sm'
    });
  });

  $('#select2InModal').on('shown.bs.modal', function () {
    selectInModal.select2({
      placeholder: 'Select a state'
    });
  });
})(window, document, jQuery);
