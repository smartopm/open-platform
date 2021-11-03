import React from 'react';
import { Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { dateToString, dateTimeToString } from '../../../../components/DateContainer';
import Text from '../../../../shared/Text';
import Label from '../../../../shared/label/Label';
import { checkRequests } from '../../utils';
import Avatar from '../../../../components/Avatar';

export default function RenderMyGuest(invite, translate, tz, classes) {
  return [
    {
      'Guest Name': (
        <Grid item xs={6} md={3} data-testid="guest_name">
          <Avatar imageUrl={invite.guest.imageUrl} user={invite.guest} alt="avatar-image" />
          <Link to={`/user/${invite.guest?.id}`}>
            <Text content={invite.guest?.name} className={classes.text} />
          </Link>
        </Grid>
      ),
      'Start of Visit': (
        <Grid item xs={6} md={2} data-testid="start_of_visit">
          <Text
            content={translate('guest_book.start_of_visit', {
              date: dateToString(invite.entryTime.visitationDate)
            })}
            className={classes.text}
          />
        </Grid>
      ),
      'End of Visit': (
        <Grid item xs={6} md={2} data-testid="end_of_visit">
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
            className={classes.text}
          />
        </Grid>
      ),
      'Access Time': (
        <Grid item xs={6} md={2} data-testid="access_time">
          <Text
            content={translate('guest_book.visit_time', {
              startTime: dateTimeToString(invite.entryTime.startsAt),
              endTime: dateTimeToString(invite.entryTime.endsAt)
            })}
            className={classes.text}
          />
        </Grid>
      ),
      status: (
        <Grid item xs={6} md={1} data-testid="status">
          <Label
            title={invite.guest.request.status === 'pending' ? 'Pending' : 'Approved'}
            color={invite.guest.request.status === 'pending' ? 'blue' : 'green'}
          />
        </Grid>
      ),
      validity: (
        <Grid item xs={6} md={1} data-testid="validity">
          <Label
            title={checkRequests(invite.entryTime, translate, tz).title}
            color={checkRequests(invite.entryTime, translate, tz).color}
          />
        </Grid>
      )
    }
  ];
}


