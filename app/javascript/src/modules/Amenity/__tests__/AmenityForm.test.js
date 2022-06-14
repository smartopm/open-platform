import { MockedProvider } from '@apollo/react-testing';
import { waitFor, render } from '@testing-library/react';
import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import AmenityForm from '../Components/AmenityForm';
import { AmenityCreateMutation } from '../graphql/amenity_mutations';

describe('Amenity Form', () => {
  it('should render the form properly', async () => {
    const openDialog = jest.fn();
    const refetch = jest.fn();
    const userEvent = ReactTestUtils.Simulate;
    const mock = {
      request: {
        query: AmenityCreateMutation,
        variables: {
          name: 'Example Title',
          description: 'Example',
          location: 'LSK',
          hours: '10:00',
          invitationLink: 'http'
        }
      },
      result: {
        data: {
          amenityCreate: {
            success: true
          }
        }
      }
    };
    const wrapper = render(
      <MockedProvider mocks={[mock]} addTypename={false}>
        <AmenityForm isOpen setOpen={openDialog} refetch={refetch} />
      </MockedProvider>
    );
    expect(wrapper.queryByTestId('amenity_name')).toBeInTheDocument();
    expect(wrapper.queryByTestId('amenity_description')).toBeInTheDocument();
    expect(wrapper.queryByTestId('amenity_location')).toBeInTheDocument();
    expect(wrapper.queryByTestId('amenity_hours')).toBeInTheDocument();
    expect(wrapper.queryByTestId('amenity_link')).toBeInTheDocument();

    userEvent.change(wrapper.queryByTestId('amenity_name'), { target: { value: 'Example Title' } });
    expect(wrapper.queryByTestId('amenity_name').value).toContain('Example Title');
    userEvent.change(wrapper.queryByTestId('amenity_description'), {
      target: { value: 'Example' }
    });
    expect(wrapper.queryByTestId('amenity_description').value).toContain('Example');
    userEvent.change(wrapper.queryByTestId('amenity_location'), { target: { value: 'LSK' } });
    expect(wrapper.queryByTestId('amenity_location').value).toContain('LSK');

    userEvent.change(wrapper.queryByTestId('amenity_hours'), { target: { value: '10:00' } });
    expect(wrapper.queryByTestId('amenity_hours').value).toContain('10:00');
    userEvent.change(wrapper.queryByTestId('amenity_link'), { target: { value: 'http' } });
    expect(wrapper.queryByTestId('amenity_link').value).toContain('http');

    // Submit a form
    userEvent.click(wrapper.queryByTestId('custom-dialog-button'));
    await waitFor(() => {
      // expect dialog to be closed and data to be refetched
      expect(openDialog).toBeCalled();
      expect(refetch).toBeCalled();
    }, 20);
  });
});
