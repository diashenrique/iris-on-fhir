Class dc.Telegram.TelegramService Extends Ens.BusinessService
{

Parameter ADAPTER = "dc.Telegram.TelegramInboundAdapter";

Method OnProcessInput(pInput As %RegisteredObject, Output pOutput As %RegisteredObject) As %Status
{
	Set sc = $$$OK
	Try {
		Set msg = ##class(dc.Telegram.Msg.TextRequest).%New()
		If (pInput.message="") {
			Return $$$OK // skipping, if update type not equal to "message" 
		}

		Set chatbot = ##class(Telegram.ChatBot).%New()
		Set chatbot.CurrMsg = msg
		Set chatbot.CurrInput = pInput
		$$$TOE(sc, chatbot.ProcessState())
		Set msg = chatbot.CurrMsg
		If (msg.Text'="") {
			Return ..SendRequestAsync("dc.Telegram.TelegramOperation", msg)
		}
	}
	Catch ex {
		Set sc = ex.AsStatus()
	}
	Return sc
}

}
