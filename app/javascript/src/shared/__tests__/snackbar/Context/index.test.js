/* eslint-disable react/jsx-no-undef */
import React, { useContext } from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import MockedThemeProvider from '../../../../modules/__mocks__/mock_theme'
import SnackbarProvider, { SnackbarContext } from '../../../snackbar/Context'
import { mockedSnackbarProviderProps } from '../../../../modules/__mocks__/mock_snackbar'

describe('SnackbarProvider', () => {
  it('should render children correctly', async () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <SnackbarProvider>
              <p data-testid="child-element">Child Element</p>
            </SnackbarProvider>
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>)

      await waitFor(() => {
        expect(screen.queryByTestId('child-element')).toBeInTheDocument()
        expect(screen.queryByTestId('child-element').textContent).toEqual('Child Element')
      }, 10)
  })
})

describe('SnackbarContext', () => {
  const TestComponent = () => {
    const { showSnackbar, messageType } = useContext(SnackbarContext);
    showSnackbar({ type: messageType.success, message: 'Test Message' })

    return <span />
  }

  it('should trigger showSnackbar', async () => {
    render(
      <SnackbarContext.Provider value={{...mockedSnackbarProviderProps}}>
        <TestComponent />
      </SnackbarContext.Provider>
    )

    await waitFor(() => {
      expect(mockedSnackbarProviderProps.showSnackbar).toHaveBeenCalledWith({
        type: mockedSnackbarProviderProps.messageType.success,
        message: 'Test Message'
      });
    })
  });
});