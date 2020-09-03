/* eslint-disable */
import React from 'react'
import CustodianLogs from '../components/TimeTracker/CustodianTimeSheetLog'
import { BrowserRouter } from 'react-router-dom/'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme/'

describe('time sheet logs component', () => {
  const data = {
    timeSheetLogs: [
      {
        endedAt: null,
        startedAt: '2020-04-29T08:35:27Z',
        id: '57f9b2c3',
        user: {
          name: 'JMM'
        },
        userId: '999013ef'
      }
    ]
  }
  let wrapper
  act(() => {
    wrapper = mount(
      <BrowserRouter>
        <CustodianLogs data={data} />
      </BrowserRouter>
    )
  })
  it('should render data with given props', () => {
    expect(wrapper.find('.nz_user')).toHaveLength(1)
    expect(wrapper.find('.nz_user').text()).toContain('JMM')
    // nz_endshift
    expect(wrapper.find('.nz_endshift').text()).toContain('In-Progress') // since the endedAt date is null
    const {
      children: { props }
    } = wrapper.props()
    expect(props.data.timeSheetLogs).toHaveLength(1)
    expect(props.data.timeSheetLogs[0].userId).toBe('999013ef')
  })
})
