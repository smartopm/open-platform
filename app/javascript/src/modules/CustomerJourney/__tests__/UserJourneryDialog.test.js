import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'

import { MockedProvider } from '@apollo/react-testing'
import { UserJourneyUpdateMutation } from '../../../graphql/mutations/user_journey'
import UserJourneyDialog from '../../Users/Components/UserJourneyDialog'
import { SnackbarContext } from '../../../shared/snackbar/Context'
import { mockedSnackbarProviderProps } from '../../__mocks__/mock_snackbar'


describe('user journey dialog', () => {
    const log =  {
        id: '90849232-234234-sdfloeop34',
        startDate: new Date(2020, 2, 1),
        stopDate: new Date(2020, 2, 3),
        userId: '90849232-234234-9238493284e9ewdx'
      }
    it('should call the mutation', async () => {

    const open = true
    const refetch = jest.fn()
    const handleClose = jest.fn()

    const mocks = [
      {
        request: {
          query: UserJourneyUpdateMutation,
          variables: {
            id: log.id,
            userId: log.userId,
            startDate: log.startDate
           },
        },
        result: { data: { substatusLogUpdate: { log: { id: log.id } } } },
      },
    ];
    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SnackbarContext.Provider value={{...mockedSnackbarProviderProps}}>
          <UserJourneyDialog
            open={open}
            handleModalClose={handleClose}
            log={log}
            refetch={refetch}
          />
        </SnackbarContext.Provider>
      </MockedProvider>
    )

    expect(container.queryByText('users.user_step')).toBeInTheDocument()

    expect(container.queryByTestId('custom-dialog-button').textContent).toContain('common:form_actions.save')
    fireEvent.click(container.queryByTestId('custom-dialog-button'))

    await waitFor(() => {
      expect(refetch).toBeCalled()
      expect(mockedSnackbarProviderProps.showSnackbar).toHaveBeenCalledWith({
        type: mockedSnackbarProviderProps.messageType.success,
        message: 'users.user_success',
      });
    }, 10)
  })

  it('should display an error when the mutation fails', async () => {
    const open = true
    const refetch = jest.fn()
    const handleClose = jest.fn()

    const mocks = [
      {
        request: {
            query: UserJourneyUpdateMutation,
            variables: {
              id: log.id,
              userId: log.userId,
              startDate: log.startDate
             },
          },
        error: new Error('An error occurred, the date is wrong'),
      },
    ];

    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SnackbarContext.Provider value={{...mockedSnackbarProviderProps}}>
          <UserJourneyDialog
            open={open}
            handleModalClose={handleClose}
            log={log}
            refetch={refetch}
          />
        </SnackbarContext.Provider>
      </MockedProvider>
    )
    fireEvent.click(container.queryByTestId('custom-dialog-button'))

    await waitFor(() => {
      expect(handleClose).not.toBeCalled()
      expect(refetch).not.toBeCalled()
      expect(mockedSnackbarProviderProps.showSnackbar).toHaveBeenCalledWith({
        type: mockedSnackbarProviderProps.messageType.error,
        message: ' An error occurred, the date is wrong',
      });
    }, 10)
  })
})
