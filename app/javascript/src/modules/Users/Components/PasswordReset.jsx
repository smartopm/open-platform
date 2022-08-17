import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import { Dialog, DialogTitle, DialogContent, Box, IconButton } from '@mui/material';
import { Spinner } from '../../../shared/Loading';
import { ResetUserPasswordMutation } from '../../../graphql/mutations/user';
import useMutationWrapper from '../../../shared/hooks/useMutationWrapper';
import useStateIfMounted from '../../../shared/hooks/useStateIfMounted';

export default function PasswordRest({ openModal, setOpenModal, data }) {
  const { t } = useTranslation(['users', 'common']);
  const [username, setUsername] = useStateIfMounted('');
  const [password, setPassword] = useStateIfMounted('');
  const [resetPassword, loading] = useMutationWrapper(
    ResetUserPasswordMutation,
    resetPassData => setDataValues(resetPassData),
    t('common:misc.reset_password_successful')
  );

  function setDataValues(resetData) {
    setUsername(resetData?.adminResetPassword?.username);
    setPassword(resetData?.adminResetPassword?.password);
  }

  function resetModalState() {
    setOpenModal(false);
    setUsername('');
    setPassword('');
  }
  function handlePasswordReset() {
    resetPassword({
      userId: data.user.id,
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
              onClick={() => resetModalState()}
              size="large"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent style={{ paddingTop: '6px', paddingBottom: '10px' }}>
        {!username && !password && (
          <>
            <Typography gutterBottom>{t('common:misc.reset_disclaimer')}</Typography>
          </>
        )}

        {username && password && (
          <>
            <Typography gutterBottom>{t('common:misc.copy_credentials')}</Typography>
            <br />
            <Typography variant="subtitle2" gutterBottom>
              {t('users.username', { username })}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              {t('users.password', { password })}
            </Typography>
          </>
        )}
      </DialogContent>

      <Box style={{ textAlign: 'center', marginBottom: 16 }}>
        <Button
          disableElevation
          onClick={handlePasswordReset}
          disabled={loading || username !== '' || password !== ''}
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
const User = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  username: PropTypes.string,
});

PasswordRest.propTypes = {
  openModal: PropTypes.bool.isRequired,
  setOpenModal: PropTypes.func.isRequired,
  data: PropTypes.shape({ user: User }).isRequired,
};
