import React from 'react'
import List from '@material-ui/core/List'
import PropTypes from 'prop-types'
import InvoiceItem from './InvoiceItem'
import FloatButton from '../FloatButton'

export default function InvoiceList({ invoices }) {
  return (
    <>
      <List>
        {invoices.map(invoice => (
          <InvoiceItem key={invoice.id} invoice={invoice} />
      ))}
      </List>
      <FloatButton title='Add an Invoice' handleClick={() => {}}  />
    </>
  )
}

InvoiceList.propTypes = {
  invoices: PropTypes.arrayOf(PropTypes.object).isRequired
}
