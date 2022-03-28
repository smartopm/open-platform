import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button';
import PropTypes from 'prop-types'
import { useMutation } from 'react-apollo';
import { useHistory, useLocation } from 'react-router-dom'
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import { AddNewProperty } from '../../graphql/mutations'
import MessageAlert from "../MessageAlert"
import LandParcelModal from './LandParcelModal'
import { formatError, useParamsQuery } from '../../utils/helpers'

export default function CreateLandParcel({ refetch, selectedLandParcel, newHouse, refetchHouseData}) {
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
    let variableSave = { ...variables }

    if(newHouse) {
      variableSave = {
        ...variableSave,
        houseLandParcelId: selectedLandParcel.id,
      }
    }

    addProperty({  variables: variableSave  }).then(() => {
      setMessageAlert(t('messages.property_added'))
      setIsSuccessAlert(true)
      closeNewParcelModal();
      if(location?.state?.from === 'users') {
        history.push(`user/${location?.state?.user?.userId}?tab=Plots`);
      }
      refetch();
      refetchHouseData();
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
    history.push('/land_parcels')
    setOpen(false)
  }

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        className={`${classes.parcelButton} new-property-btn`}
        onClick={openNewParcelModal}
        data-testid="parcel-button"
      >
        {(t('buttons.new_property'))}
      </Button>
      <LandParcelModal
        open={open || newHouse}
        handleClose={closeNewParcelModal}
        handleSubmit={handleSubmit}
        modalType={newHouse ? 'new_house' : 'new'}
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
    margin: '10px 0  10px 16px'
  },
  parcelForm: {
    display: 'flex',
    flexDirection: 'column',
    width: '400px'
  }
}));

CreateLandParcel.propTypes = {
  refetch: PropTypes.func.isRequired,
  refetchHouseData: PropTypes.func.isRequired,
  newHouse: PropTypes.bool.isRequired,
  selectedLandParcel: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
}