import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import PropTypes from 'prop-types'
import CenteredContent from '../CenteredContent'
import { propAccessor, toCamelCase } from '../../utils/helpers'
import AnalyticsCard from '../Notes/TaskStatCard'
import { invoiceStatus } from '../../utils/constants'


export default function InvoiceTiles({ invoiceData, filter, currentTile }) {
  if (invoiceData.loading || invoiceData.error) {
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

  return Object.entries(invoiceStatus).map(([key, val]) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
      {
          key === 'in_progress' ? null : (
            <AnalyticsCard
              filter={() => filter(key)}
              title={val}
              count={propAccessor(invoiceData.data?.invoiceStats, toCamelCase(key))}
              isCurrent={key === currentTile}
            />
          )
      }
    </Grid>
  ))
}

InvoiceTiles.propTypes = {
  invoiceData: PropTypes.shape({
    data: PropTypes.shape({
    invoiceStats: PropTypes.shape({
        late: PropTypes.number,
        paid: PropTypes.number,
        inProgress: PropTypes.number,
        cancelled: PropTypes.number,
      })
    })
  }).isRequired,
  filter: PropTypes.func.isRequired,
  currentTile: PropTypes.string.isRequired
}
