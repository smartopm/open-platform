import React from 'react';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Text from '../../../shared/Text';

export default function ActingUserName({ entry, t }) {
  const user =
    // eslint-disable-next-line no-nested-ternary
    entry.data?.note === 'Exited'
      ? entry.actingUser
      : entry.entryRequest?.grantor
      ? entry.entryRequest?.grantor
      : entry.actingUser;
  return (
    <>
      <Typography variant="caption" data-testid="acting_guard_title">
        {`${t('logbook:log_title.guard')}: `}
      </Typography>
      <Link to={`/user/${user?.id}`} data-testid="acting_user_name">
        <Text color="secondary" content={user?.name} />
      </Link>
    </>
  );
}

const UserType = {
  id: PropTypes.string,
  name: PropTypes.string
};

ActingUserName.propTypes = {
  entry: PropTypes.shape({
    entryRequest: PropTypes.shape({
      guestId: PropTypes.string,
      grantor: PropTypes.shape(UserType)
    }),
    actingUser: PropTypes.shape(UserType),
    data: PropTypes.shape({ note: PropTypes.string })
  }).isRequired,
  t: PropTypes.func.isRequired
};
