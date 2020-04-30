import React from 'react'
import EmployeeLogs from '../components/TimeTracker/EmployeeTimeSheetLog'
import { BrowserRouter } from 'react-router-dom/'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme/'

describe('time sheet logs component', () => {
  const userData = {
    userTimeSheetLogs: [
      {
        createdAt: '2020-04-29T08:35:27Z',
        startedAt: '2020-04-29T08:35:27Z',
        userId: '999013ef',
        id: "34r34543"
      }
    ]
  }
  let root
  act(() => {
    root = mount(
      <BrowserRouter>
        <EmployeeLogs data={userData} />
      </BrowserRouter>
    )
  })
  it('should render data with given props', () => {
      expect(root.find('table')).toHaveLength(1)
          const {
            children: { props }
          } = root.props()
      expect(props.data.userTimeSheetLogs).toHaveLength(1)
      expect(props.data.userTimeSheetLogs[0].userId).toBe('999013ef')
  })
})
