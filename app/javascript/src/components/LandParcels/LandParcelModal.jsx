/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import {
  TextField,
  InputAdornment,
  Typography,
  IconButton
} from '@material-ui/core'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import { DeleteOutline } from '@material-ui/icons'
import { CustomizedDialogs } from '../Dialog'
import { StyledTabs, StyledTab, TabPanel } from '../Tabs'
import DatePickerDialog from '../DatePickerDialog'
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider'
import { currencies } from '../../utils/constants'

export default function LandParcelModal({
  open,
  handelClose,
  handleSubmit,
  modalType,
  landParcel
}) {
  const classes = useStyles()
  const [parcelNumber, setParcelNumber] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [stateProvince, setStateProvince] = useState('')
  const [parcelType, setParcelType] = useState('')
  const [country, setCountry] = useState('')
  const [tabValue, setTabValue] = useState('Details')
  const [valuationFields, setValuationFields] = useState([])

  const isFormReadOnly = modalType === 'details'
  const authState = useContext(AuthStateContext)
  const currency = currencies[authState.user?.community.currency] || ''

  useEffect(() => {
    if (!open) {
      resetModalFields()
    }
  }, [open])

  function resetModalFields() {
    setParcelNumber('')
    setAddress1('')
    setAddress2('')
    setCity('')
    setPostalCode('')
    setStateProvince('')
    setParcelType('')
    setCountry('')
    setTabValue('Details')
    setValuationFields([])
  }

  function handleParcelSubmit() {
    if (handleSubmit) {
      handleSubmit({
        parcelNumber,
        address1,
        address2,
        city,
        postalCode,
        stateProvince,
        parcelType,
        country,
        valuationFields
      })
    }
  }

  function handleChange(_event, newValue) {
    setTabValue(newValue)
  }

  function onChangeValuationField(event, index) {
    updateValuationField(event.target.name, event.target.value, index)
  }

  function onChangeValuationDateField(date, index) {
    updateValuationField('startDate', date, index)
  }

  function updateValuationField(name, value, index) {
    const fields = [...valuationFields]
    fields[index] = { ...fields[index], [name]: value }
    setValuationFields(fields)
  }

  function addValuation() {
    setValuationFields([
      ...valuationFields,
      { amount: '', startDate: new Date() }
    ])
  }

  function removeValuation(index) {
    const valuationOptions = valuationFields
    valuationOptions.splice(index, 1)
    setValuationFields([...valuationOptions])
  }

  return (
    <CustomizedDialogs
      open={open}
      handleModal={handelClose}
      dialogHeader={
        modalType === 'new'
          ? 'New Property'
          : `Parcel ${landParcel.parcelNumber}`
      }
      handleBatchFilter={handleParcelSubmit}
      saveAction={modalType === 'details' ? 'Edit Parcel' : 'Save'}
    >
      <StyledTabs
        value={tabValue}
        onChange={handleChange}
        aria-label="land parcel tabs"
      >
        <StyledTab label="Details" value="Details" />
        <StyledTab label="Ownership" value="Ownership" />
        <StyledTab label="Valuation History" value="Valuation History" />
      </StyledTabs>
      <TabPanel value={tabValue} index="Details">
        <div className={classes.parcelForm}>
          <TextField
            autoFocus
            margin="dense"
            id="parcel-number"
            inputProps={{
              'data-testid': 'parcel-number',
              readOnly: isFormReadOnly
            }}
            label="Parcel Number"
            type="text"
            defaultValue={landParcel?.parcelNumber}
            value={modalType === 'new' ? parcelNumber : undefined}
            onChange={e => setParcelNumber(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="address1"
            label="Address1"
            inputProps={{ 'data-testid': 'address1', readOnly: isFormReadOnly }}
            type="text"
            defaultValue={landParcel?.address1}
            value={modalType === 'new' ? address1 : undefined}
            onChange={e => setAddress1(e.target.value)}
          />
          <TextField
            margin="dense"
            id="address2"
            label="Address2"
            inputProps={{ 'data-testid': 'address2', readOnly: isFormReadOnly }}
            type="text"
            defaultValue={landParcel?.address2}
            value={modalType === 'new' ? address2 : undefined}
            onChange={e => setAddress2(e.target.value)}
          />
          <TextField
            margin="dense"
            id="city"
            label="city"
            inputProps={{ 'data-testid': 'city', readOnly: isFormReadOnly }}
            type="text"
            defaultValue={landParcel?.city}
            value={modalType === 'new' ? city : undefined}
            onChange={e => setCity(e.target.value)}
          />
          <TextField
            margin="dense"
            id="state-province"
            label="State Province"
            inputProps={{
              'data-testid': 'state-province',
              readOnly: isFormReadOnly
            }}
            type="text"
            defaultValue={landParcel?.stateProvince}
            value={modalType === 'new' ? stateProvince : undefined}
            onChange={e => setStateProvince(e.target.value)}
          />
          <TextField
            margin="dense"
            id="country"
            label="Country"
            type="text"
            inputProps={{ 'data-testid': 'country', readOnly: isFormReadOnly }}
            defaultValue={landParcel?.country}
            value={modalType === 'new' ? country : undefined}
            onChange={e => setCountry(e.target.value)}
          />
          <TextField
            margin="dense"
            id="parcel-type"
            label="Parcel Type"
            inputProps={{
              'data-testid': 'parcel-type',
              readOnly: isFormReadOnly
            }}
            type="text"
            defaultValue={landParcel?.parcelType}
            value={modalType === 'new' ? parcelType : undefined}
            onChange={e => setParcelType(e.target.value)}
          />
          <TextField
            margin="dense"
            id="postal-code"
            label="Postal Code"
            inputProps={{
              'data-testid': 'postal-code',
              readOnly: isFormReadOnly
            }}
            type="number"
            defaultValue={landParcel?.postalCode}
            value={modalType === 'new' ? postalCode : undefined}
            onChange={e => setPostalCode(e.target.value)}
          />
        </div>
      </TabPanel>
      <TabPanel value={tabValue} index="Ownership">
        <div>Coming soon!!</div>
      </TabPanel>
      <TabPanel value={tabValue} index="Valuation History">
        {modalType === 'details' &&
          (landParcel?.valuations?.length ? (
            landParcel?.valuations.map(valuation => (
              <div className={classes.parcelForm} key={valuation.id}>
                <TextField
                  autoFocus
                  margin="dense"
                  InputProps={{
                    readOnly: isFormReadOnly,
                    startAdornment: (
                      <InputAdornment position="start">
                        {currency}
                      </InputAdornment>
                    )
                  }}
                  // eslint-disable-next-line react/jsx-no-duplicate-props
                  inputProps={{ style: { paddingTop: '6px' } }}
                  label="Amount"
                  type="number"
                  defaultValue={valuation.amount}
                  required
                />
                <DatePickerDialog
                  label="Start Date"
                  selectedDate={valuation.startDate}
                  handleDateChange={() => {}}
                  inputProps={{ readOnly: true }}
                  required
                />
              </div>
            ))
          ) : (
            <div>No Valuations Yet</div>
          ))}
        {modalType === 'new' &&
          valuationFields.map((_field, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div style={{ display: 'flex' }} key={index}>
              <div className={classes.parcelForm}>
                <TextField
                  autoFocus
                  margin="dense"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {currency}
                      </InputAdornment>
                    )
                  }}
                  // eslint-disable-next-line react/jsx-no-duplicate-props
                  inputProps={{
                    'data-testid': 'valuation-amount',
                    style: { paddingTop: '6px' }
                  }}
                  label="Amount"
                  name="amount"
                  type="number"
                  value={valuationFields[index].amount}
                  onChange={e => onChangeValuationField(e, index)}
                  required
                />
                <DatePickerDialog
                  label="Start Date"
                  selectedDate={valuationFields[index].startDate}
                  handleDateChange={date =>
                    onChangeValuationDateField(date, index)}
                  disablePastDate
                  required
                />
              </div>
              <div className={classes.removeIcon}>
                <IconButton
                  style={{ marginTop: 13 }}
                  onClick={() => removeValuation(index)}
                  aria-label="remove"
                >
                  <DeleteOutline />
                </IconButton>
              </div>
            </div>
          ))}
        {modalType === 'new' && (
          <div className={classes.addIcon} role="button" onClick={addValuation}>
            <AddCircleOutlineIcon />
            <div style={{ marginLeft: '6px', color: 'secondary' }}>
              <Typography align="center" variant="caption">
                Add Valuation
              </Typography>
            </div>
          </div>
        )}
      </TabPanel>
    </CustomizedDialogs>
  )
}

const useStyles = makeStyles(() => ({
  parcelForm: {
    display: 'flex',
    flexDirection: 'column',
    width: '400px',
    marginBottom: '30px'
  },
  addIcon: {
    display: 'flex',
    marginTop: '20px',
    color: '#6CAA9F',
    cursor: 'pointer'
  },
  removeIcon: {
    marginTop: '25px',
    marginLeft: '10px'
  }
}))

LandParcelModal.defaultProps = {
  handleSubmit: () => {},
  landParcel: null
}

LandParcelModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handelClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func,
  modalType: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  landParcel: PropTypes.object
}
