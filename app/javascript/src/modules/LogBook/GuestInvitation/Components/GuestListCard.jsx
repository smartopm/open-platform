import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import PropTypes from 'prop-types';
import CardContent from '@mui/material/CardContent';
import { useHistory } from 'react-router';
import { Avatar, IconButton, Chip as LegacyChip, useMediaQuery, useTheme } from '@mui/material';
import MoreVert from '@mui/icons-material/MoreVert';

import { dateToString, dateTimeToString } from '../../../../components/DateContainer';
import Text from '../../../../shared/Text';
import { checkRequests } from '../../utils';
import useLogbookStyles from '../../styles';
import { Spinner } from '../../../../shared/Loading';

export default function GuestListCard({
  invite,
  translate,
  tz,
  styles,
  handleInviteMenu,
  currentInvite
}) {
  const history = useHistory();
  const classes = useLogbookStyles();
  const isCancelled = invite.status === 'cancelled';
  const theme = useTheme();
  const matchesSmall = useMediaQuery(theme.breakpoints.down('lg'));

  function handleViewGuest() {
    history.push(`/request/${invite.guest?.request?.id}?type=view`);
  }
  return (
    <Card
      variant="outlined"
      className={styles.classes?.card}
      onClick={handleViewGuest}
      data-testid="guest_card"
      elevation={0}
    >
      <CardContent>
        <Grid container direction="row" alignItems="center">
          <Grid item xs={12} sm={12} md={6} lg={6} className={classes.avatarTimeSection}>
            <Grid container alignItems="center">
              <Grid item xs={3} data-testid="guest_info">
                {invite.thumbnailUrl ? (
                  <Avatar
                    alt={invite.guest?.request?.name}
                    src={invite.thumbnailUrl}
                    variant="square"
                    className={classes.avatar}
                    data-testid="video_preview"
                  />
                ) : (
                  <Avatar
                    alt={invite.guest?.request?.name}
                    className={classes.avatar}
                    variant="square"
                    data-testid="request_avatar"
                  >
                    {invite.guest?.request?.name?.charAt(0)}
                  </Avatar>
                )}
              </Grid>
              <Grid item xs={9} className={classes.timeDetails}>
                <Text
                  content={translate('guest_book.start_of_visit', {
                    date: dateToString(invite.entryTime.visitationDate)
                  })}
                  className={styles.classes?.text}
                  data-testid="start_of_visit"
                />
                <br />
                <Text
                  content={
                    invite.entryTime.visitEndDate
                      ? translate('guest_book.ends_on_date', {
                          date: dateToString(invite.entryTime.visitEndDate)
                        })
                      : translate('guest_book.ends_on_date', {
                          date: dateToString(invite.entryTime.visitationDate)
                        })
                  }
                  className={styles.classes?.text}
                  data-testid="ends_on_date"
                />
                <br />
                <Text
                  content={translate('guest_book.visit_time', {
                    startTime: dateTimeToString(invite.entryTime.startsAt),
                    endTime: dateTimeToString(invite.entryTime.endsAt)
                  })}
                  className={styles.classes?.text}
                  data-testid="visit_time"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={2}
            data-testid="guest_name"
            order={{ xs: 2, sm: 2, md: 3, lg: 2 }}
          >
            <Text
              color="primary"
              content={invite.guest?.request?.name}
              className={`${styles.classes?.text} ${classes.guestName}`}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} order={{ xs: 3, sm: 3, md: 2, lg: 3 }}>
            {currentInvite.loading && currentInvite.id === invite.id ? (
              <Spinner />
            ) : (
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
                spacing={!matchesSmall ? 2 : 0}
                className={classes.actionSection}
              >
                <Grid item data-testid="status" className={classes.chipRootAlign}>
                  <LegacyChip
                    label={
                      invite.guest?.request?.status === 'approved'
                        ? translate('guest_book.approved')
                        : translate('guest_book.pending')
                    }
                    color={invite.guest?.request?.status === 'approved' ? 'primary' : 'secondary'}
                    size="small"
                    className={classes.chipAlign}
                  />
                </Grid>
                <Grid item data-testid="validity" className={classes.chipRootAlign}>
                  <Chip
                    label={
                      checkRequests(invite.entryTime, translate, tz).valid
                        ? translate('guest_book.valid')
                        : translate('guest_book.invalid_now')
                    }
                    color={
                      checkRequests(invite.entryTime, translate, tz).valid ? 'success' : 'error'
                    }
                    data-testid="guest_validity"
                    size="small"
                    className={classes.chipAlign}
                  />
                </Grid>
                <Grid item className={classes.chipRootAlign}>
                  { isCancelled && (
                    <Chip
                      label={translate('guest_book.cancelled')}
                      color="error"
                      data-testid="invite_status"
                      size="small"
                      className={classes.chipAlign}
                    />
                  )}
                </Grid>
                <Grid item data-testid="more_options">
                  <IconButton
                    aria-controls="guest_invite_menu"
                    aria-haspopup="true"
                    data-testid="guest_invite_menu"
                    dataid={invite.id}
                    onClick={event => handleInviteMenu(event, invite)}
                    color="primary"
                    className={classes.moreOptionButton}
                    size="large"
                  >
                    <MoreVert />
                  </IconButton>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

GuestListCard.defaultProps = {
  styles: {
    classes: {}
  }
};

GuestListCard.propTypes = {
  invite: PropTypes.shape({
    entryTime: PropTypes.shape({
      startsAt: PropTypes.string,
      endsAt: PropTypes.string,
      visitEndDate: PropTypes.string,
      visitationDate: PropTypes.string
    }),
    guest: PropTypes.shape({
      request: PropTypes.shape({
        status: PropTypes.string,
        id: PropTypes.string,
        name: PropTypes.string
      }),
      imageUrl: PropTypes.string,
      name: PropTypes.string
    }),
    id: PropTypes.string,
    status: PropTypes.string.isRequired,
    thumbnailUrl: PropTypes.string
  }).isRequired,
  translate: PropTypes.func.isRequired,
  handleInviteMenu: PropTypes.func.isRequired,
  tz: PropTypes.string.isRequired,
  currentInvite: PropTypes.shape({
    id: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired
  }).isRequired,
  styles: PropTypes.shape({
    theme: PropTypes.shape({
      palette: PropTypes.shape({
        info: PropTypes.shape({ main: PropTypes.string }),
        success: PropTypes.shape({ main: PropTypes.string }),
        error: PropTypes.shape({ main: PropTypes.string })
      })
    }),
    // eslint-disable-next-line react/forbid-prop-types
    classes: PropTypes.object
  })
};
