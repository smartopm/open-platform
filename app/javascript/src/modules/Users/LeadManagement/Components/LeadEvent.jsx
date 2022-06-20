import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dateToString } from '../../../../components/DateContainer';

export default function LeadEvent({ leadEvent }) {
  const { t } = useTranslation('common');
  const mobile = useMediaQuery('(max-width:800px)');
  return (
    <div>
      {leadEvent !== undefined && (
        <>
          <Grid container>
            <Grid item md={12} xs={12}>
              <Grid
                container
                style={{
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Grid item md={5} xs={12}>
                  <Typography variant="body2" data-testid="event-name">
                    {leadEvent?.name}
                  </Typography>
                </Grid>
                <Grid item md={3} xs={12} style={{ textAlign: !mobile && 'right' }}>
                  <Typography variant="body2" data-testid="event-date">
                    {dateToString(leadEvent?.createdAt)}
                  </Typography>
                </Grid>
                <Grid item md={4} xs={12} style={{ textAlign: !mobile && 'right' }}>
                  <Typography variant="body2" data-testid="event-created-by">
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
