import React, { useState } from 'react';
import { Button, Container, Grid, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'aphrodite';
import PropTypes from 'prop-types';
import MessageAlert from '../../../../components/MessageAlert';
import GuestTime from '../../Components/GuestTime';
import { Spinner } from '../../../../shared/Loading';
import CenteredContent from '../../../../shared/CenteredContent';

export default function GuestUpdateForm({ type, close, data, onUpdate, message }) {
  const [details, setDetails] = useState({ message: '', isError: false });
  const [guestData, setGuestData] = useState(data);
  const { t } = useTranslation(['common', 'form', 'logbook']);

  function handleInputChange(event, index) {
    const { name, value } = event.target;
    if (index == null) {
      setGuestData({
        ...guestData,
        [name]: value
      });
    }
  }

  function handleChangeOccurrence(day) {
    if (guestData.occursOn.includes(day)) {
      const leftDays = guestData.occursOn.filter(d => d !== day);
      setGuestData({
        ...guestData,
        occursOn: leftDays
      });
      return;
    }
    setGuestData({
      ...guestData,
      occursOn: [...guestData.occursOn, day]
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setGuestData({ ...guestData, loading: true });
    onUpdate(guestData);
  }

  return (
    <Container sx={{ mt: '20px' }}>
      <MessageAlert
        type={!details.isError ? 'success' : 'error'}
        message={details.message}
        open={!!details.message}
        handleClose={() => setDetails({ ...details, message: '' })}
      />
      <GuestTime
        days={guestData.occursOn}
        userData={guestData}
        handleChange={handleInputChange}
        handleChangeOccurrence={handleChangeOccurrence}
        update
      />
      <Box sx={{ marginTop: '2rem' }}>
        {guestData.loading ? (
          <Spinner />
        ) : (
          <Grid container justifyContent="space-between">
            <Button
              variant="contained"
              aria-label={`${type}_cancel`}
              color="secondary"
              onClick={close}
              data-testid="close_button"
            >
              {t('form_actions.cancel')}
            </Button>
            <Button
              variant="contained"
              type="submit"
              color="primary"
              disabled={guestData.loading}
              aria-label={`${type}_submit`}
              startIcon={guestData.loading && <Spinner />}
              onClick={handleSubmit}
              data-testid="update_button"
            >
              {t('form_actions.submit')}
            </Button>
          </Grid>
        )}
      </Box>
      <br />
      {Boolean(message.length) && <CenteredContent>{message}</CenteredContent>}
    </Container>
  );
}


GuestUpdateForm.defaultProps = {
  message: '',
  type: 'update'
};

GuestUpdateForm.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  data: PropTypes.shape({
    id: PropTypes.string,
    status: PropTypes.string,
    startsAt: PropTypes.string,
    endsAt: PropTypes.string,
    occursOn: PropTypes.arrayOf(PropTypes.string),
    visitationDate: PropTypes.string,
    visitEndDate: PropTypes.string,
    loading: PropTypes.bool
  }).isRequired,
  message: PropTypes.string,
  type: PropTypes.string,
  close: PropTypes.func.isRequired
};

export const discussStyles = StyleSheet.create({
  submitBtn: {
    width: '30%',
    boxShadow: 'none',
    marginTop: 50,
    alignItems: 'center',
    ':hover': {
      color: '#FFFFFF'
    }
  },
  cancelBtn: {
    width: '30%',
    marginRight: '20vw',
    marginTop: 50,
    alignItems: 'center',
    ':hover': {
      color: '#FFFFFF'
    }
  }
});