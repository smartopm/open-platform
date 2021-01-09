import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from "@material-ui/core/styles"
import { TextField } from '@material-ui/core'
import { CustomizedDialogs } from '../Dialog'

export default function LandParcelModal({ open, setOpen, handleSubmit }) {
  const classes = useStyles()
  const [parcelNumber, setParcelNumber] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [stateProvince, setStateProvince] = useState('')
  const [parcelType, setParcelType] = useState('')
  const [country, setCountry] = useState('')

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
        country
      })
    }
  }

  return (
    <CustomizedDialogs
      open={open}
      handleModal={() => setOpen(false)}
      dialogHeader="New Property"
      handleBatchFilter={handleParcelSubmit}
    >
      <div className={classes.parcelForm}>
        <TextField
          autoFocus
          margin="dense"
          id="parcel-number"
          inputProps={{ "data-testid": "parcel-number" }}
          label="Parcel Number"
          type="text"
          value={parcelNumber}
          onChange={e => setParcelNumber(e.target.value)}
          required
        />
        <TextField
          margin="dense"
          id="address1"
          label="Address1"
          inputProps={{ "data-testid": "address1" }}
          type="text"
          value={address1}
          onChange={e => setAddress1(e.target.value)}
        />
        <TextField
          margin="dense"
          id="address2"
          label="Address2"
          inputProps={{ "data-testid": "address2" }}
          type="text"
          value={address2}
          onChange={e => setAddress2(e.target.value)}
        />
        <TextField
          margin="dense"
          id="city"
          label="city"
          inputProps={{ "data-testid": "city" }}
          type="text"
          value={city}
          onChange={e => setCity(e.target.value)}
        />
        <TextField
          margin="dense"
          id="state-province"
          label="State Province"
          inputProps={{ "data-testid": "state-province" }}
          type="text"
          value={stateProvince}
          onChange={e => setStateProvince(e.target.value)}
        />
        <TextField
          margin="dense"
          id="country"
          label="Country"
          type="text"
          inputProps={{ "data-testid": "country" }}
          value={country}
          onChange={e => setCountry(e.target.value)}
        />
        <TextField
          margin="dense"
          id="parcel-type"
          label="Parcel Type"
          inputProps={{ "data-testid": "parcel-type" }}
          type="text"
          value={parcelType}
          onChange={e => setParcelType(e.target.value)}
        />
        <TextField
          margin="dense"
          id="postal-code"
          label="Postal Code"
          inputProps={{ "data-testid": "postal-code" }}
          type="number"
          value={postalCode}
          onChange={e => setPostalCode(e.target.value)}
        />
      </div>
    </CustomizedDialogs>
  );
}

const useStyles = makeStyles(() => ({
  parcelForm: {
    display: 'flex',
    flexDirection: 'column',
    width: '400px'
  }
}));

LandParcelModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
}
