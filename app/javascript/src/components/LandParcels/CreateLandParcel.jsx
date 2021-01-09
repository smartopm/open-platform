import React, { useState } from 'react'
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types'
import { useMutation } from 'react-apollo';
import { makeStyles } from "@material-ui/core/styles"
import { AddNewProperty } from '../../graphql/mutations'
import MessageAlert from "../MessageAlert"
import LandParcelModal from './LandParcelModal'

export default function CreateLandParcel({ refetch }) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [isSuccessAlert, setIsSuccessAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')

  const [addProperty] = useMutation(AddNewProperty);

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return
    }
    setMessageAlert('')
  }

  function handleSubmit(variables) {
    addProperty({ variables }).then(() => {
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
      <LandParcelModal
        open={open}
        setOpen={setOpen}
        handleSubmit={handleSubmit}
      />
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