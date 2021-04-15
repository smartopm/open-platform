/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from 'react-apollo';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { useHistory } from 'react-router-dom';
import EventNoteIcon from '@material-ui/icons/EventNote';
import Typography from '@material-ui/core/Typography';
import { AssignedTaskQuery } from '../graphql/assignTaskQuery'
import { Spinner } from '../../../shared/Loading';
import { dateToString } from '../../../utils/dateutil';

export default function TaskReminderCard({ id }) {
  const { loading, data, error } = useQuery(AssignedTaskQuery, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });
  const history = useHistory();
  const classes = useStyles();
  return (
    <div>
      {loading ? <Spinner /> : (
        <div className={classes.root}>
          <GridList className={classes.gridList} cols={3}>
            {data?.userTasks.map((tile) => (
              <GridListTile key={tile.id}>
                <div className={classes.gridTile} onClick={() => history.push(`/tasks`)}>
                  <div style={{display: 'flex', marginBottom: '15px'}}>
                    <EventNoteIcon style={{marginRight: '10px'}} />
                    <Typography>
                      Due
                      {' '}
                      {dateToString(tile.dueDate)}
                    </Typography>
                  </div>
                  <Typography align='justify' variant='body2'>
                    {tile.body}
                  </Typography>
                </div>
              </GridListTile>
            ))}
          </GridList>
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
    overflow: 'hidden',
    marginLeft: '20px',
    overflowX: 'hidden'
  },
  gridList: {
    flexWrap: 'nowrap'
  },
  gridTile: {
    border: '2px solid #ECECEC',
    padding: '10px',
    backgroundColor: theme.palette.background.paper,
    height: '150px',
    cursor: 'pointer',
    boxShadow: '0 0 3px #ccc'
  }
}));