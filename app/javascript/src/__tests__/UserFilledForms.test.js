import React from 'react'
import { render } from '@testing-library/react'
import UserFilledForms from '../components/User/UserFilledForms'
import '@testing-library/jest-dom/extend-expect'

describe('UserFilledForms component', () =>  {
  it('should render a list of forms filled by the user', () =>  {
    const userFormsFilled = [{
      id: '123abc456',
      form: {
        name: 'Form One',
      },
      status: 'pending',
      createdAt: '2020-10-10'
    }]
    const rendered = render(
      <UserFilledForms userFormsFilled={userFormsFilled} userId="3954jefsdfs" />
    )
    expect(rendered.queryByText('Form One')).toBeInTheDocument()
    expect(rendered.queryByText('pending')).toBeInTheDocument()
    expect(rendered.queryByText('2020-10-10')).toBeInTheDocument()
    const item = rendered.queryByTestId('form_item')
    expect(item).not.toBeDisabled()
    expect(item).toBeInTheDocument()
  })
  it('shouldnt contain form list when list is empty', () => {
    const rendered = render(
      <UserFilledForms userFormsFilled={[]} userId="3954jefsdfs" />
    )
    expect(rendered.queryByText('You have no forms')).toBeInTheDocument()
    expect(rendered.queryByTestId('form_item')).not.toBeInTheDocument()
  })
})
