import React from 'react'
import { render } from '@testing-library/react'
import UserFilledForms from '../components/User/UserFilledForms'
import '@testing-library/jest-dom/extend-expect'

describe('UserFilledForms component', function() {
  it('should render a list of forms filled by the user', function() {
    const userFormsFilled = [{
      id: '123abc456',
      form: {
        name: 'Form One',
      },
      status: 'pending',
      createdAt: '2020-10-10'
    }]
    const rendered = render(
      <UserFilledForms userFormsFilled={userFormsFilled} />
    )

    expect(rendered.queryByText('Form One')).toBeInTheDocument()
    expect(rendered.queryByText('pending')).toBeInTheDocument()
    expect(rendered.queryByText('2020-10-10')).toBeInTheDocument()
  })
})
