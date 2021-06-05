/// Base class for FHIR services
Class Service.FHIRServiceAbstract Extends %RegisteredObject [ Abstract ]
{

Parameter SERVER = "fhir.lrwvcusn.static-test-account.isccloud.io";

/// TODO: get a better way do store api key...
Property ApiKey As %String [ InitialExpression = "piJPZwEl4l3vYXIppt7HL7ZpMOT2Ad7K7lfln6WV" ];

Property SSLConfiguration As %String [ InitialExpression = "ISC.FeatureTracker.SSL.Config" ];

/// Description
Method GetHttpClient() As Service.HttpClient
{
    Return ##class(Service.HttpClient).%New(
        ).SetServer(
            ..#SERVER
        ).SetSSLConfiguration(
            ..SSLConfiguration
        ).SetApiKey(
            ..ApiKey
        )
}

}
