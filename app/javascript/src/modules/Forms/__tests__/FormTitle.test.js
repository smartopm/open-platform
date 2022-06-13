import React from 'react'
import { render } from '@testing-library/react'

import FormTitle from '../components/FormTitle'

describe('FormTitle component', () => {
  it('should contain the title and description for the form', () => {
    const props = {
        name: 'some Title',
        description: 'some description'
    }
    const rendered = render(<FormTitle {...props} />)
    expect(rendered.queryByText('some Title')).toBeInTheDocument();
    expect(rendered.queryByText('some description')).toBeInTheDocument();
  })
})
