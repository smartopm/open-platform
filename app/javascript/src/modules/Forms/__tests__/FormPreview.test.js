import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import FormPreview from '../components/FormPreview'

jest.mock('react-markdown', () => 'anything');
describe('Form Preview component', () => {
  it('should not break form preview', () => {
    const props = {
        categoriesData: {
            data: {
                formCategories: [
                   { renderedText: "Some preview text here and there"}
                ]
            }
        },
        loading: false,
        handleFormSubmit: jest.fn()
    }
    const rendered = render(
      <FormPreview {...props} />
    )
    expect(rendered.queryByText('actions.confirm')).toBeInTheDocument()
    expect(rendered.queryByText('Some preview text here and there')).toBeInTheDocument()
    fireEvent.click(rendered.queryByTestId('confirm_contract'))
    expect(props.handleFormSubmit).toBeCalled()
  })
})
