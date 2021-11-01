import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import '@testing-library/jest-dom/extend-expect';
import { SearchGuestsQuery } from '../../graphql/queries';
import GuestSearch from '../../Components/GuestSearch';

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
        <GuestSearch />
      </MockedProvider>
    );

    const search = getByTestId('search');
    const inviteBtn = getByTestId('invite_btn');

    expect(search).toBeInTheDocument();
    expect(inviteBtn).toBeInTheDocument();

    fireEvent.change(search, { target: { value: "some value" } })

    fireEvent.click(inviteBtn)

    expect(queryAllByText('Invite Guest')[0]).toBeInTheDocument()
    expect(getByTestId('guest_entry_name')).toBeInTheDocument(); // check if we can see the form after clicking the button
  });
});
