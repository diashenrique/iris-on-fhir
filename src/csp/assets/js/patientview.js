$(document).ready(function () {
    getFHIRClient()
        .then(client => {
            getPatientDetails(client)
                .then(bundle => {
                    console.log("getFHIRClientBundle", bundle);
                    return;
                })
                .then(getEncounters)
        })
        .catch(console.error);
});

function getPatientDetails() {
    return FHIR.oauth2.ready()
        .then(client => {
            const query = new URLSearchParams();
            query.set("_sort", "-_lastUpdated");

            const urlParameters = new URLSearchParams(window.location.search);
            const patientId = urlParameters.get("pid");
            // query.set("_sort", "name");
            // query.set("_count", 10);
            return client.request(`Patient/${patientId}`)
                .then((bundle) => {
                    const patientName = bundle.name[0].given[0] + " " + bundle.name[0].family
                    $("#idPatientName").text(`${patientName}`);
                    $("#idPatientID").text("Patient ID: " + bundle.id);
                    $("#idSSN").text(bundle.identifier[2].value);
                    $("#idDOB").text(bundle.birthDate);
                    $("#idGender").text(bundle.gender);
                    $("#idPhone").text(bundle.telecom[0].value);
                    $("#idAddress").text(bundle.address[0].line[0]);
                    $("#idCity").text(bundle.address[0].city + ", " + bundle.address[0].state);
                    $("#idCountry").text(bundle.address[0].country);
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

function getEncounters() {
    return FHIR.oauth2.ready()
        .then(client => {            
            const urlParameters = new URLSearchParams(window.location.search);
            const patientId = urlParameters.get("pid");
            
            const query = new URLSearchParams();
            query.set("patient",`${patientId}`)
            // query.set("_sort", "-_lastUpdated");
            query.set("_sort", "-_id");
            query.set("_count", 3);

            return client.request(`Encounter?${query}`)
                .then((bundle) => {
                    // console.log("getEncounters",bundle);
                    const arrEncounter = bundle.entry.reverse();
                    // console.log("arrEncounter",arrEncounter);
                    bundle.entry.forEach((encounter, i) => {
                        console.log(i, encounter.resource.reasonCode[0].coding[0].display);
                        
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
        });
}