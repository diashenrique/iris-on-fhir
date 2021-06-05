/// Description
Class Telegram.ChatBot Extends %RegisteredObject
{

/// Description
Property CurrMsg As dc.Telegram.Msg.TextRequest;

/// Description
Property CurrInput As %RegisteredObject;

/// Description
Method ProcessState() As %Status
{
    Set sc = $$$OK
    Set originalState = ..GetCurrState()
    Try {
        $$$TOE(sc, ..SwitchState())
    }
    Catch ex {
        Set sc = ex.AsStatus()
        Do ..SetCurrState(originalState)
        Set ..CurrMsg.Text = 
            "Sorry, something went wrong here."_$$$NL
            _ex.DisplayString()
    }
    Return sc
}

/// Description
Method SwitchState() As %Status
{
	Set sc = $$$OK
	Try {
		Set ..CurrMsg.ChatId = ..CurrInput.message.chat.id
		Set currState = ..GetCurrState()

		If ..IsStartToken() {
			Set currState = ""
		}

		Set sc = $Case(currState, 
			"": ..StartState(), 
			"wating_id": ..WatingIDState(),
			"wating_command": ..CommandIssuedState(),
            : "unhandled_state"
		)
        If sc = "unhandled_state" {
            If currState [ "book_appointment" {
                Set appointmentChatbot = ##class(Telegram.ChatBotAppointment).%New()
                Set appointmentChatbot.CurrMsg = ..CurrMsg
                Set appointmentChatbot.CurrInput = ..CurrInput
                Set sc = appointmentChatbot.SwitchState()
            } Else {
                Set sc = $$$ERROR("Unexpected state transiction")
            }
        }
		$$$TOE(sc, sc)
	}
	Catch ex {
		Set sc = ex.AsStatus()
	}
	Return sc
}

/// Description
Method GetChatId() As %String
{
	Throw:'$IsObject(..CurrInput) ##class(%Exception.General).%New("CurrInput is not defined")
	Set chatId = ..CurrInput.message.chat.id
	Throw:(chatId = "") ##class(%Exception.General).%New("ChatId not defined")
	Return chatId
}

/// Description
Method SetCurrState(pState As %String)
{
	Set ^TelegramChatState(..GetChatId()) = pState
}

/// Description
Method GetCurrState() As %String
{
	Return ^TelegramChatState(..GetChatId())
}

/// Description
Method SetCurrPatient(pPatient As %DynamicObject)
{
	Set ^TelegramChatState(..GetChatId(), "patient") = pPatient.%ToJSON()
}

/// Description
Method GetCurrPatient() As %DynamicObject
{
	Set json = $Get(^TelegramChatState(..GetChatId(), "patient"))
	Return:(json '= "") {}.%FromJSON(json)
	Return {}
}

/// Description
Method SetCurrAppointmentDate(pDate As %String)
{
	Set ^TelegramChatState(..GetChatId(), "date") = pDate
}

/// Description
Method GetCurrAppointmentDate() As %String
{
	Return $Get(^TelegramChatState(..GetChatId(), "date"))
}

/// Description
Method SetCurrAppointmentTime(pTime As %String)
{
	Set ^TelegramChatState(..GetChatId(), "time") = pTime
}

/// Description
Method GetCurrAppointmentTime() As %String
{
	Return $Get(^TelegramChatState(..GetChatId(), "time"))
}

/// Description
Method IsStartToken() As %Boolean
{
	Set startTokens = $Listbuild("/start", "hi", "hello", "hey")
	Set isStartToken = $Listfind(startTokens, $ZConvert(..CurrInput.message.text, "L")) > 0
	Return isStartToken
}

/// Description
Method StartState() As %Status
{
	Set sc = $$$OK
	Try {
		Quit:'..IsStartToken()

		Do ..SetCurrState("wating_id")
		Set ..CurrMsg.Text = 
			"Hi! I'm the iris-on-fhir chatbot demo."_$$$NL_
			"Please, I'm just a demo so, take it ease with me... ;)"_$$$NL_$$$NL_
			"To start, please provide me your ID: "
	}
	Catch ex {
		Set sc = ex.AsStatus()
	}
	Return sc
}

/// Description
Method WatingIDState() As %Status
{
	Set sc = $$$OK
	Try {
		Quit:(..GetCurrState() '= "wating_id")

		Set inputMsg = ..CurrInput.message.text
		Set patient = ##class(Service.Patient).%New().GetByIdentifier(inputMsg)
		If ($IsObject(patient)) {
			Do ..SetCurrState("wating_command")
			Set textMsg = 
				"OK %1, how can I help you?"_$$$NL_$$$NL_
				"To book an appointment, TYPE 1"
			#; Set ..CurrMsg.Text = $$$FormatText(textMsg, ..CurrInput.message.from."first_name")
			Set ..CurrMsg.Text = $$$FormatText(textMsg, patient.%Get("name").%Get(0).%Get("given").%Get(0))
			Do ..SetCurrPatient(patient)
		}
        Else {
			Set ..CurrMsg.Text = "Sorry, the provided ID is invalid. Please, try again:"
		}
	}
	Catch ex {
		Set sc = ex.AsStatus()
	}
	Return sc
}

/// Description
Method CommandIssuedState() As %Status
{
	Set sc = $$$OK
	Try {
		Quit:(..GetCurrState() '= "wating_command")
		
		Set inputMsg = ..CurrInput.message.text
		If (inputMsg = "1") {
            Set appointmentChatbot = ##class(Telegram.ChatBotAppointment).%New()
            Set appointmentChatbot.CurrMsg = ..CurrMsg
            Set appointmentChatbot.CurrInput = ..CurrInput
            Return appointmentChatbot.ProcessState()
		}
        Else {
			Set ..CurrMsg.Text = "Sorry, the provided option is invalid. Please, try again:"
		}
	}
	Catch ex {
		Set sc = ex.AsStatus()
	}
	Return sc
}

}
