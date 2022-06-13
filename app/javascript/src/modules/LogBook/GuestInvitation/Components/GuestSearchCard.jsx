import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import CardContent from '@mui/material/CardContent';
import { Link } from 'react-router-dom';
import Text from '../../../../shared/Text';
import Avatar from '../../../../components/Avatar';
import CenteredContent from '../../../../shared/CenteredContent';

export default function GuestSearchCard({ guest, translate, handInviteGuest }) {
  return (
    <Card elevation={0}>
      <CardContent>
        <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
          <Grid item xs={4} sm={2} data-testid="guest_avatar">
            <Avatar imageUrl={guest.imageUrl} user={guest} alt="avatar-image" />
          </Grid>
          <Grid item xs={4} sm={2} data-testid="guest_name">
            <Link to={`/user/${guest.id}`}>
              <Text content={guest.name} />
            </Link>
          </Grid>
          <Grid item xs={4} sm={2}>
            <CenteredContent>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handInviteGuest(guest)}
                disableElevation
                data-testid="invite_guest_btn"
              >
                {translate('logbook:review_screen.add')}
              </Button>
            </CenteredContent>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

GuestSearchCard.propTypes = {
  guest: PropTypes.shape({
    id: PropTypes.string,
    imageUrl: PropTypes.string,
    name: PropTypes.string
  }).isRequired,
  translate: PropTypes.func.isRequired,
  handInviteGuest: PropTypes.func.isRequired,
};
