import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from "@material-ui/core/styles"
import { TextField } from '@material-ui/core'
import { CustomizedDialogs } from '../Dialog'

export default function LandParcelModal({ open, handelClose, handleSubmit, modalType, landParcel }) {
  const classes = useStyles()
  const [parcelNumber, setParcelNumber] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [stateProvince, setStateProvince] = useState('')
  const [parcelType, setParcelType] = useState('')
  const [country, setCountry] = useState('')
  const isFormReadOnly = modalType === 'details'

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
      handleModal={handelClose}
      dialogHeader={modalType === 'new' ? "New Property" : `Parcel ${landParcel.parcelNumber}`}
      handleBatchFilter={handleParcelSubmit}
      saveAction={modalType === 'details' && 'Edit Parcel'}
    >
      <div className={classes.parcelForm}>
        <TextField
          autoFocus
          margin="dense"
          id="parcel-number"
          inputProps={{ "data-testid": "parcel-number", readOnly: isFormReadOnly }}
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
          inputProps={{ "data-testid": "address1", readOnly: isFormReadOnly }}
          type="text"
          defaultValue={landParcel?.address1}
          value={modalType === 'new' ? address1 : undefined}
          onChange={e => setAddress1(e.target.value)}
        />
        <TextField
          margin="dense"
          id="address2"
          label="Address2"
          inputProps={{ "data-testid": "address2", readOnly: isFormReadOnly }}
          type="text"
          defaultValue={landParcel?.address2}
          value={modalType === 'new' ? address2 : undefined}
          onChange={e => setAddress2(e.target.value)}
        />
        <TextField
          margin="dense"
          id="city"
          label="city"
          inputProps={{ "data-testid": "city", readOnly: isFormReadOnly }}
          type="text"
          defaultValue={landParcel?.city}
          value={modalType === 'new' ? city : undefined}
          onChange={e => setCity(e.target.value)}
        />
        <TextField
          margin="dense"
          id="state-province"
          label="State Province"
          inputProps={{ "data-testid": "state-province", readOnly: isFormReadOnly }}
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
          inputProps={{ "data-testid": "country", readOnly: isFormReadOnly }}
          defaultValue={landParcel?.country}
          value={modalType === 'new' ? country : undefined}
          onChange={e => setCountry(e.target.value)}
        />
        <TextField
          margin="dense"
          id="parcel-type"
          label="Parcel Type"
          inputProps={{ "data-testid": "parcel-type", readOnly: isFormReadOnly }}
          type="text"
          defaultValue={landParcel?.parcelType}
          value={modalType === 'new' ? parcelType : undefined}
          onChange={e => setParcelType(e.target.value)}
        />
        <TextField
          margin="dense"
          id="postal-code"
          label="Postal Code"
          inputProps={{ "data-testid": "postal-code", readOnly: isFormReadOnly }}
          type="number"
          defaultValue={landParcel?.postalCode}
          value={modalType === 'new' ? postalCode : undefined}
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
  handelClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  modalType: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  landParcel: PropTypes.object.isRequired
}
