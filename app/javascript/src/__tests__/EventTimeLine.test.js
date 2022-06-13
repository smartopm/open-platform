import React from 'react'
import { startOfToday, startOfWeek, startOfYesterday } from 'date-fns'
import { render } from '@testing-library/react'

import EventTimeLine from '../shared/TimeLine'

describe('Event Timeline component', () => {
  const data = [
    {
      sentence: 'Profile for user 2 updated',
      createdAt: startOfToday(),
      id: "234234sdfs"
    },
    {
      sentence: 'User2 invited another user',
      createdAt: startOfYesterday(),
      id: "2342sdsdf34sdfs"
    },
    {
      sentence: 'User got created',
      createdAt: startOfWeek(new Date()),
      id: "234s934sdfs"
    }
  ]
  it('should render given data', () => {
    const { getByText, getAllByTestId } = render(<EventTimeLine data={data} />)
    expect(getByText('User2 invited another user')).toBeInTheDocument()
    expect(getByText('Profile for user 2 updated')).toBeInTheDocument()
    expect(getByText('User got created')).toBeInTheDocument()
    expect(getAllByTestId('date')).toHaveLength(3)
  })
  it('shouldnt break when there is no data provided', () => {
    const { getByText } = render(<EventTimeLine data={[]} />)
    expect(getByText('common:errors.no_changes')).toBeInTheDocument()
  })
})
