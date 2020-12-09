import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import Events from '../components/Events'
import { LogView } from '../containers/AllLogs/EntryLogs'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())

describe('Should Render Events Component', () => {
  const data = {
    result: [
      {
        id: '1',
        subject: 'user_active',
        sentence: 'User john doe was active',
        createdAt: new Date(),
        timestamp: new Date(),
        data: {
          digital: false
        }
      },
      {
        id: '2',
        subject: 'user_entry',
        sentence: 'User john doe was recorded leaving',
        createdAt: new Date(),
        timestamp: new Date(),
        data: {}
      }
    ]
  }
  it('should render proper data', () => {
    const { getByText } = render(
      <BrowserRouter>
        <Events data={data} />
      </BrowserRouter>
    )
    expect(getByText('Subject')).toBeInTheDocument()
    expect(getByText('Description')).toBeInTheDocument()
    expect(getByText('user_entry')).toBeInTheDocument()
    expect(getByText('user_active')).toBeInTheDocument()
    expect(getByText('Print Scan')).toBeInTheDocument()
    expect(getByText('User john doe was recorded leaving')).toBeInTheDocument()
    expect(getByText('User john doe was active')).toBeInTheDocument()
  })

  it('should not render any data when no events is provided', () => {
    const emptyData = { result: [] }
    const container = render(
      <BrowserRouter>
        <Events data={emptyData} />
      </BrowserRouter>
    )
    expect(container.queryByText('user_entry')).toBeNull()
    expect(container.queryByText('user_active')).toBeNull()
    expect(container.queryByText('Print Scan')).toBeNull()
    expect(
      container.queryByText('User john doe was recorded leaving')
    ).toBeNull()
    expect(container.queryByText('User john doe was active')).toBeNull()
  })

  it('entry logs view', () => {
      const log = {
        id: '1',
        subject: 'visit_request',
        sentence: '',
        createdAt: new Date(),
        data: {
          ref_name: 'Some User',
          type: 'client'
        }
      }
    const { getByText } = render(<LogView user={log} /> )
    expect(getByText('Some User')).toBeInTheDocument()
    expect(getByText('Client')).toBeInTheDocument()
  })
})
