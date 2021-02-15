import React, { useState } from 'react'
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
// import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import DatePickerDialog from '../DatePickerDialog' 

export default function GenerateReport(){
  const classes = useStyles();
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [transType, setTransType] = useState('')

  return (
    <>
      <div className={classes.searchField}>
        <DatePickerDialog
          label="Start Date"
          required
          selectedDate={startDate}
          width='15%'
          handleDateChange={(date) => setStartDate(date)}
        />
        {' '}
        <DatePickerDialog
          label="End Date"
          required
          selectedDate={endDate}
          width='15%'
          handleDateChange={(date) => setEndDate(date)}
        />
      </div>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="transaction-type">Transaction Type</InputLabel>
        <Select
          labelId="tras-label"
          id="trans-select"
          value={transType}
          onChange={(e) => setTransType(e.target.value)}
          label="Transaction Type"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value='cash'>Cash</MenuItem>
          <MenuItem value='cheque/cashier_cheque'>Cheque/Cashier Cheque</MenuItem>
          <MenuItem value='mobile_money'>Mobile Money</MenuItem>
          <MenuItem value='bank_transfer/cash_deposit'>Bank Transfer/Cash Deposit</MenuItem>
          <MenuItem value='bank_transfer/eft'>Bank Transfer/EFT</MenuItem>
          <MenuItem value='pos'>Point of Sale</MenuItem>
        </Select>
      </FormControl>
    </>
  )
}

const useStyles = makeStyles(() => ({
  searchField: {
    margin: '30px'
  },
}));