import React from 'react'
import { mount } from 'enzyme'
import { MockedProvider } from '@apollo/react-testing'
import { act } from 'react-dom/test-utils'
import UserShow from '../containers/UserShow'
import { MemoryRouter } from 'react-router-dom'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
describe('Renders UserShow and edit button', () => {
  let wrapper
  it('It should render component', () => {
    act(() => {
      wrapper = mount(
        <MemoryRouter>
          <MockedProvider>
            <UserShow />
          </MockedProvider>
        </MemoryRouter>
      )
    })
    const button = wrapper.find('.edit_button')
    expect(button).toBeTruthy()
  })
})
