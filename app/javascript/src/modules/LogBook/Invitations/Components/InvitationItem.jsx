import React from 'react';
import { Card, Grid, Avatar, Chip, Typography, Button } from '@mui/material';
import PropTypes from 'prop-types';
import { checkRequests } from '../../utils';
import Text from '../../../../shared/Text';
import { dateTimeToString, dateToString } from '../../../../components/DateContainer';
import useLogbookStyles from '../../styles';
import { Spinner } from '../../../../shared/Loading';

export default function Invitation({
  visit,
  timeZone,
  handleGrantAccess,
  handleViewUser,
  t,
  matches,
  theme,
  loadingStatus
}) {
  const classes = useLogbookStyles();

  return (
    <Card
      key={visit.id}
      sx={{ mb: 2 }}
    >
      <Grid container spacing={1}>
        <Grid item md={2} xs={5}>
          {visit.thumbnailUrl ? (
            <Avatar
              alt={visit.guest?.name}
              src={visit.thumbnailUrl}
              variant="square"
              className={classes.avatar}
              data-testid="image_preview"
            />
          ) : (
            <Avatar
              alt={visit.guest?.name}
              className={classes.avatar}
              variant="square"
              data-testid="request_preview"
            >
              {visit.name.charAt(0)}
            </Avatar>
          )}
        </Grid>
        <Grid item md={2} xs={7}>
          <Typography variant="caption" color="primary">
            {visit.name}
          </Typography>
          <br />
          <Typography variant="caption">
            {t('logbook:logbook.host')}
            {' '}
          </Typography>
          {visit.multipleInvites ? (
            <Text
              color="primary"
              content={t('guest_book.multiple')}
              data-testid="multiple_host"
              onClick={event => handleViewUser(event, visit.guest, true)}
            />
          ) : (
            <Text
              color="secondary"
              content={visit.user.name}
              data-testid="user_name"
              onClick={event => handleViewUser(event, visit.user, false)}
            />
          )}
          <div style={{ paddingTop: '7px' }} data-testid="request_status">
            <Chip
              data-testid="user-entry"
              label={
                visit.status === 'approved' ? t('guest_book.approved') : t('guest_book.pending')
              }
              color={visit.status === 'approved' ? 'primary' : 'secondary'}
              size="small"
            />
          </div>
        </Grid>
        <Grid item md={2} xs={6} style={!matches ? { paddingTop: '15px' } : {}}>
          <Typography variant="caption">
            {t('guest_book.start_of_visit', {
              date: dateToString(visit.closestEntryTime?.visitationDate),
            })}
          </Typography>
        </Grid>
        <Grid item md={2} xs={6} style={!matches ? { paddingTop: '15px' } : {}}>
          <Typography variant="caption">
            {t('guest_book.visit_time', {
              startTime: dateTimeToString(visit.closestEntryTime?.startsAt),
              endTime: dateTimeToString(visit.closestEntryTime?.endsAt),
            })}
          </Typography>
        </Grid>
        <Grid item md={2} xs={6} style={!matches ? { paddingTop: '15px' } : {}}>
          <Chip
            label={
              checkRequests(visit.closestEntryTime, t, timeZone).valid
                ? t('guest_book.valid')
                : t('guest_book.invalid_now')
            }
            style={{
              background: checkRequests(visit.closestEntryTime, t, timeZone).valid
                ? theme.palette.success.main
                : theme.palette.error.main,
              color: 'white',
              marginRight: '16px',
            }}
            size="small"
            data-testid="invitation-status"
          />
        </Grid>
        <Grid item md={2} xs={8} style={!matches ? { paddingTop: '8px' } : {}}>
          <Button
            disabled={
              !checkRequests(visit.closestEntryTime, t, timeZone).valid ||
              (loadingStatus.loading && Boolean(loadingStatus.currentId)) ||
              visit.guest?.status === 'deactivated'
            }
            variant="outlined"
            color="primary"
            onClick={event => handleGrantAccess(event, visit)}
            disableElevation
            startIcon={loadingStatus.loading && loadingStatus.currentId === visit.id && <Spinner />}
            data-testid="grant_access_btn"
            sx={{ mt: 1 }}
          >
            {t('access_actions.grant_access')}
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
}

Invitation.defaultProps = {
  timeZone: null
}

Invitation.propTypes = {
  visit: PropTypes.shape(PropTypes.Object).isRequired,
  t: PropTypes.func.isRequired,
  theme: PropTypes.shape(PropTypes.Object).isRequired,
  loadingStatus: PropTypes.shape(PropTypes.Object).isRequired,
  timeZone: PropTypes.string,
  handleGrantAccess: PropTypes.func.isRequired,
  handleViewUser: PropTypes.func.isRequired,
  matches: PropTypes.bool.isRequired,
};
