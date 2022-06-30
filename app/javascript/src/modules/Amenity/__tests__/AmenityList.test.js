import { MockedProvider } from '@apollo/react-testing';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import AmenityList from '../Components/AmenityList';
import { AmenitiesQuery } from '../graphql/amenity_queries';

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
      expect(wrapper.queryAllByTestId('amenity_description')).toHaveLength(2);

      // The reserve button should be present
      expect(wrapper.queryByTestId('button')).toBeInTheDocument();
      expect(wrapper.queryByText('search:search.load_more')).toBeInTheDocument();
    }, 20);
  });
});
