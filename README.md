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
  
## How IRIS on FHIR looks like

The appointments are shown on the calendar view, loading the information through the FHIR resource: Appointment.

![Appointments Calendar](https://raw.githubusercontent.com/diashenrique/iris-on-fhir/master/image/appointments.png)

You also can create new appointments, update, and delete them.

![Appointments CRUD](https://raw.githubusercontent.com/diashenrique/iris-on-fhir/master/image/newAppointment.png)

## Dream team

* [Henrique Dias](https://community.intersystems.com/user/henrique-dias-2)
* [José Roberto Pereira](https://community.intersystems.com/user/jos%C3%A9-roberto-pereira-0)
  