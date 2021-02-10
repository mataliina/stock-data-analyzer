import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

const HighestVolumesList = (props) => {
	const { highestTradingVolumes } = props

	const buildVolumesGrid = () => {
		return highestTradingVolumes.map((day) => {
			return (
				<Grid container key={day.data[0]}>
					<Grid item xs={4}>
						{day.data[0]}
					</Grid>
					<Grid item xs={4}>
						{day.data[2]}
					</Grid>
					<Grid item xs={4}>
						{`$${calculatePriceChange(day.data[4], day.data[5])}`}
					</Grid>
				</Grid>
			)
		})
	}

	const calculatePriceChange = (high, low) => {
		let a = Number(high.trim().replace(',', '.').replace('$', ''))
		let b = Number(low.trim().replace(',', '.').replace('$', ''))
		return Math.round((a - b) * 10000) / 10000
	}

	return (
		<Grid container>
			<Grid item xs={4}>
				<Typography variant='h6'>Date</Typography>
			</Grid>
			<Grid item xs={4}>
				<Typography variant='h6'>Trading Volume</Typography>
			</Grid>
			<Grid item xs={4}>
				<Typography variant='h6'>Price Change</Typography>
			</Grid>
			{buildVolumesGrid()}
		</Grid>
	)
}

export default HighestVolumesList
