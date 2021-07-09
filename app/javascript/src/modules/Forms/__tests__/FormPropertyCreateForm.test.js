import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import FormPropertyCreateForm from '../components/FormPropertyCreateForm'

describe('Form that creates other forms component', () => {
  it('it should render with no errors', () => {
    const container = render(
      <MockedProvider mocks={[]}>
        <FormPropertyCreateForm formId="34905fhjsbdf34" refetch={jest.fn()} />
      </MockedProvider>
    )
    expect(container.queryByText("form_fields.field_name")).toBeInTheDocument()
    expect(container.queryAllByText("form_fields.field_type").length).toBe(2)
    expect(container.queryByText("form_fields.required_field")).toBeInTheDocument()
    expect(container.queryByText("form_fields.admins_only")).toBeInTheDocument()
    expect(container.queryByText("actions.add_form_property")).toBeInTheDocument()
    expect(container.queryAllByText("form_fields.order_number").length).toBe(2)
  })
})
