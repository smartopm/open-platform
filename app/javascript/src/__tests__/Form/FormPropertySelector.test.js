import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import FormPropertySelector from '../../components/Forms/FormPropertySelector'

describe('Form property selector component', () => {
  it('should all options and render correctly passed values', () => {
    const fieldTypes = {
        text: 'Text',
        radio: 'Radio',
        image: 'Image',
        signature: 'Signature',
        date: 'Date'
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
    expect(container.queryByText('Text')).toBeInTheDocument()
  })
})
