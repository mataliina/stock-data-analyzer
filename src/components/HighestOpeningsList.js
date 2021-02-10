import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

const HighestOpeningsList = (props) => {
	const { bestOpeningPrices } = props

	const buildBestOpeningsList = () => {
		return bestOpeningPrices.map((day) => {
			return (
				<Grid container key={day.date}>
					<Grid item xs={6}>
						{day.date}
					</Grid>
					<Grid item xs={6}>
						{Math.round(day.change * 10000) / 10000}
					</Grid>
				</Grid>
			)
		})
	}

	return (
		<Grid container>
			<Grid item xs={6}>
				<Typography variant='h6'>Date</Typography>
			</Grid>
			<Grid item xs={6}>
				<Typography variant='h6'>Price Change Percentage</Typography>
			</Grid>
			{buildBestOpeningsList()}
		</Grid>
	)
}
export default HighestOpeningsList
