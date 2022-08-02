import React, { useState, useContext } from 'react';
import { useMutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import { Dialog, DialogTitle, DialogContent, Box, IconButton, useMediaQuery } from '@mui/material';
import { Utils as QbUtils } from 'react-awesome-query-builder';
import { Spinner } from '../../../shared/Loading';
import { formatError } from '../../../utils/helpers';
import { ResetUserPasswordUserMutation } from '../../../graphql/mutations/user';
import { SnackbarContext } from '../../../shared/snackbar/Context';

export default function PasswordRest({ openModal, setOpenModal, data }) {
  const { showSnackbar, messageType } = useContext(SnackbarContext);
  const [resetPassword] = useMutation(ResetUserPasswordUserMutation);
  const mobile = useMediaQuery('(max-width:800px)');

  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(['users', 'common']);

  const username =
    data?.user?.username !== null
      ? data?.user?.username
      : data?.user?.name.replace(' ', '').concat(
          Math.random()
            .toString(36)
            .slice(2, 5)
        );
  const password = QbUtils.uuid().slice(0, 17);
  function handlePasswordReset() {
    setOpenModal(false);
    setLoading(true);
    resetPassword({
      variables: {
        userId: data.user.id,
        username,
        password,
      },
    })
      .then(() => {
        setLoading(false);
        showSnackbar({
          type: messageType.success,
          message: t('common:misc.reset_password_successful'),
        });
      })
      .catch(err => {
        setLoading(false);
        showSnackbar({ type: messageType.error, message: formatError(err.message) });
      });
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
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
          <Typography gutterBottom>{t('common:misc.copy_credentials')}</Typography>
          <br />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div style={{ width: mobile ? '80%' : '50%' }}>
              <Typography variant="subtitle2" gutterBottom>
                {t('users.username', { username })}
              </Typography>
            </div>
            <div style={{ width: mobile ? '80%' : '50%' }}>
              <Typography variant="subtitle2" gutterBottom>
                {t('users.password', { password })}
              </Typography>
            </div>
          </div>
        </DialogContent>

        <Box textAlign="center">
          <Button
            disableElevation
            onClick={handlePasswordReset}
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
    </div>
  );
}
const User = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  username: PropTypes.string,
  userType: PropTypes.string,
  state: PropTypes.string,
  status: PropTypes.string,
  accounts: PropTypes.arrayOf(PropTypes.object),
  formUsers: PropTypes.arrayOf(PropTypes.object),
  permissions: PropTypes.arrayOf(PropTypes.object),
  community: PropTypes.shape({
    features: PropTypes.shape({
      Tasks: { features: [] },
      Messages: { features: [] },
      Payments: { features: [] },
      Properties: { features: [] },
      LogBook: { features: [] },
    }),
    securityManager: PropTypes.string,
  }),
});

PasswordRest.propTypes = {
  openModal: PropTypes.bool.isRequired,
  setOpenModal: PropTypes.func.isRequired,
  data: PropTypes.shape({ user: User }).isRequired,
};
