import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button';
import PropTypes from 'prop-types'
import { useMutation } from 'react-apollo';
import { useHistory } from 'react-router-dom'
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import { PointOfInterestCreate } from '../../graphql/mutations/land_parcel';
import MessageAlert from "../MessageAlert"
import PointOfInterestModal from './PointOfInterestModal'
import { formatError, useParamsQuery } from '../../utils/helpers'

export default function CreatePointOfInterest({ refetch }) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [isSuccessAlert, setIsSuccessAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const history = useHistory()
  const path = useParamsQuery('')
  const type = path.get('type');
  const { t } = useTranslation('property')

  const [addPointOfInterest] = useMutation(PointOfInterestCreate);

  useEffect(() => {
    if (type === 'new_poi') {
      setOpen(true)
    }
  }, [type])

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return
    }
    setMessageAlert('')
  }

  function handleSubmit(variables) {
    setIsSubmitting(true)
    addPointOfInterest({ variables }).then(() => {
      setMessageAlert(t('messages.poi_added'))
      setIsSuccessAlert(true)
      setOpen(false);
      setIsSubmitting(false)
      refetch();
      history.push('/land_parcels')
      window.location.reload()
    }).catch((err) => {
      setMessageAlert(formatError(err.message))
      setIsSuccessAlert(false)
    })
  }

  function openNewPointOfInterestModal() {
    setOpen(true)
    history.push('/land_parcels?type=new_poi')
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
        {(t('buttons.new_point_of_interest'))}
      </Button>
      <PointOfInterestModal
        open={open}
        handleClose={closeNewPointOfInterestModal}
        isSubmitting={isSubmitting}
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