import React, { useState } from 'react';
import PropTypes from 'prop-types';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { dateFormatter } from '../DateContainer';
import { userSubStatus } from '../../utils/constants';
import UserJourneyDialog from './UserJourneyDialog';

export default function UserJourney({ data, refetch }) {
  const [isEditOpen, setIsEditing] = useState(false);
  const [selectedJourneyLog, setCurrentLog] = useState({});

  function getInitialSubStatusContent({ startDate, newStatus }) {
    return (
      <>
        {' '}
        changed status to 
        {' '}
        <b>{userSubStatus[String(newStatus)]}</b> 
        {' '}
        {startDate}
      </>
    );
  }

  function getSubStatusChangeContent({ startDate, stopDate, previousStatus, newStatus }) {
    return (
      <>
        {' '}
        changed status from 
        {' '}
        <b>{userSubStatus[String(previousStatus)]}</b>
        {' '}
        to
        {' '}
        <b>{userSubStatus[String(newStatus)]}</b>
        {' '}
        between
        {' '}
        {startDate}
        {' '}
        {
            stopDate && `and ${stopDate}`
        }
      </>
    );
  }

  function subsStatusLogsFormatter(subStatusLogs) {
    /* 
    Sort by startDate. Don't mutate object
    Time lapse = startDate[index + 1] to startDate[index]
    For initial sub-status, change message content.
    */
    // const sortedLogsDescending = [...subStatusLogs].sort((a, b) => new Date(b.startDate) - new Date(a.startDate))

    const sortedLogsDescending = subStatusLogs;

    return sortedLogsDescending.map((log, index) => {
      if (index === sortedLogsDescending.length - 1) {
        const content = getInitialSubStatusContent({
          startDate: dateFormatter(log.startDate),
          newStatus: log.newStatus
        });

        return { id: log.id, content, previousStatus: null };
      }

      const startDate = dateFormatter(log.startDate)
      const stopDate = dateFormatter(log.stopDate)
      const { newStatus, previousStatus } = log

      const content = getSubStatusChangeContent({ startDate, stopDate, previousStatus, newStatus });

      return { id: log.id, content, startDate, stopDate, previousStatus };
    });
  }

  function handleEdit(log) {
    setCurrentLog(log);
    setIsEditing(true);
  }

  const formattedSubStatusLogs = subsStatusLogsFormatter(data.user?.substatusLogs);
  return (
    <>
      <UserJourneyDialog
        open={isEditOpen}
        handleModalClose={() => setIsEditing(false)}
        log={selectedJourneyLog}
        refetch={refetch}
      />
      {formattedSubStatusLogs.map(log => (
        <Grid container spacing={3} key={log.id}>
          <Grid item xs={10}>
            <Typography variant="body2" style={{ marginTop: 10, marginLeft: '12px' }}>
              <b>{data.user.name}</b>
              {log.content}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <IconButton
              aria-label="edit user journey"
              color="primary"
              onClick={() => handleEdit(log)}
            >
              <EditIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
    </>
  );
}

const User = PropTypes.shape({
  name: PropTypes.string,
  substatusLogs: PropTypes.arrayOf(PropTypes.object)
});
UserJourney.propTypes = {
  data: PropTypes.shape({ user: User }).isRequired,
  refetch: PropTypes.func.isRequired
};
