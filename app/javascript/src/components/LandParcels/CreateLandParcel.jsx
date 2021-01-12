import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types'
import { useMutation } from 'react-apollo';
import { useHistory } from 'react-router-dom'
import { makeStyles } from "@material-ui/core/styles"
import { AddNewProperty } from '../../graphql/mutations'
import MessageAlert from "../MessageAlert"
import LandParcelModal from './LandParcelModal'

export default function CreateLandParcel({ refetch }) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [isSuccessAlert, setIsSuccessAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')
  const history = useHistory()

  const [addProperty] = useMutation(AddNewProperty);

  useEffect(() => {
    const locationInfo = window.location.pathname.split('/')
    if (locationInfo[locationInfo.length - 1] === 'new') {
      setOpen(true)
    }
  }, [])

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
      closeNewParcelModal()
      setMessageAlert(err.message)
      setIsSuccessAlert(false)
    })
  }

  function openNewParcelModal() {
    setOpen(true)
    history.push('/land_parcels/new')
  }

  function closeNewParcelModal() {
    setOpen(false)
    history.push('/land_parcels')
  }

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        className={classes.parcelButton}
        onClick={openNewParcelModal}
        data-testid="parcel-button"
      >
        New Property
      </Button>
      <LandParcelModal
        open={open}
        handelClose={closeNewParcelModal}
        handleSubmit={handleSubmit}
        modalType='new'
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