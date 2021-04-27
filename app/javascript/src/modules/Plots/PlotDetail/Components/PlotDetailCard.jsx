/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from 'react-apollo';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import { PaymentPlan } from '../graphql/plot_detail_query'
import { Spinner } from '../../../../shared/Loading';
import { dateToString } from '../../../../utils/dateutil';
import CenteredContent from '../../../../components/CenteredContent';
import { formatError } from '../../../../utils/helpers';
import EmptyCard from '../../../../shared/EmptyCard'

export default function PlotDetailCard({ userId }) {
  const matches = useMediaQuery('(max-width:600px)')
  const { loading, data, error } = useQuery(PaymentPlan, {
    variables: {
      userId
    },
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
          <Typography variant='h6' style={matches ? {margin: '20px 0 26px 20px', fontWeight: 'bold'} : {margin: '20px 0 26px 79px', fontWeight: 'bold'}}>Plot Details</Typography>
          <div>
            {console.log(data?.paymentPlan)}
            {data?.paymentPlan.length > 0 ? (
              <div className={classes.root} style={matches ? {marginLeft: '20px'} : {marginLeft: '79px'}}>
                <GridList className={classes.gridList} cols={matches ? 1 : 3.5}>
                  {data.paymentPlan.map((tile) => (
                    <GridListTile key={tile.id}>
                      <div className={classes.gridTile} onClick={() => history.push(`/tasks/${tile.id}`)}>
                        Hello
                      </div>
                    </GridListTile>
                  ))}
                </GridList>
              </div>
            ) : (
              <EmptyCard title='No Plot Available' subtitle='Your plots will appear here' />
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
    border: '2px solid #EBEBEB',
    padding: '20px',
    backgroundColor: theme.palette.background.paper,
    height: '140px',
    cursor: 'pointer',
    overflow: 'hidden',
    boxShadow: '0 0 3px #ccc',
    borderRadius: '8px',
  },
  date: {
    display: 'flex', 
    marginBottom: '-8px'
  }
}));
