/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from 'react-apollo';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { useHistory } from 'react-router-dom';
import EventNoteIcon from '@material-ui/icons/EventNote';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { AssignedTaskQuery } from '../graphql/task_reminder_query'
import { Spinner } from '../../../../shared/Loading';
import { dateToString } from '../../../../utils/dateutil';
import CenteredContent from '../../../../components/CenteredContent';
import { formatError, removeNewLines, sanitizeText } from '../../../../utils/helpers';
import EmptyCard from '../../../../shared/EmptyCard'

export default function TaskReminderCard({ translate }) {
  const matches = useMediaQuery('(max-width:600px)')
  const { loading, data, error } = useQuery(AssignedTaskQuery, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });
  const history = useHistory();
  const classes = useStyles();

  function checkDate(date){
    if (new Date(date) < new Date().setHours(0, 0, 0, 0)) {
      return true
    }
    return false
  }

  if (error) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }
  return (
    <div>
      {loading ? <Spinner /> : (
        <div>
          <div style={{display: 'flex'}}>
            <Typography className={matches ? classes.reminderMobile : classes.reminder}>{translate('dashboard.task_reminders')}</Typography>
            {matches ? null : <TrendingFlatIcon style={matches ? {marginLeft: 'auto', order: 2, marginTop: '20px', marginRight: '20px'} : {marginLeft: 'auto', order: 2, marginTop: '20px', marginRight: '80px'}} />}
          </div>
          <div>
            {data?.userTasks.length > 0 ? (
              <div className={classes.root} style={matches ? {marginLeft: '20px'} : {marginLeft: '79px'}}>
                <GridList className={classes.gridList} cols={matches ? 1 : 3.5}>
                  {data?.userTasks.map((tile) => (
                    <GridListTile key={tile.id}>
                      <div className={classes.gridTile} onClick={() => history.push(`/tasks/${tile.id}`)}>
                        <div className={classes.date} style={checkDate(tile.dueDate) ? {color: 'red'} : null}>
                          <EventNoteIcon style={{marginRight: '10px', heigth: '11.68px', width: '16.3px', verticalAlign: 'middle'}} />
                          <Typography className={classes.due} style={{paddingBottom: '5px'}}>
                            {translate('common:misc.due_text')}
                            {' '}
                            {dateToString(tile.dueDate)}
                          </Typography>
                        </div>
                        <Typography align='justify' className={classes.content} data-testid='body'>
                          <span
                            style={{ whiteSpace: 'pre-line' }}
                          // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{
                          __html: sanitizeText(removeNewLines(tile.body))
                          }}
                          />
                        </Typography>
                      </div>
                    </GridListTile>
                ))}
                </GridList>
              </div>
            ) : (
              <EmptyCard title={translate('dashboard.no_pending_tasks')} subtitle={translate('dashboard.pending_tasks_text')} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden'
  },
  gridList: {
    flexWrap: 'nowrap',
    width: '100%'
  },
  gridTile: {
    border: '1px solid #EBEBEB',
    padding: '20px',
    backgroundColor: theme.palette.background.paper,
    height: '140px',
    cursor: 'pointer',
    overflow: 'hidden',
    borderRadius: '8px'
  },
  date: {
    display: 'flex', 
    marginBottom: '8px'
  },
  content: {
    fontSize: '12px',
    fontWeight: 400,
    color: '#141414'
  },
  due: {
    fontSize: '12px',
    fontWeight: 400,
    marginTop: '3px'
  },
  reminder: {
    margin: '20px 0 20px 79px',
    fontSize: '22px',
    fontWeight: 500,
    color: '#141414'
  },
  reminderMobile: {
    margin: '20px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#141414'
  }
}));

TaskReminderCard.propTypes = {
  translate: PropTypes.func.isRequired
};