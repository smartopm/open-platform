import React, { Fragment, useState } from 'react';
import { MenuItem, Menu } from '@mui/material';
import { useMutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { FormUpdateMutation } from '../graphql/forms_mutation';
import { formStatus } from '../../../utils/constants';
import { ActionDialog } from '../../../components/Dialog';
import MessageAlert from '../../../components/MessageAlert';
import { objectAccessor } from '../../../utils/helpers';

export default function FormMenu({ formId, anchorEl, handleClose, open, refetch, t }) {
  const history = useHistory();
  const [isDialogOpen, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [message, setMessage] = useState({ isError: false, detail: '' });

  const [publish] = useMutation(FormUpdateMutation);

  function handleConfirm(type) {
    setOpen(!isDialogOpen);
    handleClose();
    setActionType(type);
  }

  function handleAlertClose() {
    setAlertOpen(false);
  }

  function updateForm() {
    publish({
      variables: { id: formId, status: objectAccessor(formStatus, actionType) }
    })
      .then(() => {
        setMessage({
          isError: false,
          detail: t('misc.form_action_success', { status: t(`form_status.${actionType}`) })
        });
        setOpen(!isDialogOpen);
        setAlertOpen(true);
        handleClose();
        refetch();
      })
      .catch(err => {
        setMessage({ isError: true, detail: err.message });
        setOpen(!isDialogOpen);
        setAlertOpen(true);
      });
  }

  function routeToEdit(event) {
    event.stopPropagation();
    history.push(`/edit_form/${formId}`);
  }

  return (
    <>
      <ActionDialog
        open={isDialogOpen}
        handleClose={() => handleConfirm('')}
        handleOnSave={updateForm}
        message={t('misc.form_confirm_message', {
          actionType: t(`form_status_actions.${actionType}`)
        })}
        type={actionType === 'delete' ? 'warning' : 'confirm'}
      />

      <MessageAlert
        type={message.isError ? 'error' : 'success'}
        message={message.detail}
        open={alertOpen}
        handleClose={handleAlertClose}
      />
      <Menu
        id={`long-menu-${formId}`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        keepMounted={false}
        PaperProps={{
          style: {
            width: 200
          }
        }}
      >
        <div>
          <MenuItem
            id="edit_button"
            className="edit-form-btn"
            key="edit_form"
            onClick={routeToEdit}
          >
            {t('common:menu.edit')}
          </MenuItem>
          <MenuItem id="publish_button" key="publish_form" onClick={() => handleConfirm('publish')}>
            {t('common:menu.publish')}
          </MenuItem>
          <MenuItem id="delete_button" key="delete_form" onClick={() => handleConfirm('delete')}>
            {t('common:menu.delete')}
          </MenuItem>
          <MenuItem
            id="submit_form"
            className="submit_form"
            key="view_entries"
            onClick={() => history.push(`/form/${formId}/private`)}
          >
            {t('common:menu.submit_form')}
          </MenuItem>
        </div>
      </Menu>
    </>
  );
}

FormMenu.defaultProps = {
  anchorEl: {}
};
FormMenu.propTypes = {
  formId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  anchorEl: PropTypes.object,
  t: PropTypes.func.isRequired
};
