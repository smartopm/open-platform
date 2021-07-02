import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import GroupedObservations from '../Components/GroupedObservations';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import userMock from '../../../__mocks__/userMock';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('GroupedObservations Component', () => {
  const data = {
    '2021-05-05': [
      {
        refId: '123',
        refType: 'Logs::EntryRequest',
        actingUser: {
          name: 'Nurudeen Ibrahim'
        },
        data: {
          note:
            'Car used on entry was extremly rough and the xhaust of the vehicle was bad and made a lot of noise'
        },
        createdAt: '2021-05-05',
        entryRequest: {
          id: '123',
          name: 'Gbemisola',
          startTime: '2021-05-05',
          reason: 'Prospective Client',
          grantedState: 1
        }
      }
    ]
  };

  it('renders grouped Observations', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <Context.Provider value={userMock}>
            <GroupedObservations
              groupedDate="2021-05-05"
              eventLogs={data['2021-05-05']}
              routeToEntry={() => {}}
            />
          </Context.Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.getByText(/Gbemisola/g)).toBeInTheDocument();
    expect(container.getByText(/Time of access/g)).toBeInTheDocument();
  });
});
