import { Button, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import React from 'react';
import Avatar from '../../../../components/Avatar';
import CenteredContent from '../../../../shared/CenteredContent';
import Text from '../../../../shared/Text';

export default function RenderGuest(guest, inviteGuest, translate) {
  return [
    {
      Avatar: (
        <Grid item xs={1} data-testid="guest_avatar">
          <Avatar imageUrl={guest.imageUrl} user={guest} alt="avatar-image" />
        </Grid>
      ),
      GuestName: (
        <Grid item xs={4} data-testid="guest_name">
          <Link to={`/user/${guest.id}`}>
            <Text content={guest.name} />
          </Link>
        </Grid>
      ),
      Action: (
        <Grid item xs={4} data-testid="access_actions">
          <CenteredContent>
            <Button
              variant="contained"
              color="primary"
              onClick={() => inviteGuest(guest)}
              disableElevation
              data-testid="grant_access_btn"
              fullWidth
            >
              {translate('form_actions.invite_guest')}
            </Button>
          </CenteredContent>
        </Grid>
      )
    }
  ];
}
