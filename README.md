# IRIS on FHIR

IRIS on FHIR it's a SMART app to show the potencial of FHIRaaS using SMART JS Client Library

## Description

IRIS on FHIR it's our idea of how easy and simple we can work with FHIR, crafting a great UI to show the power behind FHIRaaS.

We hope that our project makes it easier for everyone to understand; we want to share knowledge and show that something good is not necessarily complicated.

We hope that our project can be used as a base/example for many others, unlocking more and more features.

## Prerequisites

Make sure you have [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [Docker desktop](https://www.docker.com/products/docker-desktop) installed.

## Installation

Clone/git pull the repo into any local directory

```
$ git clone https://github.com/intersystems-community/objectscript-docker-template.git
```

Open the terminal in this directory and run:

```
$ docker-compose build
```

3. Run the IRIS container with your project:

```
$ docker-compose up -d
```

## How to Test it

* Open in the URL in browser: [http://localhost:64755/iris-on-fhir/launch.html](http://localhost:64755/iris-on-fhir/launch.html)

* You can take advantage of the VSCode link shortcurts:

![VS Code](https://raw.githubusercontent.com/diashenrique/iris-on-fhir/master/image/vscode.png)

* The project it's using the OAuth2 feature, so you'll need an user/password:
  * user: irisonfhir
  * password: irisonfhirA1@
  
* If you want to test the application online, check it out in the link:
https://iris-on-fhir.contest.community.intersystems.com/iris-on-fhir/index.html
  * user: irisonfhir
  * password: irisonfhirA1@
## How IRIS on FHIR looks like

### Patient List

The page is a list of patients using the Resource Patient.

The data table recognizes the array provided for the Patient resource and shows a little information about the patient.

![Patient List](https://raw.githubusercontent.com/diashenrique/iris-on-fhir/master/image/patientList.png)

### Patient View

When clicking on the Patient's Given Name link, you'll be redirected to the Patient View page. A page with more information about that patient.

![Patient View](https://raw.githubusercontent.com/diashenrique/iris-on-fhir/master/image/patientView.png)

On the top, we have the patient photo, patient FHIR ID, SSN, Date of Birth, gender, contact, address, city, Country.

The middle section provide two section cards:

* Last Encounter
* Last Observations:Laboratory

The component badge pills bring the total count for the respectives cards.

![badge pill](https://raw.githubusercontent.com/diashenrique/iris-on-fhir/master/image/LabLink.png)

For the card of Observations:Laboratory the badge pill open a new page bringing the lab results.

### Lab Results

Chose one of the options in the Select box, clicking on the Search button, and you'll have the chart with the values for the selected lab test.

![Lab Tests](https://raw.githubusercontent.com/diashenrique/iris-on-fhir/master/image/LabTests.png)

Chose one of the options in the Select box, clicking on the Search button, and you'll have the chart with the values for the selected lab test.

![Chart results](https://raw.githubusercontent.com/diashenrique/iris-on-fhir/master/image/LabResultApexChart.png)

## Appointments

The appointments are shown on the calendar view, loading the information through the FHIR resource: Appointment.
![Appointments Calendar](https://raw.githubusercontent.com/diashenrique/iris-on-fhir/master/image/appointments.png)

You also can create new appointments, update, and delete them.

![Appointments CRUD](https://raw.githubusercontent.com/diashenrique/iris-on-fhir/master/image/newAppointment.png)

## How we did the complete solution

The following articles were written by my partner in this journey [@jrpereirajr](https://github.com/jrpereirajr). Check it out:  

* [FHIRaaS Overview](https://github.com/diashenrique/iris-on-fhir/blob/master/article-1-fhiraas-overview.md)
* [JS Library Appointments](https://github.com/diashenrique/iris-on-fhir/blob/master/article-2-js-library-appointments.md)

## Dream team

* [Henrique Dias](https://community.intersystems.com/user/henrique-dias-2)
* [José Roberto Pereira](https://community.intersystems.com/user/jos%C3%A9-roberto-pereira-0)
  