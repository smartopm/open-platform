import React from 'react';
import { Grid, IconButton } from '@material-ui/core';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import PropTypes from 'prop-types';
import { Spinner } from '../../../shared/Loading';

export default function FormPropertyAction({
  currentPropId,
  propertyId,
  isDeletingProperty,
  editMode
}) {
    // create states for the edit modal


  function handleDeleteProperty(propId){
    console.log(propId)
    // setDeleteLoading(true)
    // setCurrentPropertyId(propId)
    // deleteProperty({
    //     variables: { formId, formPropertyId: propId }
    //   })
    //   .then(() => {
    //     setDeleteLoading(false)
    //     setMessage({ ...message, err: false, info: 'Deleted form property' })
    //     setAlertOpen(true)
    //     refetch()
    //   })
    //   .catch(err => {
    //     setMessage({ ...message, err: true, info: err.message })
    //     setAlertOpen(true)
    //     setDeleteLoading(false)
    // })
  }

  function handleUpdateProperty(propId){
    console.log(propId)
  }

  if (!editMode) {
    return null;
  }

  return (
    <Grid item xs={2}>
      <Grid container direction="row">
        <Grid item xs>
          <IconButton
            onClick={() => handleDeleteProperty(propertyId)}
          >
            {isDeletingProperty && currentPropId === propertyId ? <Spinner /> : <DeleteOutlineIcon />}
          </IconButton>
        </Grid>
        <Grid item xs>
          <IconButton
            onClick={() => handleUpdateProperty(propertyId)}
          >
            {isDeletingProperty && currentPropId === propertyId ? <Spinner /> : <EditIcon />}
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
}

FormPropertyAction.propTypes = {
  currentPropId: PropTypes.string.isRequired,
  propertyId: PropTypes.string.isRequired,
  isDeletingProperty: PropTypes.bool.isRequired,
  editMode: PropTypes.bool.isRequired
};
