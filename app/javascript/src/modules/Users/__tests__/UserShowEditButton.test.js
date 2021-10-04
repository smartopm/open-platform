import React from 'react'
import { mount } from 'enzyme'
import { MockedProvider } from '@apollo/react-testing'
import { act } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router-dom'
import UserShow from '../Containers/UserShow'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
describe('Renders UserShow and edit button', () => {
  let wrapper
  it('should render component', () => {
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
