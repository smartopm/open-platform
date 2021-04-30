import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { UserJourneyUpdateMutation } from '../../graphql/mutations/user_journey'
import UserJourneyDialog from '../../components/User/UserJourneyDialog'


describe('user journey dialog', () => {
    
    const log =  {
        id: '90849232-234234-sdfloeop34',
        startDate: '2020-03-01',
        stopDate: '2020-03-03',
        userId: '90849232-234234-9238493284e9ewdx',
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
            startDate: log.startDate,
           },
        },
        result: { data: { substatusLogUpdate: { log: log.id } } },
      },
    ];
    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UserJourneyDialog
          open={open}
          handleModalClose={handleClose}
          log={log}
          refetch={refetch}
        />
      </MockedProvider>
    )

    expect(container.queryByText('Edit Start for this step')).toBeInTheDocument()

    expect(container.queryByTestId('custom-dialog-button').textContent).toContain('Save')
    fireEvent.click(container.queryByTestId('custom-dialog-button'))

    await waitFor(() => {
      expect(refetch).toBeCalled()
      expect(container.queryByText('Successfully updated')).toBeInTheDocument()
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
              startDate: log.startDate,
             },
          },
        error: new Error('An error occurred, the date is wrong'),
      },
    ];

    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UserJourneyDialog
          open={open}
          handleModalClose={handleClose}
          log={log}
          refetch={refetch}
        />
      </MockedProvider>
    )
    fireEvent.click(container.queryByTestId('custom-dialog-button'))
    
    await waitFor(() => {
      expect(handleClose).not.toBeCalled()
      expect(refetch).not.toBeCalled()
      expect(container.queryByText('An error occurred, the date is wrong')).toBeInTheDocument()
    }, 10)
  })
})
