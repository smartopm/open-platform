import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { MemoryRouter } from 'react-router';
import GuestSearch from '../../Components/GuestSearch';
import { Context } from '../../../../../containers/Provider/AuthStateProvider';
import userMock from '../../../../../__mocks__/authstate';
import MockedThemeProvider from '../../../../__mocks__/mock_theme';

describe('Guest Search Component', () => {
  it('should render the guest search component', async () => {
    const { getAllByText } = render(
      <MockedProvider>
        <Context.Provider value={userMock}>
          <MemoryRouter>
            <MockedThemeProvider>
              <GuestSearch />
            </MockedThemeProvider>
          </MemoryRouter>
        </Context.Provider>
      </MockedProvider>
    );
    // Verifying if the component was rendered
    const datePicker = getAllByText('common:misc.day_of_visit');
    await waitFor(() => {
      expect(datePicker[0]).toBeInTheDocument();
    }, 5)
  });
});