import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import AmenityList from '../Components/AmenityList';
import AmenitiesQuery from '../graphql/amenity_queries';

describe('Amenity List', () => {
  it('should render the Amenity List', async () => {
    const mock = {
      request: {
        query: AmenitiesQuery,
        variables: { offset: 0 }
      },
      result: {
        data: {
          amenities: [
            {
              name: 'Party Next door',
              description: 'X',
              location: 'Nai',
              hours: '11pm',
              invitationLink: null,
              id: '2938423'
            },
            {
              name: 'Party door',
              description: 'Des',
              location: 'lag',
              hours: '10pm',
              invitationLink: 'http://calendly.com',
              id: '293-8423'
            }
          ]
        }
      }
    };
    const wrapper = render(
      <MockedProvider mocks={[mock]} addTypename={false}>
        <MockedThemeProvider>
          <AmenityList />
        </MockedThemeProvider>
      </MockedProvider>
    );
    expect(wrapper.queryByTestId('loader')).toBeInTheDocument();
    await waitFor(() => {
      expect(wrapper.queryAllByTestId('amenity_description')[0]).toBeInTheDocument();

      // The reserve button should be present
      expect(wrapper.queryByTestId('button')).toBeInTheDocument();
      expect(wrapper.queryByText('search:search.load_more')).toBeInTheDocument();

      expect(wrapper.queryAllByTestId('discussion-menu')).toHaveLength(2);

      fireEvent.click(wrapper.queryAllByTestId('discussion-menu')[0]);

      // click the edit menu item
      fireEvent.click(wrapper.queryAllByTestId('menu_item')[0]);
      // The edit form should be visible
      expect(wrapper.queryByTestId('amenity_name')).toBeInTheDocument();

      // click the delete menu item
      fireEvent.click(wrapper.queryAllByTestId('menu_item')[1]);
      // The delete warning message should be visible
      expect(wrapper.queryByText('amenity:misc.delete_warning')).toBeInTheDocument();
      expect(wrapper.queryByTestId('proceed_button')).toBeInTheDocument();

      fireEvent.click(wrapper.queryByTestId('create_amenity_btn'));
      // The add form should be visible
      expect(wrapper.queryByTestId('amenity_name')).toBeInTheDocument();
      expect(wrapper.queryByText('common:form_actions.save')).toBeInTheDocument();
    }, 20);
  });
  it('should show no amenities found', async () => {
    const noAmenityMock = {
      request: {
        query: AmenitiesQuery,
        variables: { offset: 0 }
      },
      result: {
        data: {
          amenities: []
        }
      }
    };
    const wrapper = render(
      <MockedProvider mocks={[noAmenityMock]} addTypename={false}>
        <MockedThemeProvider>
          <AmenityList />
        </MockedThemeProvider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(wrapper.queryByText('search:search.load_more')).not.toBeInTheDocument();
      expect(wrapper.queryByText('amenity:misc.no_amenity_added')).toBeInTheDocument();
    }, 5)
  })
});
