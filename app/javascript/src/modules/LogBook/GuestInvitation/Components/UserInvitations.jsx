import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useMediaQuery } from '@material-ui/core';
import Chip from '@mui/material/Chip';
import { useTranslation } from 'react-i18next';
import Card from '../../../../shared/Card';
// import { dateTimeToString, dateToString } from '../../../../components/DateContainer';
import { checkRequests } from '../../utils';
import { Context as AuthStateContext } from '../../../../containers/Provider/AuthStateProvider';
import Avatar from '../../../../components/Avatar';

export default function UserInvitations({ invitation, handleViewUser }) {
  const authState = useContext(AuthStateContext);
  const { t } = useTranslation('logbook');

  const matches = useMediaQuery('(max-width:800px)');

  const timeZone = authState.user.community.timezone;
  const isValid = checkRequests(invitation.entryTime, t, timeZone).valid;
  return (
    <Card key={invitation.id}>
      <Grid container spacing={1}>
        <Grid item md={2} xs={4}>
          <Avatar imageUrl={invitation.host.imageUrl} user={invitation.host} alt="avatar-image" />
        </Grid>
        <Grid item md={2} xs={8}>
          <Typography variant="caption" color="primary" onClick={handleViewUser}>
            <Link to={`/user/${invitation.host.id}`}>{invitation.host.name}</Link>
          </Typography>
        </Grid>
        <Grid item md={3} xs={12} style={!matches ? { paddingTop: '15px' } : {}}>
          <Typography variant="caption" gutterButtom>
            Starts:
          </Typography>
          <Typography variant="caption" gutterButtom>
            Ends:
          </Typography>
        </Grid>
        <Grid item md={3} xs={12} style={!matches ? { paddingTop: '15px' } : {}}>
          <Typography variant="caption" gutterButtom>
            Repeats:
          </Typography>
          <Typography variant="caption" gutterButtom>
            Invited Created:
          </Typography>
        </Grid>
        <Grid item md={2} xs={12} style={!matches ? { paddingTop: '15px' } : {}}>
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

UserInvitations.propTypes = {
  invitation: PropTypes.shape({
    entryTime: PropTypes.shape({
      id: PropTypes.string,
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
  handleViewUser: PropTypes.func.isRequired
};
