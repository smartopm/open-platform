import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import FormPropertyCreateForm from '../../components/Forms/FormPropertyCreateForm'

describe('Form that creates other forms component', () => {
  it('it should render with no errors', () => {
    const container = render(
      <MockedProvider mocks={[]}>
        <FormPropertyCreateForm formId="34905fhjsbdf34" refetch={jest.fn()} />
      </MockedProvider>
    )
    expect(container.queryByText("Field Name")).toBeInTheDocument()
    expect(container.queryAllByText("Field Type").length).toBe(2)
    expect(container.queryByText("This field is required")).toBeInTheDocument()
    expect(container.queryByText("Only for admins")).toBeInTheDocument()
    expect(container.queryByText("Add Property")).toBeInTheDocument()
  })
})
