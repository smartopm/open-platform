import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import FormTitle from '../components/FormTitle'

describe('FormTitle component', () => {
  it('should contain the title and description for the form', () => {
    const props = {
        name: 'some Title'
    }
    const rendered = render(<FormTitle {...props} />)
    expect(rendered.queryByText('some Title')).toBeInTheDocument()
  })
})
