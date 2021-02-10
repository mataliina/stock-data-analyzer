import React from 'react'
import { CSVReader } from 'react-papaparse'

const CsvReader = (props) => {
	const { setStockData, setNoDataError } = props
	const handleOnDrop = (data) => {
		let newData = data.slice(1, -1)
		setStockData(newData)
		setNoDataError(false)
	}

	const handleOnError = (err, file, inputElem, reason) => {
		console.log(err)
	}

	const handleOnRemoveFile = (data) => {
		setStockData([])
	}

	return (
		<>
			<CSVReader
				onDrop={handleOnDrop}
				onError={handleOnError}
				addRemoveButton
				onRemoveFile={handleOnRemoveFile}
				noDrag
			>
				<span>Click to upload a CSV file.</span>
			</CSVReader>
		</>
	)
}
export default CsvReader
