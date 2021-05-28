$(document).ready(function () {
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
        return {
            id: appointment.resource.id,
            url: '',
            title: appointment.resource.description,
            start: new Date(start),
            end: new Date(end),
            allDay: false,
            // extendedProps: {
            //     calendar: 'Business'
            // }
        }
    });
}