import React, { useState } from 'react';
import PropTypes from 'prop-types';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { dateFormatter } from '../DateContainer';
import { userSubStatus } from '../../utils/constants';
import UserJourneyDialog from './UserJourneyDialog';

function getInitialSubStatusContent({ date, newStatus, previousStatus }) {
  return (
    <span>
      {' '}
      changed status 
      {' '}
      {previousStatus ? 'from' : 'to'} 
      {' '}
      <b>{userSubStatus[String(newStatus)]}</b>
      {' '}
      {previousStatus && 'to'} 
      {' '}
      <b>{userSubStatus[String(previousStatus)]}</b> 
      {' '}
      {date}
    </span>
  );
}
export default function UserJourney({ data, refetch }) {
  const [isEditOpen, setIsEditing] = useState(false);
  const [selectedJourneyLog, setCurrentLog] = useState({});

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
        {startDate} 
        {' '}
        {`and ${stopDate}`}
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

    return sortedLogsDescending.map(log => {
      if (!log.stopDate) {
        const content = getInitialSubStatusContent({
          date: dateFormatter(log.startDate),
          newStatus: log.newStatus,
          previousStatus: log.previousStatus
        });
        return {
          id: log.id,
          content,
          previousStatus: log.previousStatus,
          userId: log.userId,
          startDate: log.startDate,
          stopDate: log.stopDate
        };
      }

      const startDate = dateFormatter(log.startDate);
      const stopDate = dateFormatter(log.stopDate);
      const { newStatus, previousStatus } = log;

      const content = getSubStatusChangeContent({ startDate, stopDate, previousStatus, newStatus });

      return {
        id: log.id,
        content,
        startDate: log.startDate,
        stopDate: log.stopDate,
        previousStatus,
        userId: log.userId
      };
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
