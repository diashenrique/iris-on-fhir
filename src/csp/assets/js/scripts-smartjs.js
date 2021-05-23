// SMART JS client lib tests (OAuth)
// (http://docs.smarthealthit.org/client-js)

// enable debug mode in SMART JS client lib
localStorage.debug = "FHIR.*";

$(document).ajaxError(function () {
    debugger
});

$(document).ready(function () {
    getPatients()
        .then(bundle => {
            console.log(bundle);
            populateDatagrid(bundle);
        });
});

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
                        "processing": true,
                        "data": bundle.entry,
                        "columns": [{
                            "data": "resource.id"
                        }, {
                            "data": "resource.name.0.given"
                        }, {
                            "data": "resource.name.0.family"
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

function populateDatagrid(bundle) {
    bundle.entry.forEach((patient) => {
        const patientId = patient.resource.id;
        const name = getName(patient.resource);
        const tableLine = '<tr><td>' + patientId + '</td><td>' + name + '</td></tr>';
        $("#tablePatient").append(tableLine);
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