import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import routeData, { MemoryRouter } from 'react-router';
import { MockedProvider } from '@apollo/react-testing';
import { EntryRequestContext } from '../../Context';
import ObservationDialog from '../../Components/ObservationDialog';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Observation Dialog component', () => {
  const mockHistory = {
    push: jest.fn()
  };
  beforeEach(() => {
    jest.spyOn(routeData, 'useHistory').mockReturnValue(mockHistory);
  });
  it('should render correctly', () => {
    const container = render(
      <MemoryRouter>
        <MockedProvider>
          <EntryRequestContext.Provider
            value={{
              request: {
                isObservationOpen: true
              },
              observationDetails: {
                isError: false,
                message: 'Success'
              },
              updateRequest: jest.fn()
            }}
          >
            <ObservationDialog />
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

    fireEvent.click(container.queryByTestId('save_and_record_other'));
    expect(mockHistory.push).toBeCalled();

    fireEvent.click(container.queryByTestId('skip_and_scan'));
    expect(mockHistory.push).toBeCalled();
  });
});
