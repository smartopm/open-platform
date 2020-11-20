import React, { useState } from 'react'
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types'
import { useMutation } from 'react-apollo';
import { makeStyles } from "@material-ui/core/styles"
import TextField from '@material-ui/core/TextField';
import { CustomizedDialogs } from '../Dialog'
import { AddNewProperty } from '../../graphql/mutations'
import MessageAlert from "../MessageAlert"

export default function CreateLandParcel({ refetch }) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [parcelNumber, setParcelNumber] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [stateProvince, setStateProvince] = useState('')
  const [parcelType, setParcelType] = useState('')
  const [country, setCountry] = useState('')
  const [isSuccessAlert, setIsSuccessAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')

  const [addProperty] = useMutation(AddNewProperty);

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return
    }
    setMessageAlert('')
  }

  function handleSubmit() {
    addProperty({
      variables: { 
        parcelNumber, 
        address1, 
        address2, 
        city, 
        postalCode, 
        stateProvince, 
        parcelType, 
        country 
      }
    }).then(() => {
      setMessageAlert('Property added successfully')
      setIsSuccessAlert(true)
      setOpen(false);
      refetch();
    }).catch((err) => {
      setOpen(false);
      setMessageAlert(err.message)
      setIsSuccessAlert(false)
    })
  }
  return (
    <>
      <Button 
        variant="contained" 
        color="primary" 
        className={classes.parcelButton}
        onClick={() => setOpen(true)} 
        data-testid="parcel-button"
      >
        New Property
      </Button>
      <CustomizedDialogs 
        open={open} 
        handleModal={() => setOpen(false)} 
        dialogHeader="New Property"
        handleBatchFilter={handleSubmit}
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
      <MessageAlert
        type={isSuccessAlert ? 'success' : 'error'}
        message={messageAlert}
        open={!!messageAlert}
        handleClose={handleMessageAlertClose}
      />
    </>
  )
}

const useStyles = makeStyles(() => ({
  parcelButton: {
    float: 'right',
    margin: '25px 0'
  },
  parcelForm: {
    display: 'flex', 
    flexDirection: 'column',
    width: '400px'
  }
}));

CreateLandParcel.propTypes = {
  refetch: PropTypes.func.isRequired
}