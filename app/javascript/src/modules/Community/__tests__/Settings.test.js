import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import CommunitySettings from '../components/Settings';
import { CommunityUpdateMutation } from '../graphql/community_mutations';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Community settings page ', () => {
  it('should have input field and a remove button', async () => {
    const data = {
      supportNumber: [
        {
          phone_number: '260971500748',
          category: 'sales'
        }
      ],
      supportWhatsapp: [
        {
          whatsapp: '260920000748',
          category: 'sales'
        }
      ],
      supportEmail: [
        {
          email: 'abc@gmail.com',
          category: 'customer care'
        },
        {
          email: 'joey@hi.co',
          category: 'sales'
        }
      ],
      logoUrl: null
    };

    const communityMutatioMock = {
      request: {
        query: CommunityUpdateMutation,
        variables: {
          supportNumber: [{ phone_number: '', category: '' }],
          supportEmail: [
            { email: 'abc@gmail.com', category: 'customer care' },
            { email: 'joey@hi.co', category: 'sales' },
            { email: '', category: '' }
          ],
          supportWhatsapp: [
            { whatsapp: '260920000748', category: 'sales' },
            { whatsapp: '', category: '' }
          ],
          imageBlobId: null,
          locale: 'en-US',
          tagline: ''
        }
      },
      result: {
        data: {
          communityUpdate: {
            id: '11cdad78-5a04-4026-828c-17290a2c44b6'
          }
        }
      }
    };
    const mockRefetch = jest.fn();
    const container = render(
      <MockedProvider mocks={[communityMutatioMock]}>
        <CommunitySettings data={data} refetch={mockRefetch} />
      </MockedProvider>
    );
    expect(container.queryByText('Community Logo')).toBeInTheDocument();
    expect(container.queryByText('You can change your community logo here')).toBeInTheDocument();
    expect(container.queryByText('Upload new logo')).toBeInTheDocument();
    expect(container.queryByText('Support Contact Information')).toBeInTheDocument();
    expect(
      container.queryByText('Make changes to your contact information here.')
    ).toBeInTheDocument();
    expect(container.queryByText('Add New Phone Number')).toBeInTheDocument();
    expect(container.queryByText('Add New Email Address')).toBeInTheDocument();
    expect(container.queryByText('Add New WhatsApp Number')).toBeInTheDocument();
    expect(container.queryByText('UPDATE COMMUNITY SETTINGS')).toBeInTheDocument();
    expect(container.queryByText('UPDATE COMMUNITY SETTINGS')).not.toBeDisabled();
    expect(container.queryAllByLabelText('Email')).toHaveLength(2);
    expect(container.queryByLabelText('Phone Number')).toBeInTheDocument();
    expect(container.queryByLabelText('WhatsApp')).toBeInTheDocument();

    expect(container.queryAllByLabelText('remove')).toHaveLength(4);

    fireEvent.click(container.queryAllByTestId('add_number')[0]);

    expect(container.queryAllByLabelText('remove')).toHaveLength(5);
    fireEvent.click(container.queryAllByLabelText('remove')[0]);
    expect(container.queryAllByLabelText('remove')).toHaveLength(4);

    expect(container.queryByTestId('locale')).toBeInTheDocument();
    expect(container.queryByTestId('currency')).toBeInTheDocument();

    fireEvent.select(container.queryByTestId('locale'), { target: { value: 'en-US' } });
    expect(container.queryByTestId('locale').value).toBe('en-US');

    fireEvent.select(container.queryByTestId('currency'), { target: { value: 'ZMW' } });
    expect(container.queryByTestId('currency').value).toBe('ZMW');

    fireEvent.click(container.queryByTestId('email_click'));
    expect(container.queryAllByLabelText('Email')).toHaveLength(3);

    fireEvent.click(container.queryByTestId('whatsapp_click'));
    expect(container.queryAllByLabelText('WhatsApp')).toHaveLength(2);

    // fire the mutation update_community
    expect(container.queryByTestId('update_community')).not.toBeDisabled();

    fireEvent.click(container.queryByTestId('update_community'));

    expect(container.queryByTestId('update_community')).toBeDisabled();

    await waitFor(() => {
      // check if mutation was called
      expect(mockRefetch).toBeCalled();
      expect(container.queryByText('Successfully updated the community')).toBeInTheDocument();
    });
  });
});
