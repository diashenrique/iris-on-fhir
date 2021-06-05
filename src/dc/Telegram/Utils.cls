/// Description
Class dc.Telegram.Utils Extends %RegisteredObject
{

/// Description
ClassMethod ParseDate(pDate) As %String
{
	Set date = ""
	Try {
		If $Length(pDate, "/") = 1 {
			// assume input of just the day
			Set day = pDate
			Set date = $ZDate($Now(), 3)
			Set $Piece(date, "-", 3) = day
		} ElseIf $Length(pDate, "/") = 2 {
			// assume input of day and month
			Set now = $ZDate($Now(), 3)
			Set year = $Piece(now, "-", 1)
			Set date = pDate_"/"_year
			Set date = $ZDate($ZDateh(date, 5), 3)
		} ElseIf $Find(pDate, "/") > 0 {
			Set date = $ZDate($ZDateh(pDate, 5), 3)
		}
	}
	Catch ex {
		Throw ##class(%Exception.General).%New("Invalid date")
	}
	Return date
}

/// Description
ClassMethod ParseTime(pTime As %String) As %String
{
	Try {
		If ($Length(pTime, ":") = 1) {
			// nn[am|pm]
			Set pTime = ..FixNextTimePart(pTime)
		}
		If ($Length(pTime, ":") = 2) {
			// nn:nn[am|pm]
			Set pTime = ..FixNextTimePart(pTime)
		}
	}
	Catch ex {
		Throw ##class(%Exception.General).%New("Invalid time")
	}
	Return pTime
}

/// Description
ClassMethod FixNextTimePart(pTime As %String) As %String
{
    Set pTime = $ZConvert(pTime, "L")
	If $Find(pTime, "am") > 0 {
		Set pTime = $Replace(pTime, "am", "")_":00am"
	} ElseIf $Find(pTime, "pm") > 0 {
		Set pTime = $Replace(pTime, "pm", "")_":00pm"
	} Else {
		Set pTime = pTime_":00"
	}
	Return $ZTime($ZTimeh(pTime, 3))
}

}
