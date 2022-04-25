import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dateToString } from '../../../../components/DateContainer';

export default function LeadEvent({ leadEvent }) {
  const { t } = useTranslation('common');
  return (
    <div>
      {leadEvent !== undefined && (
        <>
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
                <Grid item md={5} xs={12}>
                  <Typography variant="body2" data-testid="events">
                    {leadEvent?.name}
                  </Typography>
                </Grid>
                <Grid item md={3} xs={12}>
                  <Typography variant="body2" data-testid="events">
                    {dateToString(leadEvent?.createdAt)}
                  </Typography>
                </Grid>
                <Grid item md={4} xs={12}>
                  <Typography variant="body2" data-testid="events">
                    {`${t('lead_management.entered_by')}  ${leadEvent?.actingUser?.name}`}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
    </div>
  );
}

LeadEvent.defaultProps = {
  leadEvent: {}
};
const event = {
  createdAt: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  name: PropTypes.string,
  actingUser: PropTypes.shape({
    name: PropTypes.string
  })
};

LeadEvent.propTypes = {
  leadEvent: PropTypes.shape(event)
};
