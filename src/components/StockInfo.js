import React, { useState } from 'react'
import { Container, Typography, Paper, Button, Grid } from '@material-ui/core'
import format from 'date-fns/format'
import CsvReader from './CsvReader'
import DatePicker from './DatePicker'
import HighestVolumesList from './HighestVolumesList'
import HighestOpeningsList from './HighestOpeningsList'

const StockInfo = () => {
	const [stockData, setStockData] = useState([])
	const [dates, setDates] = useState({
		start: new Date(),
		end: new Date(),
	})
	const [longestBullishTrend, setLongestBullishTrend] = useState(null)
	const [highestTradingVolumes, setHighestTradingVolumes] = useState([])
	const [bestOpeningPrices, setBestOpeningPrices] = useState([])
	const [noDataError, setNoDataError] = useState(false)
	const [dateError, setDateError] = useState(false)

	const updateAnalyzes = () => {
		if (stockData.length === 0) {
			setNoDataError(true)
		} else {
			let filterDates = stockData.filter((row) => {
				let rowDate = Date.parse(row.data[0])

				return rowDate >= dates.start && rowDate <= dates.end
			})

			if (filterDates.length > 0) {
				getLongestBullishTrend(filterDates)
				getTradingVolumesSorted(filterDates)
				getBestOpeningPrices(stockData)
			} else {
				setDateError(true)
			}
		}
	}

	const getLongestBullishTrend = (d) => {
		let cleanedData = d.map((row) => {
			return row.data[1].trim().replace(',', '.').replace('$', '')
		})
		let prevPrice = 0
		let currentBullishTrend = 0
		let longestBullishTrend = 0
		cleanedData.forEach((price) => {
			let p = Number(price)
			if (prevPrice < p) {
				currentBullishTrend++
			} else {
				if (currentBullishTrend > longestBullishTrend) {
					longestBullishTrend = currentBullishTrend
					currentBullishTrend = 0
				}
			}
			prevPrice = p
		})
		setLongestBullishTrend(longestBullishTrend)
	}

	const compareVolumes = (a, b) => {
		const vol1 = Number(a.data[2].trim())
		const vol2 = Number(b.data[2].trim())
		let comparison = 0
		if (vol1 < vol2) {
			comparison = 1
		} else if (vol1 > vol2) {
			comparison = -1
		} else {
			const change1 = calculatePriceChange(a.data[4], a.data[5])
			const change2 = calculatePriceChange(b.data[4], b.data[5])
			if (change1 < vol2) {
				comparison = 1
			} else if (change1 > change2) {
				comparison = -1
			}
		}
		return comparison
	}

	const calculatePriceChange = (high, low) => {
		let a = Number(high.trim().replace(',', '.').replace('$', ''))
		let b = Number(low.trim().replace(',', '.').replace('$', ''))
		return Math.round((a - b) * 10000) / 10000
	}

	const getTradingVolumesSorted = (d) => {
		let sorted = d.sort(compareVolumes)
		setHighestTradingVolumes(sorted)
	}

	const getBestOpeningPrices = (d) => {
		let priceChangePercentages = []
		for (let i = 5; i < d.length; i++) {
			let sma5 = 0
			for (let j = 1; j < 6; j++) {
				sma5 += Number(d[i - j].data[1].trim().replace('$', '').replace(',', '.'))
			}
			sma5 = sma5 / 5

			let changePercentage =
				((Number(d[i].data[3].trim().replace('$', '').replace(',', '.')) - sma5) / sma5) * 100
			let dayInfo = {
				date: d[i].data[0],
				change: changePercentage,
			}
			priceChangePercentages.push(dayInfo)
		}
		let filterPriceChangeDates = priceChangePercentages.filter((day) => {
			let rowDate = Date.parse(day.date)
			return rowDate >= dates.start && rowDate <= dates.end
		})
		filterPriceChangeDates.sort((a, b) => b.change - a.change)
		setBestOpeningPrices(filterPriceChangeDates)
	}

	return (
		<Container>
			<CsvReader setStockData={setStockData} setNoDataError={setNoDataError} />
			<Grid container alignItems='center' spacing={1}>
				<Grid item xs={8}>
					<DatePicker dates={dates} setDates={setDates} setDateError={setDateError} />
				</Grid>
				<Grid item xs={4}>
					<Button onClick={updateAnalyzes} fullWidth variant='outlined'>
						Analyze
					</Button>
				</Grid>
				{noDataError && (
					<Grid item xs={12}>
						<Typography variant='h6' color='error'>
							CSV file must be uploaded
						</Typography>
					</Grid>
				)}
				{dateError && (
					<Grid item xs={12}>
						<Typography variant='h6' color='error'>
							The data does not include the selected dates. Please select new dates.
						</Typography>
					</Grid>
				)}
				{longestBullishTrend && (
					<Grid item xs={12}>
						<Paper style={{ padding: '10px' }}>
							<Typography>
								{`The longest bullish trend between ${format(dates.start, 'MM/dd/yyyy')} and ${format(
									dates.end,
									'MM/dd/yyyy'
								)} `}
							</Typography>

							<Typography variant='h6'>{`${longestBullishTrend} ${
								longestBullishTrend === 1 ? 'day' : 'days'
							}`}</Typography>
						</Paper>
					</Grid>
				)}
				{highestTradingVolumes.length > 0 && (
					<Grid item xs={12}>
						<Paper style={{ padding: '10px' }}>
							<Typography>
								{`The highest trading volumes / the most significant stock price changes within a day between ${format(
									dates.start,
									'MM/dd/yyyy'
								)} and ${format(dates.end, 'MM/dd/yyyy')}`}
							</Typography>

							<HighestVolumesList highestTradingVolumes={highestTradingVolumes} />
						</Paper>
					</Grid>
				)}
				{bestOpeningPrices.length > 0 && (
					<Grid item xs={12}>
						<Paper style={{ padding: '10px' }}>
							<Typography>
								{`The best opening prices compared to 5 days simple moving average (SMA 5) between ${format(
									dates.start,
									'MM/dd/yyyy'
								)} and ${format(dates.end, 'MM/dd/yyyy')}`}
							</Typography>
							<HighestOpeningsList bestOpeningPrices={bestOpeningPrices} />
						</Paper>
					</Grid>
				)}
			</Grid>
		</Container>
	)
}

export default StockInfo
