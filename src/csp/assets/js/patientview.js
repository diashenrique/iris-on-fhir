$(document).ready(function () {
    generateRandomAvatar();
    getFHIRClient()
        .then(client => {
            getPatientDetails(client)
                .then(bundle => {
                    // console.log("getFHIRClientBundle", bundle);
                    return;
                })
                .then(getEncounters)
                .then(getLaboratory)
                .then(getClaimsByPatient)
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
            query.set("patient", `${patientId}`)
            query.set("_sort", "-_id");
            query.set("_count", 3);

            return client.request(`Encounter?${query}`)
                .then((bundle) => {
                    $("#idQtyEncounters").text(bundle.total);
                    let arrEncounter = bundle.entry.reverse();
                    for (var i = 0; i < arrEncounter.length; i++) {
                        // console.log(i, arrEncounter[i]);
                        let reasonText = "";
                        let dtPeriod = "";
                        let strServiceProvider = "";

                        if (arrEncounter[i].resource.hasOwnProperty("reasonCode") === false) {
                            if (arrEncounter[i].resource.hasOwnProperty("type") === true) {
                                reasonText = arrEncounter[i].resource.type[0].text;
                            }
                        } else {
                            reasonText = arrEncounter[i].resource.reasonCode[0].coding[0].display;
                            // console.log(i, arrEncounter[i].resource.reasonCode[0].coding[0].display, arrEncounter[i].resource.period.start, arrEncounter[i].resource.serviceProvider.display);
                        }

                        dtPeriod = (arrEncounter[i].resource.period.start).split("T")[0];


                        if (arrEncounter[i].resource.hasOwnProperty("serviceProvider") === true) {
                            strServiceProvider = arrEncounter[i].resource.serviceProvider.display;
                            // console.log(i,arrEncounter[i].resource.type[0].text,arrEncounter[i].resource.period.start,arrEncounter[i].resource.serviceProvider.display);
                        }

                        let liTimeline1 = '<li class="timeline-item"><span class="timeline-point timeline-point-indicator"></span><div class="timeline-event"><div class="d-flex justify-content-between flex-sm-row flex-column mb-sm-0 mb-1">'
                        let liTimeline2 = `<h6>${reasonText}</h6><span class="timeline-event-time">${dtPeriod}</span></div>`
                        let liTimeline3 = `<p>${strServiceProvider}</p></div></li>`
                        let liTimeline = liTimeline1.concat(liTimeline2).concat(liTimeline3);

                        $("#idTimeline").append(liTimeline);
                    }
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

function getClaimsByPatient() {
    return FHIR.oauth2.ready()
        .then(client => {
            const urlParameters = new URLSearchParams(window.location.search);
            const patientId = urlParameters.get("pid");

            const query = new URLSearchParams();
            query.set("patient", `${patientId}`)
            query.set("_sort", "created");

            return client.request(`Claim?${query}`)
                .then((bundle) => {
                    var arrClaim = bundle.entry;
                    var arrDataClaim = [];

                    for (var i = 0; i < arrClaim.length; i++) {
                        let itens = arrClaim[i].resource.item.map(function(element, index, array){
                            var itemClaim = {};
                            itemClaim ["id"] =  arrClaim[i].resource.id;
                            itemClaim ["date"] =  arrClaim[i].resource.created;
                            itemClaim ["provider"] =  arrClaim[i].resource.provider.display;
                            itemClaim ["coverage"] =  arrClaim[i].resource.insurance[0].coverage.display;
                            itemClaim ["item"] =  array[index].productOrService.text;
                            itemClaim ["currency"] =  arrClaim[i].resource.total.currency;
                            itemClaim ["value"] =  arrClaim[i].resource.total.value;
                            itemClaim ["status"] =  arrClaim[i].resource.status;
                            arrDataClaim.push(itemClaim);
                            return element;
                        }, 80);
                    }

                    $("#claim-dataTable").DataTable({
                        "dom": '<"d-flex justify-content-between align-items-center mx-0 row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>t<"d-flex justify-content-between mx-0 row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
                        "processing": true,
                        "data": arrDataClaim,
                        "order": [
                            [0, "desc"]
                        ],
                        "columns": [{
                            "data": "id"
                        }, {
                            "data": "date",
                            "render": function (data, type, row, meta) {
                                return data.split("T")[0];
                            }
                        }, {
                            "data": "provider"
                        }, {
                            "data": "coverage"
                        }, {
                            "data": "item"
                        }, 
                        // {
                        //     "data": "currency"
                        // }, {
                        //     "data": "value",
                        //     className: "text-right",
                        //     render: $.fn.dataTable.render.number(',', '.', 2, '$')
                        // }, 
                        {
                            "data": "status"
                        }]
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

function getLaboratory() {
    return FHIR.oauth2.ready()
        .then(client => {
            const urlParameters = new URLSearchParams(window.location.search);
            const patientId = urlParameters.get("pid");

            const query = new URLSearchParams();
            query.set("patient", `${patientId}`)
            query.set("category", "laboratory")
            query.set("_sort", "-_id");
            query.set("_count", 3);

            return client.request(`Observation?${query}`)
                .then((bundle) => {
                    $("#idQtyLab").attr("onclick", `window.open("labresults.html?pid=${patientId}", '_blank');`);
                    $("#idQtyLab").attr("style", "cursor: pointer;");
                    $("#idQtyLab").text(bundle.total);
                    let arrLab = bundle.entry.reverse();                    
                    if (arrLab.length > 0) {
                        for (var i = 0; i < arrLab.length; i++) {
                            let codeName = arrLab[i].resource.code.text;
                            let valueQuantity = arrLab[i].resource.valueQuantity.value;
                            let valueUnit = arrLab[i].resource.valueQuantity.unit;
                            let dtEffectiveDate = arrLab[i].resource.effectiveDateTime.split("T")[0];

                            let liLaboratory1 = '<li class="timeline-item"><span class="timeline-point timeline-point-indicator"></span><div class="timeline-event"><div class="d-flex justify-content-between flex-sm-row flex-column mb-sm-0 mb-1">'
                            let liLaboratory2 = `<h6>${codeName}</h6><span class="timeline-event-time">${dtEffectiveDate}</span></div>`
                            let liLaboratory3 = `<p>${valueQuantity} ${valueUnit}</p></div></li>`
                            let liLaboratory = liLaboratory1.concat(liLaboratory2).concat(liLaboratory3);
                            $("#idLaboratory").append(liLaboratory);
                        }
                    } else {
                        // let liLaboratory1 = '<li class="timeline-item"><span class="timeline-point timeline-point-indicator"></span><div class="timeline-event"><div class="d-flex justify-content-between flex-sm-row flex-column mb-sm-0 mb-1">'
                        // let liLaboratory2 = `<h6></h6><span class="timeline-event-time"></span></div><p></p></div></li>`
                        // let liLaboratory3 = '<li class="timeline-item"><span class="timeline-point timeline-point-indicator"></span><div class="timeline-event"><div class="d-flex justify-content-between flex-sm-row flex-column mb-sm-0 mb-1">'
                        // let liLaboratory4 = `<h6>NO DATA</h6><span class="timeline-event-time"></span></div><p></p></div></li>`
                        // let liLaboratory5 = '<li class="timeline-item"><span class="timeline-point timeline-point-indicator"></span><div class="timeline-event"><div class="d-flex justify-content-between flex-sm-row flex-column mb-sm-0 mb-1">'
                        // let liLaboratory6 = `<h6></h6><span class="timeline-event-time"></span></div><p></p></div></li>`
                        // let liLaboratory = liLaboratory1.concat(liLaboratory2).concat(liLaboratory3).concat(liLaboratory4).concat(liLaboratory5).concat(liLaboratory6);
                        // $("#idLaboratory").append(liLaboratory);
                    }
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

function getImmunization() {
    return FHIR.oauth2.ready()
        .then(client => {
            const urlParameters = new URLSearchParams(window.location.search);
            const patientId = urlParameters.get("pid");

            const query = new URLSearchParams();
            query.set("patient", `${patientId}`)
            query.set("_sort", "-_id");
            query.set("_count", 3);

            return client.request(`Immunization?${query}`)
                .then((bundle) => {
                    console.log("getImmunization", bundle);
                    let arrImmunization = bundle.entry.reverse();
                    if (arrImmunization.length > 0) {
                        for (var i = 0; i < arrImmunization.length; i++) {
                            console.log(i, arrImmunization[i]);
                            let dtImmunization = "";
                            let strVaccine = "";
                            let stImmunization = "";

                            dtImmunization = (arrImmunization[i].resource.occurrenceDateTime).split("T")[0];
                            strVaccine = arrImmunization[i].resource.vaccineCode.text;
                            stImmunization = arrImmunization[i].resource.status;

                            let liImmunization1 = '<li class="timeline-item"><span class="timeline-point timeline-point-indicator"></span><div class="timeline-event"><div class="d-flex justify-content-between flex-sm-row flex-column mb-sm-0 mb-1">'
                            let liImmunization2 = `<h6>${strVaccine}</h6><span class="timeline-event-time">${dtImmunization}</span></div>`
                            let liImmunization3 = `<p>${stImmunization}</p></div></li>`
                            let liImmunization = liImmunization1.concat(liImmunization2).concat(liImmunization3);

                            $("#idImmunization").append(liImmunization);
                        }
                    } else {
                        let liImmunization1 = '<li class="timeline-item"><span class="timeline-point timeline-point-indicator"></span><div class="timeline-event"><div class="d-flex justify-content-between flex-sm-row flex-column mb-sm-0 mb-1">'
                        let liImmunization2 = `<h6></h6><span class="timeline-event-time"></span></div><p></p></div></li>`
                        let liImmunization3 = '<li class="timeline-item"><span class="timeline-point timeline-point-indicator"></span><div class="timeline-event"><div class="d-flex justify-content-between flex-sm-row flex-column mb-sm-0 mb-1">'
                        let liImmunization4 = `<h6>NO DATA</h6><span class="timeline-event-time"></span></div><p></p></div></li>`
                        let liImmunization5 = '<li class="timeline-item"><span class="timeline-point timeline-point-indicator"></span><div class="timeline-event"><div class="d-flex justify-content-between flex-sm-row flex-column mb-sm-0 mb-1">'
                        let liImmunization6 = `<h6></h6><span class="timeline-event-time"></span></div><p></p></div></li>`
                        let liImmunization = liImmunization1.concat(liImmunization2).concat(liImmunization3).concat(liImmunization4).concat(liImmunization5).concat(liImmunization6);
                        $("#idImmunization").append(liImmunization);
                    }
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

function generateRandomAvatar() {
    let arrAvatar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    let randomNum = Math.floor(Math.random() * arrAvatar.length);
    let strPath = `app-assets/images/avatars/${arrAvatar[randomNum]}.png`;
    $("#idAvatar").attr("src", strPath);
}