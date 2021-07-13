import React, { useState } from 'react';
import { Button, Container, Grid, IconButton } from '@material-ui/core';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import PropTypes from 'prop-types';
import { Spinner } from '../../../shared/Loading';
import FormPropertyCreateForm from './FormPropertyCreateForm';
import { DetailsDialog } from '../../../components/Dialog';


// call update mutation
// check if form has been submitted before
// make the createproperty form component more generic

export default function FormPropertyAction({
  currentPropId,
  propertyId,
  isDeletingProperty,
  editMode,
  formId,
  refetch
}) {
    // create states for the edit modal
    const [modal, setModal] = useState({ type: '', isOpen: false})

    function handleModal(type='edit'){
        setModal({type, isOpen: !modal.isOpen})
    }

  function handleDeleteProperty() {
    console.log(propertyId)
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
    <>
      <DetailsDialog
        handleClose={handleModal}
        open={modal.isOpen}
        title="Update Form Property"
        color="default"
        noActionButton={modal.type !== 'edit'}
      >
        <Container>
          {
            modal.type === 'edit'
            ? <FormPropertyCreateForm formId={formId} refetch={refetch} />
            : 'Delete this property'
          }
        </Container>
      </DetailsDialog>
      <Grid item xs={2}>
        <Grid container direction="row">
          <Grid item xs>
            <IconButton
              onClick={() => handleModal('delete')}
            >
              {isDeletingProperty && currentPropId === propertyId ? <Spinner /> : <DeleteOutlineIcon />}
            </IconButton>
          </Grid>
          <Grid item xs>
            <IconButton
              onClick={() => handleModal('edit')}
            >
              {isDeletingProperty && currentPropId === propertyId ? <Spinner /> : <EditIcon />}
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

FormPropertyAction.propTypes = {
  currentPropId: PropTypes.string.isRequired,
  propertyId: PropTypes.string.isRequired,
  formId: PropTypes.string.isRequired,
  isDeletingProperty: PropTypes.bool.isRequired,
  editMode: PropTypes.bool.isRequired,
  refetch: PropTypes.func.isRequired,
};
