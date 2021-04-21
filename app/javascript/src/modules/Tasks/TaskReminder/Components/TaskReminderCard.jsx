/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from 'react-apollo';
import PropTypes from 'prop-types';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { useHistory } from 'react-router-dom';
import EventNoteIcon from '@material-ui/icons/EventNote';
import Typography from '@material-ui/core/Typography';
import { AssignedTaskQuery } from '../graphql/task_reminder_query'
import { Spinner } from '../../../../shared/Loading';
import { dateToString } from '../../../../utils/dateutil';
import CenteredContent from '../../../../components/CenteredContent';
import { formatError, removeNewLines, sanitizeText } from '../../../../utils/helpers';

export default function TaskReminderCard({ id }) {
  const matches = useMediaQuery('(max-width:600px)')
  const { loading, data, error } = useQuery(AssignedTaskQuery, {
    variables: { id },
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
            <Typography variant='h5' style={matches ? {margin: '20px 0 26px 20px', fontWeight: 'bold'} : {margin: '50px 0 26px 79px', fontWeight: 'bold'}}>Task Reminders</Typography>
            <TrendingFlatIcon style={matches ? {marginLeft: 'auto', order: 2, marginTop: '20px', marginRight: '20px'} : {marginLeft: 'auto', order: 2, marginTop: '50px', marginRight: '80px'}} />
          </div>
          <div className={classes.root} style={matches ? {marginLeft: '20px'} : {marginLeft: '79px'}}>
            <GridList className={classes.gridList} cols={matches ? 1 : 3}>
              {data?.userTasks.map((tile) => (
                <GridListTile key={tile.id}>
                  <div className={classes.gridTile} onClick={() => history.push('/my_tasks')}>
                    <div className={classes.date} style={checkDate(tile.dueDate) ? {color: 'red'} : null}>
                      <EventNoteIcon style={{marginRight: '10px'}} />
                      <Typography variant='body2'>
                        Due
                        {' '}
                        {dateToString(tile.dueDate)}
                      </Typography>
                    </div>
                    <Typography align='justify' variant='caption' data-testid='body'>
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
    flexWrap: 'nowrap'
  },
  gridTile: {
    border: '2px solid #EBEBEB',
    padding: '20px',
    backgroundColor: theme.palette.background.paper,
    height: '175px',
    cursor: 'pointer',
    overflow: 'hidden',
    boxShadow: '0 0 3px #ccc',
    borderRadius: '8px',
    textOverflow: 'ellipsis'
  },
  date: {
    display: 'flex', 
    marginBottom: '15px'
  }
}));

TaskReminderCard.propTypes = {
  id: PropTypes.string.isRequired
};