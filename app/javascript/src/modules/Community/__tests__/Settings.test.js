import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import CommunitySettings from '../components/Settings';
import { CommunityUpdateMutation } from '../graphql/community_mutations';
import MockedThemeProvider from '../../__mocks__/mock_theme';

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
          tagline: '',
          logoUrl: '',
          wpLink: '',
          themeColors: { primaryColor: '#69ABA4', secondaryColor: '#cf5628' },
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
    const refetchMock = jest.fn();
    const container = render(
      <MockedProvider mocks={[communityMutatioMock]}>
        <MockedThemeProvider>
          <CommunitySettings data={data} token="374857uwehfsdf232" refetch={refetchMock} />
        </MockedThemeProvider>
      </MockedProvider>
    );
    expect(container.queryByText('community.community_logo')).toBeInTheDocument();
    expect(container.queryByText('community.change_community_logo')).toBeInTheDocument();
    expect(container.queryByText('community.upload_logo')).toBeInTheDocument();
    expect(container.queryByText('community.support_contact')).toBeInTheDocument();
    expect(container.queryByText('community.make_changes_support_contact')).toBeInTheDocument();
    expect(container.queryByText('common:form_fields.add_phone_number')).toBeInTheDocument();
    expect(container.queryByText('common:form_fields.add_email_address')).toBeInTheDocument();
    expect(container.queryByText('common:form_fields.add_whatsapp_number')).toBeInTheDocument();
    expect(container.queryByText('community.update_community')).toBeInTheDocument();
    expect(container.queryByText('community.update_community')).not.toBeDisabled();
    expect(container.queryAllByLabelText('common:form_fields.email')).toHaveLength(2);
    expect(container.queryByLabelText('common:form_fields.phone_number')).toBeInTheDocument();
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
    expect(container.queryAllByLabelText('common:form_fields.email')).toHaveLength(3);

    fireEvent.click(container.queryByTestId('whatsapp_click'));
    expect(container.queryAllByLabelText('WhatsApp')).toHaveLength(2);

    fireEvent.change(container.queryByTestId('logo_url'), {
      target: { value: 'https://something.com' }
    });
    expect(container.queryByTestId('logo_url').value).toBe('https://something.com');

    fireEvent.change(container.queryByTestId('tagline'), {
      target: { value: 'This is our tagline' }
    });
    expect(container.queryByTestId('tagline').value).toBe('This is our tagline');

    fireEvent.change(container.queryByTestId('wp_link'), {
      target: { value: 'https://wordpress.com' }
    });
    expect(container.queryByTestId('wp_link').value).toBe('https://wordpress.com');

    // fire the mutation update_community
    expect(container.queryByTestId('update_community')).not.toBeDisabled();

    fireEvent.click(container.queryByTestId('update_community'));

    expect(container.queryByTestId('update_community')).toBeDisabled();

    await waitFor(() => {
      expect(refetchMock).toBeCalled();
      expect(container.queryByText('community.community_updated')).toBeInTheDocument();
    }, 10);
  });
});
