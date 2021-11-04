import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import PropTypes from 'prop-types';
import CardContent from '@material-ui/core/CardContent';
import { useHistory } from 'react-router';
import { dateToString, dateTimeToString } from '../../../../components/DateContainer';
import Text from '../../../../shared/Text';
import { checkRequests } from '../../utils';
import Avatar from '../../../../components/Avatar';
import Label from '../../../../shared/label/Label';

export default function GuestListCard({ invite, translate, tz, styles }) {
  const history = useHistory();
  function handleViewGuest() {
    history.push(`/request/${invite.guest.request.id}?type=view`);
  }
  return (
    <Card className={styles.classes?.card} onClick={handleViewGuest} data-testid="guest_card">
      <CardContent>
        <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
          <Grid item xs={6} sm={4} lg={3} data-testid="guest_info">
            <Avatar imageUrl={invite.guest.imageUrl} user={invite.guest} alt="avatar-image" />
            <Text content={invite.guest?.name} className={styles.classes?.text} />
          </Grid>
          <Grid item xs={6} sm={4} lg={3} data-testid="start_of_visit">
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
            <Label
              title={invite.guest.request.status === 'pending' ? 'Pending' : 'Approved'}
              color={
                invite.guest.request.status === 'pending'
                  ? styles.theme.palette.info.main
                  : styles.theme.palette.success.main
              }
            />
          </Grid>
          <Grid item xs={6} sm={4} lg={1} data-testid="validity">
            <Label
              title={checkRequests(invite.entryTime, translate, tz).title}
              color={checkRequests(invite.entryTime, translate, tz).color}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

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
        id: PropTypes.string
      }),
      imageUrl: PropTypes.string,
      name: PropTypes.string
    })
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
    classes: PropTypes.shape({
      // eslint-disable-next-line react/forbid-prop-types
      text: PropTypes.object,
      // eslint-disable-next-line react/forbid-prop-types
      card: PropTypes.object
    })
  }).isRequired
};
