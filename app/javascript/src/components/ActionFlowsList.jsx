import React from 'react'
import { useQuery } from 'react-apollo'
import { makeStyles } from '@material-ui/core/styles';
import { activeActionFlows } from '../graphql/queries'
import ActionCard from './ActionCard'
import Loading from './Loading'
import ErrorPage from './Error'

const useStyles = makeStyles({
  cardListWrapper: {
   display: 'flex',
   flexWrap: 'wrap',
   justifyContent: 'space-between',
   width: "1170px",
   margin: "0 auto",
  },
});

export default function ActionFlowsList() {
  const classes = useStyles();
  const { data, error, loading } = useQuery(activeActionFlows)

  if (loading) return <Loading />
  if (error) return <ErrorPage title={error.message} />

  return(
    <div className={classes.cardListWrapper}>
      { data.activeActionFlows.map((actionFlow) => (
        <ActionCard
          key={actionFlow.id}
          actionFlow={actionFlow}
        />
      ))}
    </div>
  )
}
