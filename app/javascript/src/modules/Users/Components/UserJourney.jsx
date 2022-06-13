import React, { useState } from 'react';
import PropTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { dateFormatter } from '../../../components/DateContainer';
import { userSubStatus } from '../../../utils/constants';
import UserJourneyDialog from './UserJourneyDialog';
import CenteredContent from '../../../components/CenteredContent';
import { objectAccessor } from '../../../utils/helpers';

export function getInitialSubStatusContent({ date, newStatus, previousStatus }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation('users')
  return (
    <span data-testid="initial_log_content">
      {' '}
      {t("users.change")}
      {' '}
      {previousStatus ? t("users.from") : t("users.to")}
      {' '}
      <b>{objectAccessor(userSubStatus, previousStatus)}</b>
      {' '}
      {previousStatus && t("users.to")}
      {' '}
      <b>{objectAccessor(userSubStatus, newStatus)}</b>
      {' '}
      {date}
      {'.'}
    </span>
  );
}


export function getSubStatusChangeContent({ startDate, stopDate, previousStatus, newStatus }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation('users')
  return (
    <span data-testid="log_content">
      {' '}
      {t("users.user_journey_status")}
      {' '}
      <b>{objectAccessor(userSubStatus, previousStatus)}</b>
      {' '}
      {t("users.to")}
      {' '}
      <b>{objectAccessor(userSubStatus, newStatus)}</b>
      {' '}
      {t("users.between")}
      {' '}
      {startDate}
      {' '}
      {t("users.and", {date: stopDate})}
      {'.'}
    </span>
  );
}

export function subsStatusLogsFormatter(subStatusLogs) {
  /*
  Sort by startDate. Don't mutate object
  Time lapse = startDate[index + 1] to startDate[index]
  For initial sub-status, change message content.
  */
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
        stopDate: log.stopDate,
        updatedBy: log.updatedBy?.name
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
      userId: log.userId,
      updatedBy: log.updatedBy?.name
    };
  });
}
export default function UserJourney({ data, refetch }) {
  const { t } = useTranslation('users')
  const classes = useStyles();
  const [isEditOpen, setIsEditing] = useState(false);
  const [selectedJourneyLog, setCurrentLog] = useState({});

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
      {
      !formattedSubStatusLogs.length && (
        <CenteredContent>{t("users.user_journey_message")}</CenteredContent>
      )
    }
      {formattedSubStatusLogs.map(log => (
        <Grid container spacing={3} key={log.id}>
          <Grid item xs={10}>
            <Typography variant="body2" style={{ marginTop: 10, marginLeft: '12px' }} data-testid="user_journey_content">
              <b>{data.user.name}</b>
              {log.content}
              {
              log.updatedBy && (
                <span className={classes.changedBy}>
                  Updated by &nbsp;
                  <b>{log.updatedBy}</b>
                </span>
                )
            }
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <IconButton
              aria-label="edit user journey"
              color="primary"
              onClick={() => handleEdit(log)}
              data-testid="edit_journey"
              size="large"
            >
              <EditIcon />
            </IconButton>
          </Grid>
        </Grid>
    ))}
    </>
);
}

const useStyles = makeStyles({
  changedBy: {
    marginLeft: '0.5em'
  }
});

const User = PropTypes.shape({
  name: PropTypes.string,
  substatusLogs: PropTypes.arrayOf(PropTypes.object)
});
UserJourney.propTypes = {
  data: PropTypes.shape({ user: User }).isRequired,
  refetch: PropTypes.func.isRequired
};
