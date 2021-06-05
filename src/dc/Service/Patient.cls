/// Description
Class Service.Patient Extends Service.FHIRServiceAbstract
{

/// Finds a patient by some of its identifiers (medical recornd number, SSN or driver's license)
Method GetByIdentifier(pIdentifier As %String) As %DynamicObject
{
    Set resource = ""
    Set client = ..GetHttpClient()
    Set bundle = client.GetJson($$$FormatTextJS("Patient?identifier=%1", pIdentifier))
    If (bundle.%Get("resourceType") = "Bundle") {
        If (bundle.%Get("total") > 0) {
            Set resource = bundle.%Get("entry").%Get(0).%Get("resource")
        }
    } Else {
        Throw ##class(%Exception.General).%New("Unexpected response: "_bundle.%ToJSON())
    }
    Return resource
}

}
