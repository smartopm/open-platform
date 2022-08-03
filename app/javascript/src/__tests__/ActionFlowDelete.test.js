import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { MockedProvider } from '@apollo/react-testing'
import ActionFlowDelete from '../components/ActionFlows/ActionFlowDelete'
import { DeleteActionFlow } from '../graphql/mutations'
import { mockedSnackbarProviderProps } from '../modules/__mocks__/mock_snackbar'
import { SnackbarContext } from '../shared/snackbar/Context'

describe('action flow delete component', () => {
  it('show correct delete modal', async () => {

    const data = {
      id: '1235'
    }
    const open = true
    const refetch = jest.fn()
    const handleClose = jest.fn()
    const mocks = [
      {
        request: {
          query: DeleteActionFlow,
          variables: { id: data.id },
        },
        result: { data: { actionFlowDelete: { success: true } } },
      },
    ];
    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <SnackbarContext.Provider value={{...mockedSnackbarProviderProps}}>
            <ActionFlowDelete
              data={data}
              refetch={refetch}
              open={open}
              handleClose={handleClose}
            />
          </SnackbarContext.Provider>
        </BrowserRouter>
      </MockedProvider>
    )

    expect(container.queryByTestId('delete_dialog')).toBeInTheDocument()

    fireEvent.click(container.queryByTestId('confirm_action'))
    await waitFor(() => {
      expect(handleClose).toBeCalled()
      expect(refetch).toBeCalled()
      expect(mockedSnackbarProviderProps.showSnackbar).toHaveBeenCalledWith({
        message: 'actionflow:messages.delete_message',
        type: mockedSnackbarProviderProps.messageType.success
      });
    }, 10)
  })

  it('should display an error when the mutation fails', async () => {
    const data = {
      id: '1235'
    }
    const open = true
    const refetch = jest.fn()
    const handleClose = jest.fn()

    const mocks = [
      {
        request: {
          query: DeleteActionFlow,
          variables: { id: data.id },
        },
        error: new Error('An error occurred'),
      },
    ];

    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <SnackbarContext.Provider value={{...mockedSnackbarProviderProps}}>
            <ActionFlowDelete
              data={data}
              refetch={refetch}
              open={open}
              handleClose={handleClose}
            />
          </SnackbarContext.Provider>
        </BrowserRouter>
      </MockedProvider>
    )
    fireEvent.click(container.queryByTestId('confirm_action'))

    await waitFor(() => {
      expect(handleClose).toBeCalled()
      expect(refetch).not.toBeCalled()
      expect(mockedSnackbarProviderProps.showSnackbar).toHaveBeenCalledWith({
        message: ' An error occurred',
        type: mockedSnackbarProviderProps.messageType.error
      });
    }, 10)
  })
})
