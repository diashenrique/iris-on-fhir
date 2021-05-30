$(document).ready(function () {
    window.onAddEvent = (eventData) => {
        // ignore any id
        delete eventData.id;
        console.log('onAddEvent', eventData);
        return createAppointment(eventData)
            .then(console.log)
            .catch(console.error);
    };
    window.onUpdateEvent = (eventData) => {
        console.log('onUpdateEvent', eventData);
        return updateAppointment(eventData)
            .then(console.log)
            .catch(console.error);
    };
    window.onDeleteEvent = (eventId) => {
        console.log('onDeleteEvent', eventId);
        return deleteAppointment(eventId)
            .then(console.log)
            .catch(console.error);
    };
    getFHIRClient()
        .then(client => {
            getAppointments(client)
                .then(bundle => {
                    console.log(bundle);
                    return bundle;
                })
                .then(createEvents)
                .then(_events => {
                    console.log(_events);
                    createCalendar(events.concat(_events))
                })
                .catch(console.error);
        })
        .catch(console.error);
});

function getAppointments(client) {
    // const query = new URLSearchParams();
    // query.set("_sort", "-_lastUpdated");
    return client.request(`Appointment`);
}

function createEvents(bundle) {
    const appointments = bundle.entry;
    return appointments.map(appointment => {
        let start, end;
        if (appointment.resource.requestedPeriod) {
            start = appointment.resource.requestedPeriod[0].start;
            end = appointment.resource.requestedPeriod[0].end;
        } else if (appointment.resource.status) {
            start = appointment.resource.start;
            end = appointment.resource.end;
        }
        const hasTime = {
            start: start.indexOf("T") > -1,
            end: end.indexOf("T") > -1
        }
        if (hasTime.start || hasTime.end) {
            start = new Date(start)
            end = new Date(end)
        }
        return {
            id: appointment.resource.id,
            url: '',
            title: appointment.resource.description,
            description: appointment.resource.comment,
            start: start,
            end: end,
            allDay: start === end,
            extendedProps: {
                description: appointment.resource.comment,
                calendar: 'Business'
            }
        }
    });
}

function createAppointment(eventData) {
    return new Promise((resolve, reject) => {
        const resource = setEventDataToResoruce(
            getAppointmentTemplate(), eventData
        );
        getFHIRClient()
            .then(client => {
                return client.create(resource)
                    .then(() => {
                        debugger
                        // todo: notify IS about location header without /oauth2
                    })
                    .catch((error) => {
                        // workaround for FHIRaaS location header bug on using OAuth
                        const id = /\/Appointment\/([\d]+)\/_history\/1/.exec(error)[1];
                        eventData.id = id;
                        client.request(`Appointment/${id}/_history/1`)
                            .then((bundle) => {
                                resolve(bundle);
                            })
                            .catch((error) => {
                                reject(error);
                            });
                    });
            })
            .catch((error) => reject(error));
    });
}

function updateAppointment(eventData) {
    const resource = setEventDataToResoruce(
        getAppointmentTemplate(), eventData
    );
    return getFHIRClient()
        .then(client => {
            return client.update(resource);
        });
}

function deleteAppointment(id) {
    return getFHIRClient()
        .then(client => {
            return client.delete(`Appointment/${id}`);
        });
}

function setEventDataToResoruce(resource, eventData) {
    if (eventData.id) {
        resource.id = eventData.id;
    }

    resource.description = eventData.title;
    resource.comment = eventData.extendedProps.description;
    if (!resource.comment) {
        delete resource.comment;
    }

    if (eventData.allDay) {
        eventData.start = eventData.start.split(" ")[0];
        eventData.end = eventData.end.split(" ")[0];
    }

    // todo: uderstand when use requestedPeriod array or start/end in Appointment root
    const hasTime = {
        start: eventData.start.indexOf(" ") > -1,
        end: eventData.end.indexOf(" ") > -1
    }
    if (hasTime.start || hasTime.end) {
        resource.requestedPeriod[0].start = new Date(eventData.start).toISOString();
        resource.requestedPeriod[0].end = new Date(eventData.end).toISOString();
    } else {
        resource.requestedPeriod[0].start = eventData.start;
        resource.requestedPeriod[0].end = eventData.end;
    }

    return resource;
}

function getAppointmentTemplate() {
    return {
        "resourceType": "Appointment",
        "id": "examplereq",
        "text": {
            "status": "generated",
            "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">Brian MRI results discussion</div>"
        },
        "identifier": [
            {
                "system": "http://example.org/sampleappointment-identifier",
                "value": "123"
            }
        ],
        "status": "proposed",
        "serviceCategory": [
            {
                "coding": [
                    {
                        "system": "http://example.org/service-category",
                        "code": "gp",
                        "display": "General Practice"
                    }
                ]
            }
        ],
        "specialty": [
            {
                "coding": [
                    {
                        "system": "http://snomed.info/sct",
                        "code": "394814009",
                        "display": "General practice"
                    }
                ]
            }
        ],
        "appointmentType": {
            "coding": [
                {
                    "system": "http://terminology.hl7.org/CodeSystem/v2-0276",
                    "code": "WALKIN",
                    "display": "A previously unscheduled walk-in visit"
                }
            ]
        },
        "reasonCode": [
            {
                "coding": [
                    {
                        "system": "http://snomed.info/sct",
                        "code": "413095006"
                    }
                ],
                "text": "Clinical Review"
            }
        ],
        "priority": 5,
        "description": "Discussion on the results of your recent MRI",
        "minutesDuration": 15,
        "slot": [
            {
                "reference": "Slot/example"
            }
        ],
        "created": "2015-12-02",
        "comment": "Further expand on the results of the MRI and determine the next actions that may be appropriate.",
        "participant": [
            {
                "actor": {
                    "reference": "Patient/example",
                    "display": "Peter James Chalmers"
                },
                "required": "required",
                "status": "needs-action"
            },
            {
                "type": [
                    {
                        "coding": [
                            {
                                "system": "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
                                "code": "ATND"
                            }
                        ]
                    }
                ],
                "required": "required",
                "status": "needs-action"
            },
            {
                "actor": {
                    "reference": "Location/1",
                    "display": "South Wing, second floor"
                },
                "required": "required",
                "status": "accepted"
            }
        ],
        "requestedPeriod": [
            {
                "start": "2016-06-02",
                "end": "2016-06-09"
            }
        ],
        "meta": {
            "tag": [
                {
                    "system": "http://terminology.hl7.org/CodeSystem/v3-ActReason",
                    "code": "HTEST",
                    "display": "test health data"
                }
            ]
        }
    };
}

function CRUDTest(client) {
    let resource = getAppointmentTemplate();
    // create an appointment
    client.create(resource, { includeResponse: true })
        .then(() => {
            debugger
        })
        .catch(() => {
            return client.request('Appointment/8119/_history/1')
                .then(console.log)
                .catch(console.error);
        });

    // update the appointment
    // resource.id = "8116"
    // resource.description = "Retorno consulta"
    // resource.requestedPeriod[0].start = '2021-05-30T12:00:00Z';
    // resource.requestedPeriod[0].end = '2021-05-30T13:00:00Z';
    // client.update(resource)
    //     .then(res => {
    //         debugger
    //     })
    //     .catch(() => {
    //         debugger
    //     });

    // delete the appointment
    // client.delete("Appointment/8115")
    //     .then(() => {
    //         debugger
    //     })
    //     .catch(console.error);
}