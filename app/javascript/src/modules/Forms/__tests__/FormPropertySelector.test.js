import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import FormPropertySelector from '../components/FormPropertySelector'

describe('Form property selector component', () => {
  it('should all options and render correctly passed values', () => {
    const fieldTypes = {
        text: 'Text',
        radio: 'Radio',
        image: 'File Upload',
        signature: 'Signature',
        date: 'Date',
        dropdown: 'Dropdown'
      }

    const container = render(
      <FormPropertySelector
        label="Field Type"
        name="fieldType"
        value="text"
        handleChange={jest.fn()}
        options={fieldTypes}
      />
    )
    expect(container.queryByText('Text')).toBeInTheDocument();

    const anotherContainer = render(
      <FormPropertySelector
        label="Field Type"
        name="fieldType"
        value="dropdown"
        handleChange={jest.fn()}
        options={fieldTypes}
      />
    )
    expect(anotherContainer.queryByText('Dropdown')).toBeInTheDocument()
  })
})
