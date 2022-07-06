import React, { useState, useContext } from 'react';
import { Container, IconButton } from '@mui/material';
import { useHistory } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../../../shared/Loading';
import { FormPropertyDeleteMutation } from '../graphql/forms_mutation';
import { formatError } from '../../../utils/helpers';
import FormPropertyCreateForm from './FormPropertyCreateForm';
import { DetailsDialog } from '../../../components/Dialog';
import MenuList from '../../../shared/MenuList';
import { SnackbarContext } from '../../../shared/snackbar/Context';

export default function FormPropertyAction({
  propertyId,
  editMode,
  formId,
  refetch,
  categoryId,
  formDetailRefetch
}) {
  const [modal, setModal] = useState({ type: '', isOpen: false });
  const [currentPropId, setCurrentPropertyId] = useState('');
  const [isDeletingProperty, setDeleteLoading] = useState(false);
  const [deleteProperty] = useMutation(FormPropertyDeleteMutation);
  const history = useHistory();
  const { t } = useTranslation(['form', 'common']);
  const [anchorEl, setAnchorEl] = useState(null);
  const anchorElOpen = Boolean(anchorEl);
  const { showSnackbar, messageType } = useContext(SnackbarContext);

  const menuList = [
    {
      content: t('common:menu.edit'),
      isAdmin: true,
      color: '',
      handleClick: e => {
        handleModal();
        handleClose(e);
      }
    },
    {
      content: t('common:menu.delete'),
      isAdmin: true,
      color: '',
      handleClick: e => {
        handleDeleteProperty(propertyId);
        handleClose(e);
      }
    }
  ];

  const menuData = {
    menuList,
    handleMenu,
    anchorEl,
    open: anchorElOpen,
    handleClose
  };

  function handleMenu(event) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }

  function handleClose(event) {
    event.stopPropagation();
    setAnchorEl(null);
  }

  function handleModal() {
    setModal({ isOpen: !modal.isOpen });
  }

  function handleDeleteProperty(propId) {
    setDeleteLoading(true);
    setCurrentPropertyId(propId);
    deleteProperty({
      variables: { formId, formPropertyId: propId }
    })
      .then(res => {
        setDeleteLoading(false);
        const formPropResponse = res.data.formPropertiesDelete;
        if (formPropResponse.message === 'New version created') {
          history.push(`/edit_form/${formPropResponse.newFormVersion.id}`);
        }

        showSnackbar({ type: messageType.success, message: t('misc.deleted_form_property') });
        refetch();
        formDetailRefetch();
      })
      .catch(err => {
        showSnackbar({ type: messageType.error, message: formatError(err.message) });
        setDeleteLoading(false);
      });
  }

  if (!editMode) {
    return null;
  }

  return (
    <>
      <DetailsDialog
        handleClose={handleModal}
        open={modal.isOpen}
        title={t('actions.update_form_property')}
        color="primary"
      >
        <Container>
          <FormPropertyCreateForm
            formId={formId}
            refetch={refetch}
            propertyId={propertyId}
            categoryId={categoryId}
            close={handleModal}
          />
        </Container>
      </DetailsDialog>
      {isDeletingProperty && currentPropId === propertyId ? (
        <Spinner />
      ) : (
        <>
          <IconButton
            aria-label="category-options"
            size="large"
            data-testid='action_options'
            onClick={event => menuData.handleMenu(event)}
          >
            <MoreVertIcon color="primary" />
          </IconButton>
          <MenuList
            open={menuData.open}
            anchorEl={menuData.anchorEl}
            handleClose={menuData.handleClose}
            list={menuData.menuList}
          />
        </>
      )}
    </>
  );
}

FormPropertyAction.defaultProps = {
  formDetailRefetch: () => {}
}

FormPropertyAction.propTypes = {
  propertyId: PropTypes.string.isRequired,
  categoryId: PropTypes.string.isRequired,
  formId: PropTypes.string.isRequired,
  editMode: PropTypes.bool.isRequired,
  refetch: PropTypes.func.isRequired,
  formDetailRefetch: PropTypes.func
};
