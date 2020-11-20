import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types'
import ActionCard from './ActionCard'

const useStyles = makeStyles({
  cardListWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    margin: "10px auto",
  },
});

export default function ActionFlowsList({ openFlowModal, data }) {
  const classes = useStyles();

  return(
    <div className={classes.cardListWrapper}>
      { data.map((actionFlow) => (
        <ActionCard
          key={actionFlow.id}
          actionFlow={actionFlow}
          openFlowModal={openFlowModal}
        />
      ))}
    </div>
  )
}

ActionFlowsList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  openFlowModal: PropTypes.func.isRequired,
}
