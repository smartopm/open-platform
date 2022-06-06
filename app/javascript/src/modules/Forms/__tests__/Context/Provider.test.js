import React from 'react'
import { render } from '@testing-library/react'

import { MockedProvider } from '@apollo/react-testing';
import FormContextProvider from '../../Context'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Form Context', () => {
  it('should have context', () => {
 
    const wrapper = render(
      <MockedProvider>
        <FormContextProvider>
          <p>Some child component that should inherit the current state</p>
        </FormContextProvider>
      </MockedProvider>
    )
    expect(wrapper.queryByText('Some child component that should inherit the current state')).toBeInTheDocument()
  })
})
