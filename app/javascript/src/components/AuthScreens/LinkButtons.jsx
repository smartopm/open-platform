import React from 'react';
import { Button, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import CenteredContent from '../../shared/CenteredContent';

export default function LinkButtons({ handleEmailInputModal, handleModal }) {
  const { t } = useTranslation('login');

  return (
    <div style={{ overflow: 'hidden' }}>
      <Container maxWidth="xs">
        <CenteredContent>
          <Button
            size="medium"
            id="trigger-modal-dialog"
            data-testid="trouble-logging-in-btn"
            onClick={handleModal}
            style={{ textTransform: 'none' }}
          >
            <u>
              <strong>{t('login.request_account')}</strong>
            </u>
          </Button>

          <Button
            size="medium"
            id="trigger-modal-dialog"
            data-testid="password-reset-btn"
            onClick={handleEmailInputModal}
            style={{ textTransform: 'none' }}
          >
            <u>
              <strong>{t('login.forgot_password')}</strong>
            </u>
          </Button>
        </CenteredContent>
      </Container>
    </div>
  );
}

LinkButtons.propTypes = {
  handleEmailInputModal: PropTypes.func.isRequired,
  handleModal: PropTypes.func.isRequired,
};
