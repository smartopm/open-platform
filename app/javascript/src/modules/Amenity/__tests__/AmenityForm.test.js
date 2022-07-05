import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { waitFor, render } from '@testing-library/react';
import ReactTestUtils from 'react-dom/test-utils';
import AmenityForm from '../Components/AmenityForm';
import { AmenityCreateMutation } from '../graphql/amenity_mutations';
import MockedSnackbarProvider from '../../__mocks__/mock_snackbar';

describe('Amenity Form', () => {
  const openDialog = jest.fn();
  const refetch = jest.fn();
  const userEvent = ReactTestUtils.Simulate;
  it('should render the form properly', async () => {
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
      result: jest.fn(() => ({
        data: {
          amenityCreate: {
            success: true
          }
        }
      }))
    };
    const wrapper = render(
      <MockedProvider mocks={[mock]} addTypename={false}>
        <MockedSnackbarProvider>
          <AmenityForm isOpen handleClose={openDialog} refetch={refetch} t={jest.fn()} />
        </MockedSnackbarProvider>
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
      expect(mock.result).toBeCalled();
    }, 20);
  });
  it('should error when provided with wrong variables', async () => {
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
      result: null,
      error: new Error('Something went wrong')
    };
    const wrapper = render(
      <MockedProvider mocks={[mock]} addTypename={false}>
        <MockedSnackbarProvider>
          <AmenityForm isOpen setOpen={openDialog} refetch={refetch} t={jest.fn()} />
        </MockedSnackbarProvider>
      </MockedProvider>
    );
    // Submit a form
    userEvent.click(wrapper.queryByTestId('custom-dialog-button'));
    await waitFor(() => {
      expect(refetch).not.toBeCalled();
    }, 20);
  });
});
