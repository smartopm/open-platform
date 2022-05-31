import React, { useState } from 'react';
import { StyleSheet } from 'aphrodite';
import { Button, TextField, Snackbar, Container, Grid, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'
import { LocalizationProvider, MobileDateTimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { titleize } from '../../../utils/helpers';
import { Spinner } from '../../../shared/Loading'
import CenteredContent from '../../../shared/CenteredContent';


export default function DateAndTimeForm({
  start,
  end,
  update,
  type,
  close,
  data,
  children
}) {
  const [startDateTime, setStartDateTime] = React.useState(new Date(start));
  const [endDateTime, setEndDateTime] = useState(new Date(end));
  const [open, setOpen] = useState(false);
  const { t } = useTranslation(['common', 'form', 'logbook']);

  function handleSubmit(e) {
    e.preventDefault();
    update(startDateTime, endDateTime);
  }

  return (
    <Container>
      <Snackbar
        color="success"
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(!open)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        message={t('misc.misc_successfully_created', { type: titleize(type) })}
      />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Stack spacing={4} sx={{ marginTop: '20px' }}>
          <MobileDateTimePicker
            label={t('logbook:guest.start_day_time_of_visit')}
            value={startDateTime}
            onChange={newValue => {
              setStartDateTime(newValue);
            }}
            renderInput={params => <TextField {...params} />}
          />

          <MobileDateTimePicker
            label={t('logbook:guest.end_day_time_of_visit')}
            value={endDateTime}
            onChange={newValue => {
              setEndDateTime(newValue);
            }}
            renderInput={params => <TextField {...params} />}
          />
        </Stack>
        {children}
        {data.loading ? (
          <Spinner />
        ) : (
          <Grid container justifyContent="space-between" sx={{ marginTop: '2rem' }}>
            <Button
              variant="contained"
              aria-label={`${type}_cancel`}
              color="secondary"
              onClick={close}
            >
              {t('form_actions.cancel')}
            </Button>
            <Button
              variant="contained"
              type="submit"
              color="primary"
              disabled={data.loading}
              aria-label={`${type}_submit`}
              startIcon={data.loading && <Spinner />}
              onClick={handleSubmit}
            >
              {t('form_actions.submit')}
            </Button>
          </Grid>
        )}
        <br />
        {Boolean(data.msg.length) && <CenteredContent>{data.msg}</CenteredContent>}
      </LocalizationProvider>
    </Container>
  );
}

DateAndTimeForm.defaultProps = {
  children: <span />,
  start: '',
  end: ''
};

DateAndTimeForm.propTypes = {
  start: PropTypes.string,
  end: PropTypes.string,
  close: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  children: PropTypes.node,
  type: PropTypes.string.isRequired,
  data: PropTypes.shape({
    loading: PropTypes.bool,
    msg: PropTypes.string
  }).isRequired
};

export const discussStyles = StyleSheet.create({
  submitBtn: {
    width: '30%',
    boxShadow: 'none',
    marginTop: 50,
    alignItems: 'center',
    ':hover': {
      color: '#FFFFFF',
    },
  },
  cancelBtn: {
    width: '30%',
    marginRight: '20vw',
    marginTop: 50,
    alignItems: 'center',
    ':hover': {
      color: '#FFFFFF',
    },
  },
});
