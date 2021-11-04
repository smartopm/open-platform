import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import CardContent from '@material-ui/core/CardContent';
import { Link } from 'react-router-dom';
import Text from '../../../../shared/Text';
import Avatar from '../../../../components/Avatar';
import CenteredContent from '../../../../shared/CenteredContent';

export default function GuestSearchCard({ guest, translate, styles, handInviteGuest }) {
  return (
    <Card className={styles.card}>
      <CardContent>
        <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
          <Grid item xs={2} data-testid="guest_avatar">
            <Avatar imageUrl={guest.imageUrl} user={guest} alt="avatar-image" />
          </Grid>
          <Grid item xs={5} data-testid="guest_name">
            <Link to={`/user/${guest.id}`}>
              <Text content={guest.name} />
            </Link>
          </Grid>
          <Grid item xs={5}>
            <CenteredContent>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handInviteGuest(guest)}
                disableElevation
                data-testid="invite_guest_btn"
              >
                {translate('form_actions.invite_guest')}
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
  styles: PropTypes.shape({
    card: PropTypes.string
  }).isRequired
};
