// SMART JS client lib tests (OAuth)
// (http://docs.smarthealthit.org/client-js)

// enable debug mode in SMART JS client lib
localStorage.debug = "FHIR.*";

$(document).ajaxError(function () {
  debugger
});

$(document).ready(function () {
  getFHIRClient()
    .then(client => {
      getPatients(client)
        .then(bundle => {
          console.log(bundle);
          return;
        });
    });
});

function getFHIRClient() {
  // return FHIR.oauth2.ready()
  //     .then(client => client);
  return expiredTokenWorkaround()
    .then(client => client);
}

function expiredTokenWorkaround() {
  return FHIR.oauth2.ready()
    .then(client => {
      const accessToken = client.state.tokenResponse.access_token;
      const refreshToken = client.state.tokenResponse.refresh_token;
      const expiresAt = client.state.expiresAt || 0;

      if (!accessToken) {
        window.location.pathname = "/iris-on-fhir/launch.html";
      }
      if (accessToken && refreshToken && expiresAt - 10 < Date.now() / 1000) {
        window.location.pathname = "/iris-on-fhir/launch.html";
      }

      return client;
    });
}

function getPatients() {
  return FHIR.oauth2.ready()
    .then(client => {
      const query = new URLSearchParams();
      query.set("_sort", "-_lastUpdated");
      // query.set("_sort", "name");
      // query.set("_count", 10);
      return client.request(`Patient?${query}`)
        .then((bundle) => {
          $("#patient-dataTable").DataTable({
            "dom": '<"d-flex justify-content-between align-items-center mx-0 row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>t<"d-flex justify-content-between mx-0 row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
            "processing": true,
            "data": bundle.entry,
            "columns": [{
              "data": "resource.id"
            }, {
              "data": "resource.name[0].given",
              "render": function (data, type, row, meta) {
                if (type === 'display') {
                  data = '<a href="patientview.html?pid=' + row.resource.id + '"><span class="font-weight-bold">' + data + '</span></a>';
                }
                return data;
              }
            }, {
              "data": "resource.name[0].family"
            }, {
              "data": "resource.birthDate"
            }, {
              "data": "resource.gender"
            }]
          });
          return bundle;
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