import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import LogEvents from '../Components/LogEvents';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import userMock from '../../../__mocks__/userMock';
import MockedThemeProvider from '../../__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Log Events Component', () => {
  const endTime = new Date();
  endTime.setHours(endTime.getHours() + 1);

  const data = [
    {
      "id": "02b656be-00b3-4bc2-90a4-0d86d2b72d2a",
      "createdAt": "2021-09-22T13:57:55+02:00",
      "refId": "eedf3caf-13a1-4d5b-ac9a-22dd99a64bb2",
      "refType": "Logs::EntryRequest",
      "subject": "visitor_entry",
      "sentence": "Admin User granted Test Guest for entry.",
      "data": {
          "action": "granted",
          "ref_name": "Test Guest",
          "type": "admin",
          "note": 'a note'
      },
      "actingUser": {
          "name": "Admin User",
          "id": "bdf23d62-071c-4fdf-8ee5-7add18236090"
      },
      "entryRequest": {
          "reason": "client",
          "id": "eedf3caf-13a1-4d5b-ac9a-22dd99a64bb2",
          "grantedState": 1,
          "grantedAt": "2021-09-22T13:57:55+02:00",
          "name": "Test Guest",
          "startsAt": "2021-09-23T09:49:14+02:00",
          "endsAt": endTime,
          "visitationDate": "2021-09-23T09:50:00+02:00",
          "grantor": {
            id: 'bdf23d62-071c-4fdf-8ee5-7add1823609'
          }
      },
      "imageUrls": ['sampleimg'],
      "user": null
    }
  ]

  it('renders log event component', () => {
    const container = render(
      <MockedProvider>
        <MockedThemeProvider>
          <BrowserRouter>
            <Context.Provider value={userMock}>
              <LogEvents 
                data={data}
                loading={false}
                userType='admin'
                handleExitEvent={jest.fn()}
                handleAddObservation={jest.fn()}
                routeToAction={jest.fn()}
                enrollUser={jest.fn}
              />
            </Context.Provider>
          </BrowserRouter>
        </MockedThemeProvider>
      </MockedProvider>
    );

    expect(container.queryByTestId('card')).toBeInTheDocument();
    expect(container.queryByTestId('name')).toBeInTheDocument();
    expect(container.queryByTestId('acting-user')).toBeInTheDocument();
    expect(container.queryByTestId('note')).toBeInTheDocument();
    expect(container.queryByTestId('created-at')).toBeInTheDocument();
    expect(container.queryByTestId('image-area')).toBeInTheDocument();
  });
  
  it('renders no logs when data is empty', () => {
    const container = render(
      <MockedProvider>
        <MockedThemeProvider>
          <BrowserRouter>
            <Context.Provider value={userMock}>
              <LogEvents 
                data={[]}
                loading={false}
                userType='admin'
                handleExitEvent={jest.fn()}
                handleAddObservation={jest.fn()}
                routeToAction={jest.fn()}
                enrollUser={jest.fn}
              />
            </Context.Provider>
          </BrowserRouter>
        </MockedThemeProvider>
      </MockedProvider>
    );

    expect(container.queryByText('logbook.no_logs')).toBeInTheDocument();
  });
});
