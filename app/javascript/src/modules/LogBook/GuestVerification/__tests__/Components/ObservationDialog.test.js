import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import routeData, { MemoryRouter } from 'react-router';
import { MockedProvider } from '@apollo/react-testing';
import { EntryRequestContext } from '../../Context';
import ObservationDialog from '../../Components/ObservationDialog';
import AddObservationNoteMutation from '../../../graphql/logbook_mutations';
import MockedThemeProvider from '../../../../__mocks__/mock_theme';
import MockedSnackbarProvider from '../../../../__mocks__/mock_snackbar';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Observation Dialog component', () => {
  const mockHistory = {
    push: jest.fn()
  };
  beforeEach(() => {
    jest.spyOn(routeData, 'useHistory').mockReturnValue(mockHistory);
  });
  it('should render correctly', async () => {
    const mocks = [
      {
        request: {
          query: AddObservationNoteMutation,
          variables: {
            id: 'someids',
            note: 'This is an observation',
            refType: 'Logs::EntryRequest',
            attachedImages: []
          }
        },
        result: { data: { entryRequestNote: { event: { id: 'someids' } } } }
      }
    ];
    const container = render(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <EntryRequestContext.Provider
            value={{
              request: {
                isObservationOpen: true,
                id: 'someids'
              },
              observationDetails: {
                isError: false,
                message: 'Success'
              },
              updateRequest: jest.fn()
            }}
          >
            <MockedThemeProvider>
              <MockedSnackbarProvider>
                <ObservationDialog />
              </MockedSnackbarProvider>
            </MockedThemeProvider>
          </EntryRequestContext.Provider>
        </MockedProvider>
      </MemoryRouter>
    );
    expect(container.queryByTestId('skip_and_scan')).toBeInTheDocument();
    expect(container.queryByTestId('save_and_record_other')).toBeInTheDocument();
    expect(container.queryByTestId('close_go_dashboard')).toBeInTheDocument();
    expect(container.queryByTestId('entry-dialog-field')).toBeInTheDocument();

    fireEvent.click(container.queryByTestId('close_go_dashboard'));
    expect(mockHistory.push).toBeCalled();

    fireEvent.click(container.queryByTestId('skip_and_scan'));
    expect(mockHistory.push).toBeCalled();

    fireEvent.click(container.queryByTestId('save_and_record_other'));

    await waitFor(() => {
      expect(mockHistory.push).toBeCalled();
    }, 10);
  });
});
