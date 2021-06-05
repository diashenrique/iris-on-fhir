$(document).ready(function () {
    // var dataPoints = [];
    getFHIRClient()
        .then((client) => {
            getPatientDetails(client)
                .then((bundle) => {
                    // console.log("getFHIRClientBundle", bundle);
                    return;
                })
                .then(getLaboratoryTests);
        })
        .catch(console.error);
    // loadChart(dataPoints);
});

function getPatientDetails() {
    return FHIR.oauth2.ready().then((client) => {
        const query = new URLSearchParams();
        query.set("_sort", "-_lastUpdated");

        const urlParameters = new URLSearchParams(window.location.search);
        let patientId = urlParameters.get("pid");

        return client
            .request(`Patient/${patientId}`)
            .then((bundle) => {
                // console.log(bundle);
                let patientName = bundle.name[0].given[0] + " " + bundle.name[0].family;
                $("#id-fhir-patientid").val(bundle.id);
                $("#id-patient-name").val(`${patientName}`);
                $("#idDOB").val(bundle.birthDate);
            })
            .catch((err) => {
                // Error responses
                if (err.status) {
                    console.log(err);
                    console.log("Error", err.status);
                }
                // Errors
                if (err.data && err.data) {
                    console.log("Error", err.data);
                }
            });
    });
}

function getLaboratoryTests() {
    return FHIR.oauth2.ready().then((client) => {
        const urlParameters = new URLSearchParams(window.location.search);
        const patientId = urlParameters.get("pid");

        const query = new URLSearchParams();
        query.set("patient", `${patientId}`);
        query.set("category", "laboratory");

        return client
            .request(`Observation?${query}`)
            .then((bundle) => {
                // console.log("getLaboratory", bundle.entry);
                let arrLabTest = bundle.entry;
                let arrSelect2 = [];
                for (var i = 0; i < arrLabTest.length; i++) {
                    let jsonLabTest = {};
                    jsonLabTest["id"] = arrLabTest[i].resource.code.coding[0].code;
                    jsonLabTest["text"] = arrLabTest[i].resource.code.text;
                    arrSelect2.push(jsonLabTest);
                }

                var arrSelect2Unique = arrSelect2.reduceRight(function (r, a) {
                    r.some(function (b) {
                        return a.id === b.id;
                    }) || r.push(a);
                    return r;
                }, []);

                arrSelect2Unique.sort(function (a, b) {
                    var TestA = a.text.toUpperCase(); // ignore upper and lowercase
                    var TestB = b.text.toUpperCase(); // ignore upper and lowercase
                    if (TestA < TestB) {
                        return -1;
                    }
                    if (TestA > TestB) {
                        return 1;
                    }
                    return 0;
                });

                $("#select2-array").select2({
                    data: arrSelect2Unique,
                });
            })
            .catch((err) => {
                // Error responses
                if (err.status) {
                    console.log(err);
                    console.log("Error", err.status);
                }
                // Errors
                if (err.data && err.data) {
                    console.log("Error", err.data);
                }
            });
    });
}

function getLabResult() {
    console.log($("#select2-array").find(":selected").val(), $("#select2-array").find(":selected").text());

    $("#idLabTestName").text($("#select2-array").find(":selected").text());

    return FHIR.oauth2.ready().then((client) => {
        const urlParameters = new URLSearchParams(window.location.search);
        let patientId = urlParameters.get("pid");
        let codeTest = $("#select2-array").find(":selected").val();

        const query = new URLSearchParams();
        query.set("patient", `${patientId}`);
        query.set("category", "laboratory");
        query.set("code", `${codeTest}`);
        query.set("_sort", "date");

        return client
            .request(`Observation?${query}`)
            .then((observations) => {
                var arrDataPoints = [];
                var unitLabel = observations.entry[0].resource.valueQuantity.unit;
                // console.log(unitLabel);
                var arrResult = observations.entry;
                if (arrResult.length > 0) {
                    for (var i = 0; i < arrResult.length; i++) {
                        let jsonLabValues = {};
                        jsonLabValues["x"] = Date.parse(arrResult[i].resource.effectiveDateTime);
                        jsonLabValues["y"] = arrResult[i].resource.valueQuantity && arrResult[i].resource.valueQuantity.value;
                        arrDataPoints.push(jsonLabValues);
                    }
                }
                // console.log("arrDataPoints", arrDataPoints);

                let jsonData = {};
                jsonData["data"] = arrDataPoints;
                arrSerie = [];
                arrSerie.push(jsonData);
                return arrSerie
                // console.log(arrSerie);
            })
            .catch((err) => {
                // Error responses
                if (err.status) {
                    console.log(err);
                    console.log("Error", err.status);
                }
                // Errors
                if (err.data && err.data) {
                    console.log("Error", err.data);
                }
            });
    });
}

function loadChart() {
    getLabResult()
        .then((resultado) => {
            var options = {
                chart: {
                    height: 350,
                    width: "100%",
                    type: "area",
                },
                dataLabels: {
                    enabled: true
                },
                animations: {
                    initialAnimation: {
                        enabled: false
                    }
                },
                markers: {
                    size: 0,
                    style: 'hollow',
                },
                xaxis: {
                    type: 'datetime'
                },
                tooltip: {
                    x: {
                        format: 'dd MMM yyyy'
                    }
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.7,
                        opacityTo: 0.9,
                        stops: [0, 100]
                    }
                },
                series: resultado,
                noData: {
                    text: 'Choose the desired Lab Test...'
                }
            }
            var chart = new ApexCharts(document.querySelector("#chartLabResult"), options);
            chart.render();
        })
        .catch(console.error);

    


}