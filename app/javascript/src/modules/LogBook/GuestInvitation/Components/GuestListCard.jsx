import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import PropTypes from 'prop-types';
import CardContent from '@material-ui/core/CardContent';
import { useHistory } from 'react-router';
import { Chip, Avatar } from '@material-ui/core';
import { dateToString, dateTimeToString } from '../../../../components/DateContainer';
import Text from '../../../../shared/Text';
import { checkRequests } from '../../utils';
import useLogbookStyles from '../../styles';

export default function GuestListCard({ invite, translate, tz, styles }) {
  const history = useHistory();
  const classes = useLogbookStyles();
  function handleViewGuest() {
    history.push(`/request/${invite.guest.request.id}?type=view`);
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
        <Grid container direction="row" spacing={2}>
          <Grid item xs={6} sm={4} lg={2} data-testid="guest_info">
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
          <Grid item xs={6} sm={4} lg={2} data-testid="guest_name">
            <Text content={invite.guest?.request?.name} className={styles.classes?.text} />
          </Grid>
          <Grid item xs={6} sm={4} lg={2} data-testid="start_of_visit">
            <Text
              content={translate('guest_book.start_of_visit', {
                date: dateToString(invite.entryTime.visitationDate)
              })}
              className={styles.classes?.text}
            />
          </Grid>
          <Grid item xs={6} sm={4} lg={2} data-testid="ends_on_date">
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
            />
          </Grid>
          <Grid item xs={6} sm={4} lg={2} data-testid="visit_time">
            <Text
              content={translate('guest_book.visit_time', {
                startTime: dateTimeToString(invite.entryTime.startsAt),
                endTime: dateTimeToString(invite.entryTime.endsAt)
              })}
              className={styles.classes?.text}
            />
          </Grid>
          <Grid item xs={6} sm={4} lg={1} data-testid="status">
            <Chip
              label={
                invite.guest.request.status === 'approved'
                  ? translate('guest_book.approved')
                  : translate('guest_book.pending')
              }
              color={invite.guest.request.status === 'approved' ? 'primary' : 'secondary'}
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={4} lg={1} data-testid="validity">
            <Chip
              label={
                checkRequests(invite.entryTime, translate, tz).valid
                  ? translate('guest_book.valid')
                  : translate('guest_book.invalid_now')
              }
              style={{
                background: checkRequests(invite.entryTime, translate, tz).valid
                  ? styles.theme.palette.success?.main
                  : styles.theme.palette.error?.main,
                color: 'white'
              }}
              data-testid="guest_validity"
              size="small"
            />
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
    thumbnailUrl: PropTypes.string
  }).isRequired,
  translate: PropTypes.func.isRequired,
  tz: PropTypes.string.isRequired,
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
