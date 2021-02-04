import React from 'react';
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography';
import { dateFormatter } from "../../components/DateContainer"
import { userSubStatus } from '../../utils/constants';


export default function UserJourney({ data }) {
  return (
    <>
      {data.user && data.user?.substatusLogs.map(({ previousStatus, newStatus, stopDate, startDate }) => (
        <Typography variant="body2" style={{marginTop: '10px', marginLeft: '12px'}} key={Math.random()}>
          <b>{data.user.name}</b>
          {' '}
          changed status from
          <b> 
            {' '}
            {userSubStatus[String(previousStatus)]}
          </b>
          {' '}
          to
          <b> 
            {' '}
            {userSubStatus[String(newStatus)]}
          </b>
          {' '}
          between
          {' '}
          {dateFormatter(startDate)}
          {' '}
          and
          {' '}
          {dateFormatter(stopDate)}
        </Typography>
      ))}
    </>
  );
}

const User = PropTypes.shape({
  name: PropTypes.string,
  userType: PropTypes.string,
  state: PropTypes.string,
  accounts: PropTypes.arrayOf(PropTypes.object),
  formUsers: PropTypes.arrayOf(PropTypes.object),
  substatusLogs: PropTypes.arrayOf(PropTypes.object)
})
UserJourney.propTypes = {
  data: PropTypes.shape({ user: User }).isRequired,
}
