import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom'
import { MockedProvider } from '@apollo/react-testing'
import { FormMenu } from '../../components/Forms/FormList'

describe('TextInput component', () => {
  it('should not break the text input', () => {
    const props = {
        handleClose: jest.fn(),
        formId: 'sjhef3042432',
        anchorEl: null,
        open: true
    }
    const rendered = render(
      <BrowserRouter>
        <MockedProvider mocks={[]}>
          <FormMenu {...props} />
        </MockedProvider>
      </BrowserRouter>
    )
    expect(rendered.queryByText('Edit')).toBeInTheDocument()
    expect(rendered.queryByText('Publish')).toBeInTheDocument()
    expect(rendered.queryByText('Delete')).toBeInTheDocument()
    fireEvent.click(rendered.queryByText('Publish'))
    expect(props.handleClose).toBeCalled()
  })
})
