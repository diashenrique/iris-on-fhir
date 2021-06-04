/// A generic HTTP client
Class Service.HttpClient Extends %RegisteredObject
{

/// Description
Property Request As %Net.HttpRequest;

/// Description
Property Server As %String;

/// Description
Property SSLConfiguration As %String;

/// Description
Property ApiKey As %String;

/// Description
Method %OnNew() As %Status
{
    Set sc = $$$OK
	Set ..Request = ##class(%Net.HttpRequest).%New()
    Return sc
}

/// Description
Method SetServer(pServer As %String) As Service.HttpClient
{
    Set ..Server = pServer
	set ..Request.Server = pServer
    Return $this
}

/// Description
Method SetSSLConfiguration(pSSLConfiguration As %String) As Service.HttpClient
{
    Set ..SSLConfiguration = pSSLConfiguration
	set ..Request.SSLConfiguration = ..SSLConfiguration
	set ..Request.Https = 1 
    Return $this
}

/// Description
Method SetApiKey(pApiKey As %String) As Service.HttpClient
{
    Set ..ApiKey = pApiKey
	Do ..Request.SetHeader("x-api-key", ..ApiKey)
    Return $this
}

/// Description
Method GetJson(pPath As %String) As %DynamicAbstractObject
{
	$$$TOE(sc, ..Request.Get(pPath))
    Set resp = ..Request.HttpResponse.Data
	Set json = ""
    Try {
        Set json = ##class(%DynamicAbstractObject).%FromJSON(resp)
    }
    Catch ex {
        Set sc = ex.AsStatus()
    }
    Return json
}

/// Description
Method PostJson(pPath As %String, pData As %DynamicAbstractObject) As %DynamicAbstractObject
{
    $$$TOE(sc, ..Request.EntityBody.Clear())
    $$$TOE(sc, ..Request.EntityBody.Write(pData.%ToJSON()))
	$$$TOE(sc, ..Request.Post(pPath))
    Set resp = ..Request.HttpResponse.Data
	Set json = ""
    Try {
        Set json = ##class(%DynamicAbstractObject).%FromJSON(resp)
    }
    Catch ex {
        Set sc = ex.AsStatus()
    }
    Return json
}

ClassMethod Test()
{
    ZWrite ##class(Service.HttpClient).%New(
    ).SetServer(
        "fhir.lrwvcusn.static-test-account.isccloud.io"
    ).SetSSLConfiguration(
        "ISC.FeatureTracker.SSL.Config"
    ).SetApiKey(
        "piJPZwEl4l3vYXIppt7HL7ZpMOT2Ad7K7lfln6WV"
    ).GetJson("Patient?identifier=S99925812")
}

}
