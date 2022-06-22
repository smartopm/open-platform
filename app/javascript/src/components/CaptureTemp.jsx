import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-apollo';
import { Button, TextField, Snackbar, SnackbarContent, Grid } from '@mui/material';
import PropTypes from 'prop-types';
import CheckCircleIconBase from '@mui/icons-material/CheckCircle';
import Loading from '../shared/Loading';
import { TemperateRecord } from '../graphql/mutations';

// TODO: This needs to be revisited to match it with current designs
export default function CaptureTemp({ refId, refName, refType }) {
  const [recordTemp, { loading: mutationLoading }] = useMutation(TemperateRecord);
  const [open, setOpen] = useState(false);
  const [tempValue, setTempValue] = useState('');
  const [disabled, setDisabled] = useState('');
  const [tempErrorMessage, setTempErrorMessage] = useState('');
  const { t } = useTranslation(['logbook', 'common']);

  function handleClick() {
    if (!tempValue.trim().length) {
      setTempErrorMessage(t('common:errors.empty_input'));
      return;
    }
    setTempErrorMessage('');
    recordTemp({
      variables: { refId, temp: tempValue, refName, refType }
    }).then(() => {
      setOpen(!open);
      setTempValue('');
      setDisabled('none');
    });
  }
  return (
    <div style={{ pointerEvents: disabled }}>
      <Grid container spacing={2}>
        <Grid item xs={10} sm={8}>
          <TextField
            required
            fullWidth
            label="°C"
            className="tempvalue"
            variant="outlined"
            value={tempValue}
            size="small"
            onChange={event => setTempValue(event.target.value)}
            error={!!tempErrorMessage}
            helperText={tempErrorMessage}
            color="primary"
            type="number"
            inputProps={{
              'data-testid': 'temp-input'
            }}
          />
        </Grid>
        <Grid item xs={2} sm={4}>
          <Button
            className="button"
            variant="contained"
            color="primary"
            onClick={handleClick}
            data-testid="log-btn"
          >
            {t('common:misc.log')}
          </Button>
        </Grid>
      </Grid>
      <div className="col-2 justify-content-center" />

      {mutationLoading && <Loading />}

      <Snackbar
        className="snackBar"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(!open)}
        color="primary"
      >
        <SnackbarContent
          color="primary"
          message={
            <div className="row d-flex m-20">
              {' '}
              <CheckCircleIconBase />{' '}
              <span className="justify-content-center" id="client-snackbar">
                {t('logbook:logbook.temperature_recorded')}
              </span>{' '}
            </div>
          }
        />
      </Snackbar>
    </div>
  );
}

CaptureTemp.propTypes = {
  refId: PropTypes.string.isRequired,
  refName: PropTypes.string.isRequired,
  refType: PropTypes.string.isRequired
};
