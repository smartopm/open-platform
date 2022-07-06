/* eslint-disable */
import React, { Fragment } from 'react'
import {
  Button,
  MenuItem,
  Select,
  Grid,
  FormControl,
  InputLabel
} from '@mui/material'
import { useTranslation } from 'react-i18next';
import { filterUserByLoggedin } from '../utils/constants'
import DatePicker from "./DatePickerDialog"

/**
 * @deprecated 
 */
export default function DateFilterComponent({
  handleFilterInputChange,
  classes,
  filterType,
  handleDateChangeFrom,
  handleDateChangeTo,
  handleDateChangeOn,
  selectDateFrom,
  selectDateTo,
  selectDateOn,
  resetFilter
}) {
  const { t } = useTranslation('common');
  return (
    <Grid item xs={'auto'}>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-mutiple-chip-label" className={classes.inputLabel}>Filter for Campaign</InputLabel>
        <Select
          labelId="select-by-loggedin"
          id="loggedin-filter"
          value={filterType}
          onChange={handleFilterInputChange}
        >
          {Object.entries(filterUserByLoggedin).map(([key, val]) => (
            <MenuItem key={key} value={key}>
              {val}
            </MenuItem>
          ))}
        </Select>
        {filterType === 'log_from' && (
          <Fragment>
            <DatePicker handleDateChange={handleDateChangeFrom} selectedDate={selectDateFrom} label="from:" t={t} />
          </Fragment>)}
          {filterType === "log_to" && (
            <Fragment>
              <DatePicker handleDateChange={handleDateChangeTo} selectedDate={selectDateTo} label="to:" t={t}/>
            </Fragment>
          )}
          {filterType === "log_on" && (
            <Fragment>
              <DatePicker handleDateChange={handleDateChangeOn} selectedDate={selectDateOn} label="on:" t={t}/>
            </Fragment>
          )}

        {Boolean(filterType.length) && (
          <Button size="small" onClick={resetFilter}>Clear Filter</Button>
        )}
      </FormControl>
    </Grid>
  )
}
