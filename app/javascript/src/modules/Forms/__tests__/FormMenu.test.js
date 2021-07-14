import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom'
import { MockedProvider } from '@apollo/react-testing'
import { FormMenu } from '../components/FormList'

describe('TextInput component', () => {
  it('should not break the text input', () => {
    const props = {
        handleClose: jest.fn(),
        formId: 'sjhef3042432',
        anchorEl: null,
        open: true,
        refetch: jest.fn()
    }
    const rendered = render(
      <BrowserRouter>
        <MockedProvider mocks={[]}>
          <FormMenu {...props} />
        </MockedProvider>
      </BrowserRouter>
    )
    expect(rendered.queryByText('common:menu.edit')).toBeInTheDocument()
    expect(rendered.queryByText('common:menu.publish')).toBeInTheDocument()
    expect(rendered.queryByText('common:menu.delete')).toBeInTheDocument()
    fireEvent.click(rendered.queryByText('common:menu.publish'))
    expect(props.handleClose).toBeCalled()
  })
})