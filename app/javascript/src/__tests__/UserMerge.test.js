import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import UserMerge from '../components/User/UserMerge'
import { MockedProvider } from '@apollo/react-testing'

describe('user merge component', () => {
  it('should should include callable buttons', () => {
    const closeHandler = jest.fn()
    const props = {
      userId: '35tf3t4534',
      close: closeHandler
    }
    const container = render(
      <MockedProvider mocks={[]}>
        <UserMerge {...props} />
      </MockedProvider>
    )
    const mergeBtn = container.queryByText('Merge Users')
    const cancelBtn = container.queryByText('Cancel')
    expect(mergeBtn).toBeInTheDocument()
    expect(cancelBtn).toBeInTheDocument()

    fireEvent.click(cancelBtn)
    expect(closeHandler).toHaveBeenCalled()
    fireEvent.click(mergeBtn)
    // since no user will be selected expect an error
    expect(
      container.queryByText('You have to select a user')
    ).toBeInTheDocument()
  })
})
