/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
// import { useQuery } from 'react-apollo';
import useMediaQuery from '@mui/material/useMediaQuery';
// import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
// import ImageList from '@mui/material/ImageList';
// import ImageListItem from '@mui/material/ImageListItem';
// import { useHistory } from 'react-router-dom';
// import EventNoteIcon from '@mui/icons-material/EventNote';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
// import { AssignedTaskQuery } from '../graphql/task_reminder_query';
// import { dateToString } from '../../../../utils/dateutil';
// import CenteredContent from '../../../../components/CenteredContent';
// import { formatError, removeNewLines, sanitizeText } from '../../../../utils/helpers';
// import EmptyCard from '../../../../shared/EmptyCard';
// import CustomSkeleton from '../../../../shared/CustomSkeleton';

export default function TaskReminderCard({ translate }) {
  const matches = useMediaQuery('(max-width:600px)');
  // const { loading, data, error } = useQuery(AssignedTaskQuery, {
  //   fetchPolicy: 'cache-and-network',
  //   errorPolicy: 'all'
  // });
  // const history = useHistory();
  const classes = useStyles();

  // function checkDate(date) {
  //   if (new Date(date) < new Date().setHours(0, 0, 0, 0)) {
  //     return true;
  //   }
  //   return false;
  // }

  // if (error) {
  //   return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  // }
  return (
    <div className={classes.container}>
      <div style={{ display: 'flex' }}>
        <Typography className={matches ? classes.reminderMobile : classes.reminder}>
          {translate('dashboard.task_reminders')}
        </Typography>
      </div>
      {/* <div>
        {loading || data?.userTasks.length > 0 ? (
          <div
            className={classes.root}
            style={matches ? { marginLeft: '20px' } : { marginLeft: '79px' }}
          >
            <ImageList
              className={classes.gridList}
              cols={matches ? 1 : 3}
              sx={{
                gridAutoFlow: 'column',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px,1fr)) !important',
                gridAutoColumns: 'minmax(200px, 1fr)'
              }}
            >
              {(loading ? Array.from(new Array(5)) : data?.userTasks).map((tile, index) => (
                <div key={tile?.id || index}>
                  {tile ? (
                    <ImageListItem>
                      <div
                        className={classes.gridTile}
                        onClick={() => history.push(`/tasks/${tile.id}`)}
                      >
                        <div
                          className={classes.date}
                          style={checkDate(tile.dueDate) ? { color: 'red' } : null}
                        >
                          <EventNoteIcon
                            style={{
                              marginRight: '10px',
                              heigth: '11.68px',
                              width: '16.3px',
                              verticalAlign: 'middle'
                            }}
                          />
                          <Typography className={classes.due} style={{ paddingBottom: '5px' }}>

                            {translate('common:misc.due_text')}  
                            {' '}
                            {dateToString(tile.dueDate)}
                          </Typography>
                        </div>
                        <Typography align="justify" className={classes.content} data-testid="body">
                          <span
                            style={{ whiteSpace: 'pre-line' }}
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{
                              __html: sanitizeText(removeNewLines(tile.body))
                            }}
                          />
                        </Typography>
                      </div>
                    </ImageListItem>
                  ) : (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={index}>
                      <CustomSkeleton variant="rectangular" width="100%" height="140px" />
                    </div>
                  )}
                </div>
              ))}
            </ImageList>
          </div>
        ) : (
          <EmptyCard
            title={translate('dashboard.no_pending_tasks')}
            subtitle={translate('dashboard.pending_tasks_text')}
          />
        )}
      </div> */}
    </div>
  );
}

const useStyles = makeStyles(() => ({
  container: {
    padding: '20px 10px',
    border: '2px solid #CBD2E1',
    borderRadius: '5px'
  },
}));

TaskReminderCard.propTypes = {
  translate: PropTypes.func.isRequired
};
