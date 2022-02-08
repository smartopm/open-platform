import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import Card from '../../../../shared/Card';
import { dateToString } from '../../../../components/DateContainer';
import { checkRequests } from '../../utils';
import { Context as AuthStateContext } from '../../../../containers/Provider/AuthStateProvider';
import Avatar from '../../../../components/Avatar';
import { formatReoccuringDays } from '../helpers';

export default function InviteListCard({ invitation }) {
  const authState = useContext(AuthStateContext);
  const { t } = useTranslation('logbook');
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.only('xs'));
  const classes = useStyles()
  const timeZone = authState.user.community.timezone;
  const isValid = checkRequests(invitation.entryTime, t, timeZone).valid;

  return (
    <Card key={invitation.id}>
      <Grid container spacing={1}>
        <Grid item sm={1} xs={2} className={classes.hostAvatar}>
          <Avatar imageUrl={invitation.host.imageUrl} user={invitation.host} alt="host_avatar" />
        </Grid>
        <Grid item md={3} sm={5} xs={10} className={classes.hostDetailsAlign}>
          <Typography variant="subtitle1" color="primary" data-testid="host_name">
            <Link style={{ textDecoration: 'none' }} to={`/user/${invitation.host.id}`}>{invitation.host.name}</Link>
          </Typography>
        </Grid>
        <Grid item md={3} sm={6} xs={12}>
          <Typography variant="body2" gutterBottom data-testid="starts_at_time">
            {t('guest_book.starts', { date: dateToString(invitation.entryTime.startsAt, 'YYYY-MM-DD, HH:mm') })}
          </Typography>
          <Typography variant="body2" gutterBottom data-testid="ends_at_time">
            {t('guest_book.ends', { date: dateToString(invitation.entryTime.endsAt, 'YYYY-MM-DD, HH:mm') })}
          </Typography>
        </Grid>
        <Grid item md={3} sm={6} xs={12}>
          <Typography variant="body2" gutterBottom data-testid="reoccuring_days">
            {`${t('guest_book.repeats')}: ${formatReoccuringDays(invitation.entryTime.occursOn)}`}
          </Typography>
          <Typography variant="body2" gutterBottom data-testid="created_at">
            {t('guest_book.invite_created_at', { date: dateToString(invitation.createdAt, 'YYYY-MM-DD') })}
          </Typography>
        </Grid>
        <Grid item md={2} sm={6} xs={12} className={!matches ? classes.hostDetailsAlign : ''} data-testid="validity">
          <Chip
            label={isValid ? t('guest_book.valid') : t('guest_book.invalid_now')}
            color={isValid ? 'success' : 'error'}
            size="small"
          />
        </Grid>
      </Grid>
    </Card>
  );
}

InviteListCard.propTypes = {
  invitation: PropTypes.shape({
    entryTime: PropTypes.shape({
      id: PropTypes.string,
      occursOn: PropTypes.arrayOf(PropTypes.string),
      startsAt: PropTypes.string,
      endsAt: PropTypes.string,
      visitationDate: PropTypes.string
    }),
    host: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.string,
      imageUrl: PropTypes.string
    }),
    id: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
};


const useStyles = makeStyles(() => ({
  hostDetailsAlign: {
    marginTop: 10
  },
  hostAvatar: {
    marginTop: 4
  },
  hostProfileLink: {
    textDecoration: 'none'
  }
}))