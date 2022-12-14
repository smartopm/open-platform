import React, { Fragment, useState, useRef, useContext } from 'react';
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
  Grid,
  Typography
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
import { copyText, downloadAsImage, objectAccessor } from '../../../utils/helpers';
import { SnackbarContext } from '../../../shared/snackbar/Context';

export default function FormMenu(
  { formId, anchorEl, handleClose, open, refetch, t, isPublic, formName }
) {
  const history = useHistory();
  const [isDialogOpen, setOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [message, setMessage] = useState({ isError: false, detail: '' });
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const [openQRCodeModal, setOpenQRCodeModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const ref = useRef(null);
  const matches = useMediaQuery('(max-width:600px)');

  const { showSnackbar, messageType } = useContext(SnackbarContext);

  const [publish] = useMutation(FormUpdateMutation);

  function handleConfirm(type) {
    setOpen(!isDialogOpen);
    handleClose();
    setActionType(type);
  }

  function updateForm() {
    publish({
      variables: { id: formId, status: objectAccessor(formStatus, actionType) }
    })
      .then(() => {
        showSnackbar({
          type: messageType.success,
          message: t('misc.form_action_success', { status: t(`form_status.${actionType}`) })
        });
        setOpen(!isDialogOpen);
        handleClose();
        refetch();
      })
      .catch(err => {
        showSnackbar({ type: messageType.error, message: err.message });
        setOpen(!isDialogOpen);
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

  function qrCodeAddress() {
    return `${window.location.protocol}/${window.location.hostname}/form/${formId}/public`;
  }

  async function handleTextCopy() {
    await copyText(qrCodeAddress(formId));
    setIsCopied(true);
  }

  function downloadQRCode() {
    const response = downloadAsImage(ref.current, formName);
    if (response?.error) setMessage({ isError: true, detail: t('errors.something_wrong_qr_code') });
  };

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
            <IconButton
              aria-label="close"
              onClick={toggleQRModal}
              data-testid="qrcode_form_modal_close_icon"
            >
              <CloseIcon color="primary" />
            </IconButton>
          </Grid>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{ display: 'flex', justifyContent: 'center', p: '30px' }}
          ref={ref}
        >
          <QRCode style={{ width: 275 }} value={qrCodeAddress(formId)} data-testid="main_qrcode" />
        </DialogContent>
        <DialogActions
          sx={{
            flexDirection: `${matches ? 'column' : 'row'}`,
            justifyContent: 'space-around',
            rowGap: `${matches ? '25px' : '0'}`,
            p: '30px'
          }}
        >
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Button onClick={handleTextCopy} variant="outlined" data-testid="qrcode_copy_btn">
              {t('common:form_actions.copy')}
            </Button>
            <Typography variant="caption" sx={{ mt: '10px' }} display="block" data-testid="copy_detail">
              {t(`${isCopied ? 'common:misc.copied' : 'common:misc.copy_info'}`)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Button
              color="primary"
              onClick={downloadQRCode}
              variant="contained"
              data-testid="qrcode_download_btn"
            >
              {t('common:misc.download')}
            </Button>
            <Typography variant="caption" sx={{ mt: '10px' }} display="block" data-testid="download_detail">
              {message.isError ? message.detail : t('common:misc.download_info')}
            </Typography>
          </Grid>
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
