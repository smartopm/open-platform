import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dateToString } from '../../../../components/DateContainer';

export default function LeadEvent({ leadEvent }) {
  const { t } = useTranslation('common');
  return (
    <div key={leadEvent?.id}>
      <Grid
        container
        spacing={1}
        style={{
          marginBottom: '20px'
        }}
      >
        <Grid item md={12} xs={12}>
          <Grid
            container
            spacing={2}
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Grid item md={6} xs={12}>
              <Typography variant="body2" data-testid="events">
                {leadEvent?.name}
              </Typography>
            </Grid>
            <Grid item md={2} xs={12}>
              <Typography variant="body2" data-testid="events">
                {dateToString(leadEvent?.createdAt)}
              </Typography>
            </Grid>
            <Grid item md={4} xs={12}>
              <Typography variant="body2" data-testid="events">
                {t('lead_management.entered_by')}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

LeadEvent.propTypes = {
  leadEvent: PropTypes.string.isRequired
};
