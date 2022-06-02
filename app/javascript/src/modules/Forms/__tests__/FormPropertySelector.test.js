import React from 'react'
import { render } from '@testing-library/react'

import FormPropertySelector from '../components/FormPropertySelector'

describe('Form property selector component', () => {
  const fieldTypes = {
      text: 'Text',
      radio: 'Radio',
      file_upload: 'File Upload',
      signature: 'Signature',
      date: 'Date',
      dropdown: 'Dropdown'
    }
  it('should all options and render correctly passed values', () => {
    const container = render(
      <FormPropertySelector
        label="Field Type"
        name="fieldType"
        value="text"
        handleChange={jest.fn()}
        options={fieldTypes}
      />
    )
    expect(container.queryAllByText('Field Type')[0]).toBeInTheDocument();
    expect(container.queryByText('field_types.text')).toBeInTheDocument();
  })
  it('should verify the dropdown menu on field types', () => {

    const anotherContainer = render(
      <FormPropertySelector
        label="Field Type"
        name="fieldType"
        value="dropdown"
        handleChange={jest.fn()}
        options={fieldTypes}
      />
    )
    expect(anotherContainer.queryByText('field_types.dropdown')).toBeInTheDocument()
  })
})
