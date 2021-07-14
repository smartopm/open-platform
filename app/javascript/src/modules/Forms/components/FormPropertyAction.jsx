import React, { useState } from 'react';
import { Container, Grid, IconButton } from '@material-ui/core';
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
  propertyId,
  isDeletingProperty,
  editMode,
  formId,
  refetch
}) {
    // create states for the edit modal
    const [modal, setModal] = useState({ type: '', isOpen: false})
    const [currentPropId, setCurrentPropId] = useState('')

    // using default values in case we are just using the modal to close it.
    function handleModal(type='edit', id=currentPropId){
        setModal({type, isOpen: !modal.isOpen})
        setCurrentPropId(id)
    }

  // eslint-disable-next-line
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
            ? <FormPropertyCreateForm formId={formId} refetch={refetch} propertyId={propertyId} close={handleModal} />
            : 'Delete this property'
          }
        </Container>
      </DetailsDialog>
      <Grid item xs={2}>
        <Grid container direction="row">
          <Grid item xs>
            <IconButton
              onClick={() => handleModal('delete', propertyId)}
            >
              {isDeletingProperty && currentPropId === propertyId ? <Spinner /> : <DeleteOutlineIcon />}
            </IconButton>
          </Grid>
          <Grid item xs>
            <IconButton
              onClick={() => handleModal('edit', propertyId)}
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
  propertyId: PropTypes.string.isRequired,
  formId: PropTypes.string.isRequired,
  isDeletingProperty: PropTypes.bool.isRequired,
  editMode: PropTypes.bool.isRequired,
  refetch: PropTypes.func.isRequired,
};
