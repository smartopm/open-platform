import React from 'react';
import { render, screen, waitFor  } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import authState from '../../../__mocks__/authstate';
import GuestQRPage, { GuestQRCode } from '../Components/GuestQRPage';
import { EntryRequestQuery } from '../../../graphql/queries';

describe('Guest QRPage Component',  () => {
  const mocks = [
      {
      request: {
        query: EntryRequestQuery,
        variables: { id: 'd6765-b10e-4865-bee7' }
      },
      result: {
        data: {
          result: {
            id: 'd6765-b10e-4865-bee7',
            name: 'A new name',
            phoneNumber: '309475834',
            email: 'email@gmail.com',
            nrc: '37348u53',
            vehiclePlate: null,
            reason: 'prospective_client',
            otherReason: null,
            concernFlag: null,
            grantedState: 1,
            createdAt: '2020-10-15T09:31:02Z',
            updatedAt: '2020-10-15T09:31:06Z',
            grantedAt: '2020-10-15T09:31:06Z',
            revokedAt: '2020-10-15T09:31:06Z',
            isGuest: true,
            grantor: {
              id: '68686876fhfhf',
              name: 'Some guard',
              __typename: 'User'
            },
            user: {
              id: 'a54d6184-b10e-4865-bee7-7957701d423d',
              name: 'John',
              __typename: 'User'
            },
            guest: {
              id: 'a54d6184-b10e-4865-bee7-456446423d',
              status: 'active',
              __typename: 'User'
            },
            occursOn: ['monday'],
            visitEndDate: '2020-10-15T09:31:06Z',
            visitationDate: '2020-10-05T09:31:06Z',
            endsAt: '2020-10-15T09:31:06Z',
            startsAt: '2020-10-15T19:31:06Z',
            endTime: '2020-10-15T09:31:06Z',
            startTime: '2020-10-15T19:31:06Z',
            companyName: '',
            guestId: authState.user.id,
            guard: {
              id: '68686876fhfhf',
              name: 'Guard',
              __typename: 'User'
            },
            status: 'approved',
            imageUrls: [''],
            videoUrl: '',
            __typename: 'EntryRequest'
          }
        }
      }
    }
  ]
  it('renders GuestQRPage component', async() => {
    render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <Context.Provider value={authState}>
            <GuestQRPage
              match={{params: {id: 'd6765-b10e-4865-bee7'}}}
            />
          </Context.Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    await waitFor(() => {
    expect(screen.queryByText('guest.qr_code')).toBeInTheDocument();
    expect(screen.queryByText('John Doctor')).toBeInTheDocument();
  }, 10)
  });

  it('renders GuestQRCode component', () => {
    const data = {
      user: {
        id: 'a54d6184-b10e-4865-bee7-7957701d423d',
        name: 'John Doe',
        userType: 'visitor',
      }
    };

    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <Context.Provider value={authState}>
            <GuestQRCode
              data={data}
              requestId="d6765-b10e-4865-bee7"
            />
          </Context.Provider>
        </BrowserRouter>
      </MockedProvider>
    );
      expect(container.queryByText('guest.qr_code')).toBeInTheDocument();
      expect(container.queryByText('John Doe')).toBeInTheDocument();
  });

});