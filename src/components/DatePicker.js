import React from 'react'
import Grid from '@material-ui/core/Grid'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'

const DatePicker = (props) => {
	const { dates, setDates, setDateError } = props

	const handleStartDateChange = (date) => {
		setDates({ ...dates, start: date })
		setDateError(false)
	}

	const handleEndDateChange = (date) => {
		setDates({ ...dates, end: date })
		setDateError(false)
	}

	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils}>
			<Grid container justify='space-around'>
				<KeyboardDatePicker
					disableToolbar
					variant='inline'
					format='MM/dd/yyyy'
					margin='normal'
					id='start-date-picker'
					label='Start date'
					value={dates.start}
					onChange={handleStartDateChange}
					KeyboardButtonProps={{
						'aria-label': 'change date',
					}}
				/>
				<KeyboardDatePicker
					disableToolbar
					variant='inline'
					format='MM/dd/yyyy'
					margin='normal'
					id='end-date-picker'
					label='End date'
					value={dates.end}
					minDate={dates.start}
					onChange={handleEndDateChange}
					KeyboardButtonProps={{
						'aria-label': 'change date',
					}}
				/>
			</Grid>
		</MuiPickersUtilsProvider>
	)
}

export default DatePicker
