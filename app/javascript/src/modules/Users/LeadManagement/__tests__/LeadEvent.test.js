import React from 'react';

import { render, screen, waitFor,  fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import authState from '../../../../__mocks__/authstate';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import LeadEvent from '../Components/LeadEvent';

import MockedThemeProvider from '../../../__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('LeadEvents Page', () => {
  const leadEvent = {
    id: 'c96f64bb-e3b4-42ff-b6a9-66889ec79e9990099',
    name: 'Tilisi run',
    createdAt: '2022-02-26T08:48:00Z',
    actingUser: {
      name: 'Daniel Mutuba'
    }
  };

  const handleEditClick = jest.fn()

  it('LeadEvents component', async () => {
    render(
      <Context.Provider value={authState}>
        <BrowserRouter>
          <MockedThemeProvider>
            <LeadEvent leadEvent={leadEvent} handleEditClick={handleEditClick} />
          </MockedThemeProvider>
        </BrowserRouter>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('event-name')).toBeInTheDocument();
      expect(screen.queryByTestId('event-date')).toBeInTheDocument();
      expect(screen.queryByTestId('event-created-by')).toBeInTheDocument();
      expect(screen.queryByText('Tilisi run')).toBeInTheDocument();
      expect(screen.queryByText('2022-02-26')).toBeInTheDocument();

      fireEvent.click(screen.queryByTestId('edit_click'));
      expect(handleEditClick).toBeCalled();
    });
  });
});
