import React, { useState } from 'react';
import { Container, Grid, IconButton } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../../../shared/Loading';
import FormPropertyCreateForm from './FormPropertyCreateForm';
import { DetailsDialog } from '../../../components/Dialog';
import { FormPropertyDeleteMutation } from '../graphql/forms_mutation';
import MessageAlert from '../../../components/MessageAlert';
import { formatError } from '../../../utils/helpers';

export default function FormPropertyAction({ propertyId, editMode, formId, refetch }) {
  const [modal, setModal] = useState({ type: '', isOpen: false });
  const [currentPropId, setCurrentPropertyId] = useState('');
  const [isDeletingProperty, setDeleteLoading] = useState(false);
  const [deleteProperty] = useMutation(FormPropertyDeleteMutation);
  const history = useHistory();
  const [message, setMessage] = useState({ isError: false, detail: '' });
  const { t } = useTranslation('form');

  function handleModal() {
    setModal({ isOpen: !modal.isOpen });
  }

  function handleDeleteProperty(propId) {
    setDeleteLoading(true);
    setCurrentPropertyId(propId);
    deleteProperty({
      variables: { formId, formPropertyId: propId }
    })
      .then((res) => {
        setDeleteLoading(false);
        if (res.data.formPropertiesDelete.message === 'New version created') {
          history.push({
            pathname: '/forms',
            state: {
              from: 'Form Property'
            }
          })
        } else {
          setMessage({ ...message, isError: false, detail: t('misc.deleted_form_property') });
        }
        refetch();
      })
      .catch(err => {
        setMessage({ ...message, isError: true, detail: formatError(err.message) });
        setDeleteLoading(false);
      });
  }

  if (!editMode) {
    return null;
  }

  return (
    <>
      <MessageAlert
        type={message.isError ? 'error' : 'success'}
        message={message.detail}
        open={!!message.detail}
        handleClose={() => setMessage({ ...message, detail: '' })}
      />
      <DetailsDialog
        handleClose={handleModal}
        open={modal.isOpen}
        title={t('actions.update_form_property')}
        color="default"
      >
        <Container>
          <FormPropertyCreateForm
            formId={formId}
            refetch={refetch}
            propertyId={propertyId}
            close={handleModal}
          />
        </Container>
      </DetailsDialog>
      <Grid item xs={2}>
        <Grid container direction="row">
          <Grid item xs>
            <IconButton onClick={() => handleDeleteProperty(propertyId)} data-testid="property_delete">
              {isDeletingProperty && currentPropId === propertyId ? (
                <Spinner />
              ) : (
                <DeleteOutlineIcon />
              )}
            </IconButton>
          </Grid>
          <Grid item xs>
            <IconButton onClick={handleModal} data-testid="property_edit">
              <EditIcon />
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
  editMode: PropTypes.bool.isRequired,
  refetch: PropTypes.func.isRequired
};
