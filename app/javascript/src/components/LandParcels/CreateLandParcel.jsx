import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types'
import { useMutation } from 'react-apollo';
import { useHistory, useLocation } from 'react-router-dom'
import { makeStyles } from "@material-ui/core/styles"
import { useTranslation } from 'react-i18next';
import { AddNewProperty } from '../../graphql/mutations'
import MessageAlert from "../MessageAlert"
import LandParcelModal from './LandParcelModal'
import { formatError, useParamsQuery } from '../../utils/helpers'

export default function CreateLandParcel({ refetch }) {
  const classes = useStyles()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [isSuccessAlert, setIsSuccessAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')
  const history = useHistory()
  const path = useParamsQuery('')
  const type = path.get('type');
  const [addProperty] = useMutation(AddNewProperty);
  const { t } = useTranslation('property')
  useEffect(() => {
    if (type === 'new') {
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
    addProperty({ variables }).then(() => {
      setMessageAlert(t('property:messages.property_added'))
      setIsSuccessAlert(true)
      setOpen(false);
      if(location?.state?.from === 'users') {
        history.push(`user/${location?.state?.user?.userId}?tab=Plots`);
      }
      refetch();
    }).catch((err) => {
      setMessageAlert(formatError(err.message))
      setIsSuccessAlert(false)
    })
  }

  function openNewParcelModal() {
    setOpen(true)
    history.push('/land_parcels?type=new')
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
        {(t('property:buttons.new_property'))}
      </Button>
      <LandParcelModal
        open={open}
        handleClose={closeNewParcelModal}
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
    margin: '10px 0  10px 5px'
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