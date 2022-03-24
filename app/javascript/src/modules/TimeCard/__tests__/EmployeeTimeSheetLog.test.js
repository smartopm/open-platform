import React from 'react'
import { BrowserRouter } from 'react-router-dom/'
import { render,} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import EmployeeLogs from '../Components/EmployeeTimeSheetLog'

describe('time sheet logs component', () => {
  const userData = {
    userTimeSheetLogs: [
      {
        createdAt: '2020-04-29T08:35:27Z',
        startedAt: '2020-04-29T08:35:27Z',
        userId: '999013ef',
        id: '34r34543',
        endedAt: '2020-04-29T10:35:27Z',
        user: {
          name: "Joen"
        }
      }
    ]
  }

  const userDataProgress = {
    userTimeSheetLogs: [
      {
        createdAt: '2020-04-29T08:35:27Z',
        startedAt: '2020-04-29T08:35:27Z',
        userId: '999013ef',
        id: '34r34543',
        endedAt: null
      }
    ]
  }

  it('should render with given data', () => {
  const { getByText, getByTestId } = render(
    <BrowserRouter>
      <EmployeeLogs data={userData} name="Joen" />
    </BrowserRouter>
  )
    expect(getByText('2 hrs')).toBeInTheDocument()
    expect(getByText('Wednesday')).toBeInTheDocument() 
    expect(getByTestId('emp_name')).toHaveTextContent('Joen')  
    expect(getByTestId('prog')).toBeInTheDocument('2 hrs')  
  })

  it('progress should be in the document', () => {
      const { getByTestId } = render(
        <BrowserRouter>
          <EmployeeLogs data={userDataProgress} />
        </BrowserRouter>
      )
     expect(getByTestId('prog')).toBeInTheDocument()  
     expect(getByTestId('prog')).toHaveTextContent('timecard.shift_in_progress')  
  })
  it('should have summary in the document', () => {
    const container = render(
      <BrowserRouter>
        <EmployeeLogs data={userData} />
      </BrowserRouter>
    )
    expect(container.queryByTestId('summary').textContent).toContain('worked_time_stats')
  })
  it('should have summary in the document when there is shift in progress', () => {
    const container = render(
      <BrowserRouter>
        <EmployeeLogs data={userDataProgress} />
      </BrowserRouter>
    )
    expect(container.queryByTestId('summary').textContent).toContain('timecard.worked_time_stats')
  })
})
