(function (window, undefined) {
  'use strict';

  var client = fhir({
    baseUrl: 'https://fhir.lrwvcusn.static-test-account.isccloud.io',
    headers: {
      //'x-api-key': '<API_KEY>',
      'x-api-key': 'piJPZwEl4l3vYXIppt7HL7ZpMOT2Ad7K7lfln6WV',
      'accept': '*/*'
    }
  });

  $('#patientId').on('keypress', function (e) {
    if (e.which === 13) {
      fhirTest($('#patientId').val());
    }
  });

  function fhirTest(patientId) {
    $('#patient').text(`Querying patient ${patientId}...`);
    client.read({
      type: 'Patient',
      patient: patientId
    }).then((res) => {
      $('#patient').text(JSON.stringify(res, null, 2));
    }).catch((res) => {
      $('#patient').text(JSON.stringify(res, null, 2));
    });
  }

  function getName(r) {
    let name = '';
    if (r.name && r.name.length > 0) {
      if (r.name[0].given && r.name[0].given.length > 0) {
        name += `${r.name[0].given[0]} `;
      }
      if (r.name[0].family) {
        name += r.name[0].family;
      }
    }
    return name;
  }

  // Perform a search to retrieve patient list
  client.search({
      type: 'Patient',
      query: {
        _sort: '-_lastUpdated'
      }
    }).then((res) => {
      const bundle = res.data;

      $("#patient-dataTable").DataTable({
        "processing": true,
        "data": bundle.entry,
        "columns": [{
          "data": "resource.id"
        }, {
          "data": "resource.name[0].given"
        }, {
          "data": "resource.name[0].family" 
        }, {
          "data": "resource.birthDate" 
        }, {
          "data": "resource.gender" 
        }]
      });
      console.log(bundle.entry);

      bundle.entry.forEach((patient) => {
        const patientId = patient.resource.id;
        const name = getName(patient.resource);
        const tableLine = '<tr><td>' + patientId + '</td><td>' + name + '</td></tr>';
        $("#tablePatient").append(tableLine);
      });
    })
    .catch((err) => {
      // Error responses
      if (err.status) {
        console.log(err);
        console.log('Error', err.status);
      }
      // Errors
      if (err.data && err.data) {
        console.log('Error', err.data);
      }
    });





})(window);