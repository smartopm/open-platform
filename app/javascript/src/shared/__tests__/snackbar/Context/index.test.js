/* eslint-disable react/jsx-no-undef */
import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import MockedThemeProvider from '../../../../modules/__mocks__/mock_theme'
import SnackbarProvider from '../../../snackbar/Context'

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