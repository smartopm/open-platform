import React, { Fragment, useState } from 'react';
import {
  MenuItem,
  Menu,
  Dialog,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  DialogActions,
  IconButton,
  Button,
  Grid
} from '@mui/material';
import { useMutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { useTheme } from '@mui/styles';
import CloseIcon from '@mui/icons-material/Close';
import { QRCode } from 'react-qr-svg';
import { FormUpdateMutation } from '../graphql/forms_mutation';
import { formStatus } from '../../../utils/constants';
import { ActionDialog } from '../../../components/Dialog';
import MessageAlert from '../../../components/MessageAlert';
import { objectAccessor } from '../../../utils/helpers';

export default function FormMenu(
  { formId, anchorEl, handleClose, open, refetch, t, isPublic, formName }
) {
  const history = useHistory();
  const [isDialogOpen, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [message, setMessage] = useState({ isError: false, detail: '' });
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const [openQRCodeModal, setOpenQRCodeModal] = useState(false);

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

  function toggleQRModal(event) {
    event.stopPropagation();
    setOpenQRCodeModal(!openQRCodeModal);
  }

  function qrCodeAddress(id) {
    return `${window.location.protocol}//${window.location.hostname}/form/${id}/public`;
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

      <Dialog
        fullScreen={fullScreen}
        open={openQRCodeModal}
        fullWidth
        maxWidth="sm"
        onClose={toggleQRModal}
        aria-labelledby="responsive-edit-dialog-title"
      >
        <DialogTitle id="responsive-edit-dialog-title" sx={{ pb: '0' }}>
          <Grid sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{t('common:menu.form_qrcode_header', { formName })}</span>
            <IconButton aria-label="close" onClick={toggleQRModal}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', justifyContent: 'center', p: '30px' }}>
          <QRCode style={{ width: 280 }} value={qrCodeAddress(formId)} />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', p: '30px' }}>
          <Button onClick={() => {}}>{t('common:form_actions.copy')}</Button>
          <Button onClick={toggleQRModal}>{t('common:form_actions.cancel')}</Button>
        </DialogActions>
      </Dialog>
      <Menu
        id={`long-menu-${formId}`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        keepMounted={false}
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
          {isPublic && (
            <MenuItem
              id="form_qrcode"
              className="form_qrcode"
              key="view_qrcode"
              onClick={event => {
                toggleQRModal(event);
              }}
            >
              {t('common:menu.form_qrcode')}
            </MenuItem>
          )}
        </div>
      </Menu>
    </>
  );
}

FormMenu.defaultProps = {
  anchorEl: {},
  isPublic: false,
  formName: ''
};
FormMenu.propTypes = {
  formId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  anchorEl: PropTypes.object,
  t: PropTypes.func.isRequired,
  isPublic: PropTypes.bool,
  formName: PropTypes.string
};
