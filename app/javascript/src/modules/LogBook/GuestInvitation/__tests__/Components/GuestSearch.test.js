import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import routeData, { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom/extend-expect';
import { EntryRequestQuery, SearchGuestsQuery } from '../../graphql/queries';
import GuestSearch from '../../Components/GuestSearch';
import { Context } from '../../../../../containers/Provider/AuthStateProvider';
import userMock from '../../../../../__mocks__/authstate';

describe('Guest Search Component', () => {
  it('should render the guest search component', async () => {
    const GuestQuery = {
      request: {
        query: SearchGuestsQuery,
        variables: {
          query: 'guest.id'
        }
      },
      result: {
        data: {
          searchGuests: [
            {
              name: 'Ba Visitor',
              id: '10ec-414f-823c-58be12b55608'
            }
          ]
        }
      }
    };

    const { getByTestId, queryAllByText } = render(
      <MockedProvider mocks={[GuestQuery]} addTypename={false}>
        <Context.Provider value={userMock}>
          <MemoryRouter>
            <GuestSearch />
          </MemoryRouter>
        </Context.Provider>
      </MockedProvider>
    );

    const search = getByTestId('search');
    const inviteBtn = getByTestId('invite_btn');

    expect(search).toBeInTheDocument();
    expect(inviteBtn).toBeInTheDocument();

    fireEvent.change(search, { target: { value: "some value" } })

    fireEvent.click(inviteBtn)

    await waitFor(() => {
      expect(queryAllByText('logbook:guest.invite_guest')[0]).toBeInTheDocument()
      expect(getByTestId('guest_entry_name')).toBeInTheDocument(); // check if we can see the form after clicking the button
    }, 10)
  });
});

describe('when there are params', () => {
  const mockParams = {
    guestId: '123',
  }
  beforeEach(() => {
    jest.spyOn(routeData, 'useParams').mockReturnValue(mockParams)
  });
  it('should test if modal shows up when guestId is defined', async () => {

    const GuestQuery = {
      request: {
        query: EntryRequestQuery,
        variables: {
          id: mockParams.guestId
        }
      },
      result: {
        data: {
          entryRequest: {
            name: 'Ba Visitor',
            id: '10ec-414f-823c-58be12b55608',
            phoneNumber: "0239012392103",
            email: "some@some.com"
          }
        }
      }
    };
    const { getByTestId } = render(
      <MockedProvider mocks={[GuestQuery]} addTypename={false}>
        <Context.Provider value={userMock}>
          <MemoryRouter>
            <GuestSearch />
          </MemoryRouter>
        </Context.Provider>
      </MockedProvider>
    );
      // tests
      await waitFor(() => {
        expect(getByTestId('invite_button')).toBeInTheDocument();
        expect(getByTestId('invite_button').textContent).toContain('guest.invite_guest');
        expect(getByTestId('day_of_visit_input')).toBeInTheDocument();
        expect(getByTestId('start_time_input')).toBeInTheDocument();
        expect(getByTestId('end_time_input')).toBeInTheDocument();
        expect(getByTestId('guest_repeats_on')).toBeInTheDocument();
      }, 20)
  })
})
