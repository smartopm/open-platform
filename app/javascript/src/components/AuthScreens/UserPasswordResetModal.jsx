import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import { Dialog, DialogTitle, DialogContent, Box, IconButton, TextField } from '@mui/material';
import { Spinner } from '../../shared/Loading';
import { UserPasswordResetMutation } from '../../graphql/mutations/user';
import useMutationWrapper from '../../shared/hooks/useMutationWrapper';

export default function UserPasswordResetModal({ openModal, setOpenModal }) {
  const { t } = useTranslation(['users', 'common']);
  const [resetPassword, loading] = useMutationWrapper(
    UserPasswordResetMutation,
    reset,
    t('common:misc.reset_password_success_message')
  );

  const initialValues = {
    email: '',
  };
  const [value, setValue] = useState(initialValues);
  function reset() {
    setOpenModal(false);
  }

  function handlePasswordReset() {
    resetPassword({
      email: value.email,
    });
  }

  return (
    <Dialog
      open={openModal}
      fullWidth
      maxWidth="sm"
      scroll="paper"
      aria-labelledby="reset_user_password"
    >
      <DialogTitle id="reset_user_password" data-testid="reset_user_password">
        <Box display="flex" alignItems="center">
          <Box flexGrow={1} style={{ color: '', fontSize: '24px' }}>
            {t('users.confirm_reset_password')}
          </Box>
          <Box>
            <IconButton
              data-testid="password-reset-close-icon"
              onClick={() => setOpenModal(false)}
              size="large"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent style={{ paddingTop: '6px', paddingBottom: '10px' }}>
        <Typography gutterBottom>{t('common:misc.reset_disclaimer')}</Typography>
        <Typography gutterBottom>{t('common:misc.enter_email')}</Typography>
        <br />
        <TextField
          variant="outlined"
          margin="normal"
          type="email"
          required
          size="small"
          fullWidth
          name="email"
          value={value.email}
          label={t('common:form_fields.email')}
          onChange={event => setValue({ ...value, email: event.target.value })}
        />
      </DialogContent>

      <Box style={{ textAlign: 'center', marginBottom: 16 }}>
        <Button
          disableElevation
          onClick={handlePasswordReset}
          disabled={loading}
          startIcon={loading && <Spinner />}
          color="primary"
          variant="contained"
          data-testid="post-btn"
          style={{ color: 'white', width: '30%', marginBottom: '12px' }}
          autoFocus
        >
          {t('common:misc.reset')}
        </Button>
      </Box>
    </Dialog>
  );
}

UserPasswordResetModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  setOpenModal: PropTypes.func.isRequired,
};
