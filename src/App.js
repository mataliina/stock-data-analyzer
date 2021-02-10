import { Typography } from '@material-ui/core'
import StockInfo from './components/StockInfo'

function App() {
	return (
		<>
			<Typography variant='h3' style={{ textAlign: 'center', width: '100%' }}>
				Stock Data Analyzer
			</Typography>
			<Typography variant='h4' style={{ textAlign: 'center', width: '100%' }}>
				for Scrooge McDuck
			</Typography>
			<StockInfo />
		</>
	)
}

export default App
