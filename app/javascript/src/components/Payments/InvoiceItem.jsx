import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Grid from '@material-ui/core/Grid'
import { isAfter } from 'date-fns'
import PropTypes from 'prop-types'
import { dateToString } from '../DateContainer'

export const InvoiceStatus = {
  in_progress: 'In-Progress',
  paid: 'Paid',
  late: 'Late',
  cancelled: 'Cancelled'
}

export default function InvoiceItem({ invoice }) {
  return (
    <ListItem>
      <ListItemText
        disableTypography
        primary={invoice.description}
        secondary={(
          <Grid container spacing={10} style={{ color: '#808080' }}>
            <Grid xs item data-testid="amount">{`k${invoice.amount}`}</Grid>
            <Grid xs item data-testid="landparcel">{invoice.landParcel?.parcelNumber}</Grid>
            <Grid xs item data-testid="duedate">{`due at ${dateToString(invoice.dueDate)}`}</Grid>
          </Grid>
            )}
      />
      {/* In the future we can put an action button here */}
      <ListItemSecondaryAction data-testid="status">
        {
          isAfter(new Date(), new Date(invoice.dueDate)) ? 'Late' : InvoiceStatus[invoice.status]
        }
      </ListItemSecondaryAction>
    </ListItem>
  )
}

InvoiceItem.propTypes = {
  invoice: PropTypes.shape({
    description: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    dueDate: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    landParcel: PropTypes.shape({ parcelNumber: PropTypes.string.isRequired })
  }).isRequired
}