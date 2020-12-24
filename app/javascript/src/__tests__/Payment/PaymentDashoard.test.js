import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import InvoiceTiles from '../../components/Payments/InvoiceTiles'

describe('Test payment count cards', () => {
  const invoiceData = {
    loading: true
  }

  const data = {
    data: {
      invoiceStats: {
        late: 0,
        paid: 5,
        inProgress: 6,
        cancelled: 2
      }
    }
  }
  const filterTasks = jest.fn()
  it('should show loading', () => {
    const container = render(
      <InvoiceTiles
        filter={filterTasks}
        currentTile="Paid"
        invoiceData={invoiceData}
      />
    )
    expect(container.queryByText('Loading')).toBeInTheDocument()
  })

  it('should display all tiles with their correct titles', async () => {
    const container = render(
      <InvoiceTiles
        filter={filterTasks}
        currentTile="Paid"
        invoiceData={data}
      />
    )
    expect(container.queryByText('Late')).toBeInTheDocument()
    expect(container.queryByText('Paid')).toBeInTheDocument()
    expect(container.queryByText('In-Progress')).toBeInTheDocument()
    expect(container.queryByText('Cancelled')).toBeInTheDocument()
    expect(container.queryByText('5')).toBeInTheDocument()
    expect(container.queryByText('6')).toBeInTheDocument()
    expect(container.queryByText('2')).toBeInTheDocument()
  })
})
