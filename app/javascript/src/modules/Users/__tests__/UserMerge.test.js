import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import { MockedProvider } from '@apollo/react-testing'
import UserMerge from '../Components/UserMerge'

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
    const mergeBtn = container.queryByText('users:users.merge_user')
    const cancelBtn = container.queryByText('form_actions.cancel')
    expect(mergeBtn).toBeInTheDocument()
    expect(cancelBtn).toBeInTheDocument()

    fireEvent.click(cancelBtn)
    expect(closeHandler).toHaveBeenCalled()
    fireEvent.click(mergeBtn)
    // since no user will be selected expect an error
    expect(
      container.queryByText('errors.no_user_selected')
    ).toBeInTheDocument()
  })
})
