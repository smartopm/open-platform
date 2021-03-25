import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types'
import { useMutation } from 'react-apollo';
import { useHistory } from 'react-router-dom'
import { makeStyles } from "@material-ui/core/styles"
import { PointOfInterestCreate } from '../../graphql/mutations/land_parcel';
import MessageAlert from "../MessageAlert"
import PointOfInterestModal from './PointOfInterestModal'
import { formatError } from '../../utils/helpers'

export default function CreatePointOfInterest({ refetch }) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [isSuccessAlert, setIsSuccessAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')
  const history = useHistory()

  const [addPointOfInterest] = useMutation(PointOfInterestCreate);

  useEffect(() => {
    const locationInfo = window.location.pathname.split('/')
    if (locationInfo[locationInfo.length - 1] === 'new_poi') {
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
    addPointOfInterest({ variables }).then(() => {
      setMessageAlert('Point of Interest added successfully')
      setIsSuccessAlert(true)
      setOpen(false);
      refetch();
      history.push('/land_parcels')
    }).catch((err) => {
      setMessageAlert(formatError(err.message))
      setIsSuccessAlert(false)
    })
  }

  function openNewPointOfInterestModal() {
    setOpen(true)
    history.push('/land_parcels/new_poi')
  }

  function closeNewPointOfInterestModal() {
    setOpen(false)
    history.push('/land_parcels')
  }

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        className={classes.parcelButton}
        onClick={openNewPointOfInterestModal}
        data-testid="new-poi-button"
      >
        New Point of Interest
      </Button>
      <PointOfInterestModal
        open={open}
        handleClose={closeNewPointOfInterestModal}
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
    margin: '10px 5px'
  },
  parcelForm: {
    display: 'flex',
    flexDirection: 'column',
    width: '400px'
  }
}));

CreatePointOfInterest.propTypes = {
  refetch: PropTypes.func.isRequired
}