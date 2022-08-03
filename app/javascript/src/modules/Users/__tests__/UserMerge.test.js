import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import { MockedProvider } from '@apollo/react-testing'
import UserMerge from '../Components/UserMerge'
import { SnackbarContext } from '../../../shared/snackbar/Context'
import { mockedSnackbarProviderProps } from '../../__mocks__/mock_snackbar'

describe('user merge component', () => {
  it('should should include callable buttons', () => {
    const closeHandler = jest.fn()
    const props = {
      userId: '35tf3t4534',
      close: closeHandler
    }
    const container = render(
      <MockedProvider mocks={[]}>
        <SnackbarContext.Provider value={{...mockedSnackbarProviderProps}}>
          <UserMerge {...props} />
        </SnackbarContext.Provider>
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
    expect(mockedSnackbarProviderProps.showSnackbar).toHaveBeenCalledWith({
      type: mockedSnackbarProviderProps.messageType.error,
      message: 'errors.no_user_selected'
    });
  })
})
