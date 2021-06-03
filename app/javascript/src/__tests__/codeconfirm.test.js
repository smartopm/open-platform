import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { MockedProvider } from '@apollo/react-testing'
import CodeScreen from '../components/AuthScreens/ConfirmCodeScreen'

describe('Code Confirmation Screen', () => {
  const params = {
    params: {
      id: 343
    }
  }
  const wrapper = mount(
    <MemoryRouter>
      <MockedProvider>
        <CodeScreen match={params} />
      </MockedProvider>
    </MemoryRouter>
  )
  it('renders and has a paragraph element ', () => {
    expect(wrapper.find('p')).toHaveLength(1)
  })
  it('contains a button', () => {
    expect(wrapper.find('button')).toHaveLength(1)
    expect(wrapper.find('button').text()).toContain('login.login_button_text')
  })
  it('contains 7 input fields for each code', () => {
    expect(wrapper.find('input')).toHaveLength(7)
  })
})
