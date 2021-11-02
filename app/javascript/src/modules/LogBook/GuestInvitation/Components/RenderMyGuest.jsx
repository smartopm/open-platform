/* eslint-disable complexity */
import React from 'react';
import { Button, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import CenteredContent from '../../../../components/CenteredContent';
import { dateToString, dateTimeToString } from '../../../../components/DateContainer';
import Text from '../../../../shared/Text';
import Label from '../../../../shared/label/Label';
import { checkRequests } from '../../utils';
import Avatar from '../../../../components/Avatar';
import { Spinner } from '../../../../shared/Loading';

export default function RenderMyGuest(
  invite,
  grantAccess,
  isMobile,
  loadingStatus,
  translate,
  tz
) {
  return [
    {
      'Guest Name': (
        <Grid item xs={12} md={4} data-testid="guest_name">
          <Grid container spacing={1}>
            <Grid item xs={2} sm={2}>
              <Avatar imageUrl={invite.guest.imageUrl} user={invite.guest} alt="avatar-image" />
            </Grid>
            <Grid item xs={6} sm={10}>
              <Link to={`/user/${invite.guest?.id}`}>
                <Text content={invite.guest?.name} />
              </Link>
            </Grid>
            <Grid item xs={4} style={{ paddingRight: 16 }}>
              {isMobile && (
                <Label
                  title={checkRequests(invite.entryTime, translate, tz).title}
                  color={checkRequests(invite.entryTime, translate, tz).color}
                />
              )}
            </Grid>
          </Grid>
        </Grid>
      ),
      'Start of Visit': (
        <Grid item xs={12} md={2} data-testid="start_of_visit">
          <Text
            content={translate('guest_book.start_of_visit', {
              date: dateToString(invite.entryTime.visitationDate)
            })}
            // className={classes.text}
          />
        </Grid>
      ),
      'End of Visit': (
        <Grid item xs={12} md={2} data-testid="end_of_visit">
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
            // className={classes.text}
          />
        </Grid>
      ),
      'Access Time': (
        <Grid item xs={12} md={2} data-testid="access_time">
          <Text
            content={translate('guest_book.visit_time', {
              startTime: dateTimeToString(invite.entryTime.startsAt),
              endTime: dateTimeToString(invite.entryTime.endsAt )
            })}
            // className={classes.text}
          />
        </Grid>
      ),
      status: (
        <Grid item xs={12} md={1} data-testid="validity">
          <Label
            title={invite.guest.request.status === 'pending' ? 'Pending' : 'Approved'}
            color={invite.guest.request.status === 'pending' ? 'red' : 'green'}
          />
        </Grid>
      ),
      validity: (
        <Grid item xs={12} md={1} data-testid="validity">
          {!isMobile && (
            <Label
              title={checkRequests(invite.entryTime, translate, tz).title}
              color={checkRequests(invite.entryTime, translate, tz).color}
            />
          )}
        </Grid>
      ),
      'Access Action': (
        <Grid item xs={12} md={1} data-testid="access_actions">
          <CenteredContent>
            <Button
              disabled={
                !checkRequests(invite.entryTime, translate, tz).valid ||
                (loadingStatus.loading && Boolean(loadingStatus.currentId))
              }
              variant={isMobile ? 'contained' : 'text'}
              onClick={event => grantAccess(event, invite.guest.request)}
              disableElevation
              style={
                isMobile
                  ? {
                      backgroundColor:
                        checkRequests(invite.entryTime, translate, tz).valid && '#66A69B',
                      color: '#FFFFFF'
                    }
                  : {}
              }
              startIcon={
                loadingStatus.loading && loadingStatus.currentId === invite.guest.id && <Spinner />
              }
              data-testid="grant_access_btn"
              fullWidth
            >
              {translate('access_actions.grant_access')}
            </Button>
          </CenteredContent>
        </Grid>
      )
    }
  ];
}
