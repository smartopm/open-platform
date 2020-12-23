import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import PropTypes from 'prop-types'
import CenteredContent from '../CenteredContent'
import { InvoiceStatus } from '../../utils/helpers'
import AnalyticsCard from '../Notes/TaskStatCard'


export default function InvoiceTiles({ taskData, filterTasks, currentTile }) {
  if (taskData.loading || taskData.error) {
    return (
      <CenteredContent>
        <Typography
          align="center"
          color="textSecondary"
          gutterBottom
          variant="h6"
        >
          Loading
        </Typography>
      </CenteredContent>
    )
  }
  // use extra white space
  return Object.entries(InvoiceStatus).map(([key, val]) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
      {
          key === 'in_progress' ? null : (
            <AnalyticsCard
              filterTasks={evt => filterTasks(evt, key)}
              title={val}
              count={taskData.data?.invoiceStats[key]}
              isCurrent={key === currentTile}
            />
          )
      }
    </Grid>
  ))
}

InvoiceTiles.propTypes = {
  taskData: PropTypes.shape({
    data: PropTypes.shape({
    invoiceStats: PropTypes.shape({
        late: PropTypes.number,
        paid: PropTypes.number,
        inProgress: PropTypes.number,
        cancelled: PropTypes.number,
      })
    })
  }).isRequired,
  filterTasks: PropTypes.func.isRequired,
  currentTile: PropTypes.string.isRequired
}
