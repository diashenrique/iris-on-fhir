/// Description
Class Telegram.ChatBotAppointment Extends Telegram.ChatBot
{

/// Description
Method ProcessState() As %Status
{
    Do ..SetCurrState("book_appointment_start")
    Return ..SwitchState()
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
			"book_appointment_start": ..BookAppointmentState(),
			"book_appointment_waiting_start_date": ..CheckAppointmentDateState(),
			"book_appointment_waiting_start_date_agreement": ..ConfirmAppointmentDateState(),
			"book_appointment_start_date_agreed": ..CheckAppointmentTimeState(),
			"book_appointment_waiting_time_agreement": ..ConfirmAppointmentTimeState(),
			"book_appointment_time_agreed": 1,
			: $$$ERROR("Unexpected state transiction")
		)
		$$$TOE(sc, sc)
	}
	Catch ex {
		Set sc = ex.AsStatus()
	}
	Return sc
}

/// Description
Method BookAppointmentState() As %Status
{
	Set sc = $$$OK
	Try {
		Quit:(..GetCurrState() '= "book_appointment_start")
		
		Do ..SetCurrState("book_appointment_waiting_start_date")
		Set inputMsg = ..CurrInput.message.text
		Set ..CurrMsg.Text = 
			"So, let's book your appointment."_$$$NL_
			"What's the date you'd like to book it?"
	}
	Catch ex {
		Set sc = ex.AsStatus()
	}
	Return sc
}

/// Description
Method CheckAppointmentDateState() As %Status
{
	Set sc = $$$OK
	Try {
		Quit:(..GetCurrState() '= "book_appointment_waiting_start_date")
		
		Do ..SetCurrState("book_appointment_waiting_start_date_agreement")
		Set inputMsg = ..CurrInput.message.text
		Set date = ##class(dc.Telegram.Utils).ParseDate(inputMsg)
		Set dateDisplay = $ZDate($ZDateh(date, 3), 5)
		Set ..CurrMsg.Text = 
			"Please, confirm the date "_dateDisplay_"? Type yes or no:"
		Do ..SetCurrAppointmentDate(date)
	}
	Catch ex {
		Set sc = ex.AsStatus()
	}
	Return sc
}

/// Description
Method ConfirmAppointmentDateState() As %Status
{
	Set sc = $$$OK
	Try {
		Quit:(..GetCurrState() '= "book_appointment_waiting_start_date_agreement")
		
		Set inputMsg = $ZConvert(..CurrInput.message.text, "L")
		If (inputMsg = "yes") {
			Do ..SetCurrState("book_appointment_start_date_agreed")
			Set ..CurrMsg.Text = 
				"And what's the time?"
		}
        ElseIf (inputMsg = "no") {
			Do ..SetCurrState("book_appointment_waiting_start_date")
			Set ..CurrMsg.Text = 
				"Ok, so what's the date you'd like to book it?"
		}
        Else {
			Set ..CurrMsg.Text = "Sorry, the provided option is invalid. Please, type yes or no:"
		}
	}
	Catch ex {
		Set sc = ex.AsStatus()
	}
	Return sc
}

/// Description
Method CheckAppointmentTimeState() As %Status
{
	Set sc = $$$OK
	Try {
		Quit:(..GetCurrState() '= "book_appointment_start_date_agreed")
		
		Do ..SetCurrState("book_appointment_waiting_time_agreement")
		Set inputMsg = $ZConvert(..CurrInput.message.text, "L")
		Set time = ##class(dc.Telegram.Utils).ParseTime(inputMsg)
		Set timeDisplay = $ZTime($ZTimeh(time), 4)
		Set ..CurrMsg.Text = 
			"Please, confirm the time "_timeDisplay_"? Type yes or no:"
		Do ..SetCurrAppointmentTime(time)
	}
	Catch ex {
		Set sc = ex.AsStatus()
	}
	Return sc
}

/// Description
Method ConfirmAppointmentTimeState() As %Status
{
	Set sc = $$$OK
	Try {
		Quit:(..GetCurrState() '= "book_appointment_waiting_time_agreement")
		
		Set inputMsg = $ZConvert(..CurrInput.message.text, "L")
		If (inputMsg = "yes") {
			Do ..SetCurrState("book_appointment_time_agreed")
			Set ..CurrMsg.Text = 
				"Ok!"
			Do ..CreateAppointment()
		}
        ElseIf (inputMsg = "no") {
			Do ..SetCurrState("book_appointment_start_date_agreed")
			Set ..CurrMsg.Text = 
				"Ok, so what's the time you'd like to book it?"
		}
        Else {
			Set ..CurrMsg.Text = "Sorry, the provided option is invalid. Please, type yes or no:"
		}
	}
	Catch ex {
		Set sc = ex.AsStatus()
	}
	Return sc
}

/// Description
Method CreateAppointment() As %Status
{
	Set appointmentData = {
		"patient": (..GetCurrPatient()),
		"toDate": (..GetCurrAppointmentDate()),
		"toTime": (..GetCurrAppointmentTime())
	}
	Set resp = ##class(Service.Appointments).%New().CreateAppointment(appointmentData)
	Set ^j($Increment(^j)) = resp
}

}
