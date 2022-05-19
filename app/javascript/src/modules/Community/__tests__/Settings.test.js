/* eslint-disable max-statements */
import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import CommunitySettings from '../components/Settings';
import { CommunityUpdateMutation } from '../graphql/community_mutations';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import { EmailTemplatesQuery } from '../../Emails/graphql/email_queries';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
jest.setTimeout(10000);
describe('Community settings page', () => {
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
          category: 'customer_care'
        },
        {
          email: 'joey@hi.co',
          category: 'sales'
        }
      ],
      socialLinks: [{ social_link: 'www.facebook.com', category: 'facebook' }],

      menuItems: [
        {
          menu_link: 'http://some-link.com',
          menu_name: 'Custom Menu',
          display_on: ['Menu'],
          roles: ['admin']
        }
      ],
      leadMonthlyTargets: [{ division: 'China', target: '20' }],
      templates: {},
      subAdministrator: {},
      logoUrl: null,
      locale: 'en-US',
      currency: 'honduran_lempira',
      bankingDetails: {
        bankName: 'Test bank name',
        accountName: 'Thebe',
        accountNo: '1234',
        branch: 'Test branch',
        swiftCode: '032',
        sortCode: '456',
        address: '11, Nalikwanda Rd,',
        city: 'Lusaka',
        country: '',
        taxIdNo: ''
      },
      smsPhoneNumbers: ['+254724821901', '+254723456789'],
      emergencyCallNumber: '+94848584844',
      features: { LogBook: { features: [] } },
      themeColors: { primaryColor: '#69ABA4', secondaryColor: '#cf5628' },
      imageUrl: 'https://some-image.png'
    };

    const communityMutationMock = {
      request: {
        query: CommunityUpdateMutation,
        variables: {
          supportNumber: [{ phone_number: '', category: '' }],
          supportEmail: [
            { email: 'abc@gmail.com', category: 'customer_care' },
            { email: 'joey@hi.co', category: 'sales' },
            { email: '', category: '' }
          ],
          supportWhatsapp: [
            { whatsapp: '260920000748', category: 'sales' },
            { whatsapp: '', category: '' }
          ],
          socialLinks: [
            { social_link: 'www.facebook.com', category: 'facebook' },
            { social_link: '', category: '' }
          ],
          leadMonthlyTargets: [
            { division: 'China', target: '20' },
            { division: '', target: '' }
          ],

          menuItems: [
            {
              menu_link: 'http://some-link.com',
              menu_name: 'Custom Menu',
              display_on: ['Menu'],
              roles: ['admin']
            },
            { menu_link: '', menu_name: '', display_on: ['Dashboard'], roles: [] }
          ],
          imageBlobId: null,
          templates: {},
          locale: 'en-US',
          currency: 'honduran_lempira',
          tagline: '',
          logoUrl: '',
          wpLink: '',
          gaId: '',
          securityManager: '',
          subAdministratorId: '',
          themeColors: { primaryColor: '#69ABA4', secondaryColor: '#cf5628' },
          bankingDetails: {
            bankName: 'Test bank name',
            accountName: 'Thebe',
            accountNo: '1234',
            branch: 'Test branch',
            swiftCode: '032',
            sortCode: '456',
            address: '11, Nalikwanda Rd,',
            city: 'Lusaka',
            country: '',
            taxIdNo: ''
          },
          smsPhoneNumbers: ['+254724821901', '+254723456789'],
          emergencyCallNumber: '+94848584844',
          features: { LogBook: { features: [] } }
        }
      },
      result: {
        data: {
          communityUpdate: {
            community: {
              id: '11cdad78-5a04-4026-828c-17290a2c44b6'
            }
          }
        }
      }
    };

    const templateMock = {
      request: {
        query: EmailTemplatesQuery
      },
      result: {
        data: {
          emailTemplates: [
            {
              id: '501b718c-8687-4e78-60b732df534ab1',
              name: 'payment_reminder_template',
              subject: 'greet',
              data: {},
              variableNames: {},
              createdAt: new Date(),
              tag: 'some_tag'
            }
          ]
        }
      }
    };
    const refetchMock = jest.fn();
    const container = render(
      <MockedProvider mocks={[communityMutationMock, templateMock]} addTypename={false}>
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
    expect(container.queryByText('common:form_fields.add_social_link')).toBeInTheDocument();
    expect(container.queryByText('common:form_fields.add_menu_item')).toBeInTheDocument();
    expect(container.queryByText('common:form_fields.add_division')).toBeInTheDocument();
    expect(container.queryByText('community.update_community')).toBeInTheDocument();
    expect(container.queryByText('community.update_community')).not.toBeDisabled();
    expect(container.queryAllByLabelText('common:form_fields.email')).toHaveLength(2);
    expect(container.queryByLabelText('common:form_fields.phone_number')).toBeInTheDocument();
    expect(container.queryByLabelText('WhatsApp')).toBeInTheDocument();
    expect(container.queryAllByText('community.sms_phone_numbers')[0]).not.toBeDisabled();
    expect(container.queryAllByText('community.emergency_call_number')[0]).not.toBeDisabled();
    expect(container.queryByText('community.sms_phone_numbers_header')).toBeInTheDocument();
    expect(container.queryAllByText('community.google_analytics_id')[0]).toBeInTheDocument();

    expect(container.queryAllByLabelText('remove')).toHaveLength(6);

    fireEvent.click(container.queryAllByTestId('add_number')[0]);

    expect(container.queryAllByLabelText('remove')).toHaveLength(7);
    fireEvent.click(container.queryAllByLabelText('remove')[0]);
    expect(container.queryAllByLabelText('remove')).toHaveLength(6);

    expect(container.queryByTestId('locale')).toBeInTheDocument();
    expect(container.queryByTestId('currency')).toBeInTheDocument();

    expect(container.queryByTestId('accountName')).toBeInTheDocument();
    expect(container.queryByTestId('accountNo')).toBeInTheDocument();
    expect(container.queryByTestId('bankName')).toBeInTheDocument();
    expect(container.queryByTestId('branch')).toBeInTheDocument();
    expect(container.queryByTestId('swiftCode')).toBeInTheDocument();
    expect(container.queryByTestId('sortCode')).toBeInTheDocument();
    expect(container.queryByTestId('address')).toBeInTheDocument();
    expect(container.queryByTestId('city')).toBeInTheDocument();
    expect(container.queryByTestId('country')).toBeInTheDocument();
    expect(container.queryByTestId('taxIdNo')).toBeInTheDocument();
    expect(container.queryByTestId('smsPhoneNumber')).toBeInTheDocument();
    expect(container.queryByTestId('emergencyCallNumber')).toBeInTheDocument();

    await waitFor(() => {
      expect(container.queryByTestId('payment_reminder_template_behind')).toBeInTheDocument();
      expect(container.queryByTestId('payment_reminder_template_upcoming')).toBeInTheDocument();
    }, 10);

    expect(container.queryByTestId('plan_status_behind')).toBeInTheDocument();
    expect(container.queryByTestId('plan_status_upcoming')).toBeInTheDocument();
    expect(container.queryByTestId('disable_deny_gate_access')).toBeInTheDocument();
    expect(container.queryByTestId('enable_automated_task_reminders')).toBeInTheDocument();

    fireEvent.change(container.queryByTestId('payment_reminder_template_behind'), {
      target: { value: 'payment_reminder_template' }
    });
    expect(container.queryByTestId('payment_reminder_template_behind').value).toBe(
      'payment_reminder_template'
    );

    fireEvent.change(container.queryByTestId('payment_reminder_template_upcoming'), {
      target: { value: 'payment_reminder_template' }
    });
    expect(container.queryByTestId('payment_reminder_template_upcoming').value).toBe(
      'payment_reminder_template'
    );

    fireEvent.change(container.queryByTestId('locale'), { target: { value: 'en-US' } });
    expect(container.queryByTestId('locale').value).toBe('en-US');

    fireEvent.change(container.queryByTestId('currency'), { target: { value: 'zambian_kwacha' } });
    expect(container.queryByTestId('currency').value).toBe('zambian_kwacha');

    fireEvent.change(container.queryByTestId('accountName'), { target: { value: 'Thebe' } });
    expect(container.queryByTestId('accountName').value).toBe('Thebe');

    fireEvent.change(container.queryByTestId('accountNo'), { target: { value: '1234' } });
    expect(container.queryByTestId('accountNo').value).toBe('1234');

    fireEvent.change(container.queryByTestId('bankName'), { target: { value: 'UBA' } });
    expect(container.queryByTestId('bankName').value).toBe('UBA');

    fireEvent.change(container.queryByTestId('branch'), { target: { value: 'LU' } });
    expect(container.queryByTestId('branch').value).toBe('LU');

    fireEvent.change(container.queryByTestId('swiftCode'), { target: { value: 'xyz' } });
    expect(container.queryByTestId('swiftCode').value).toBe('xyz');

    fireEvent.change(container.queryByTestId('sortCode'), { target: { value: '067' } });
    expect(container.queryByTestId('sortCode').value).toBe('067');

    fireEvent.change(container.queryByTestId('address'), { target: { value: '11 Sub' } });
    expect(container.queryByTestId('address').value).toBe('11 Sub');

    fireEvent.change(container.queryByTestId('city'), { target: { value: 'woodlands' } });
    expect(container.queryByTestId('city').value).toBe('woodlands');

    fireEvent.change(container.queryByTestId('country'), { target: { value: 'zambia' } });
    expect(container.queryByTestId('country').value).toBe('zambia');

    fireEvent.change(container.queryByTestId('taxIdNo'), { target: { value: '432' } });
    expect(container.queryByTestId('taxIdNo').value).toBe('432');

    fireEvent.click(container.queryByTestId('email_click'));
    expect(container.queryAllByLabelText('common:form_fields.email')).toHaveLength(3);

    fireEvent.click(container.queryByTestId('whatsapp_click'));
    expect(container.queryAllByLabelText('WhatsApp')).toHaveLength(2);

    fireEvent.click(container.queryByTestId('social_link_click'));
    expect(container.queryAllByLabelText('common:form_fields.social_link')).toHaveLength(2);

    fireEvent.click(container.queryByTestId('menu_item_click'));
    expect(container.queryAllByLabelText('common:form_fields.link')).toHaveLength(2);

    fireEvent.change(container.queryByTestId('logo_url'), {
      target: { value: 'https://something.com' }
    });
    expect(container.queryByTestId('logo_url').value).toBe('https://something.com');

    const file = new Blob(['some text'], { type: 'image/png' });
    fireEvent.change(container.queryByTestId('logo-input'), { target: { files: [file] } });

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

    fireEvent.change(container.queryByTestId('emergencyCallNumber'), {
      target: { value: '+94848584844' }
    });
    expect(container.queryByTestId('emergencyCallNumber').value).toBe('+94848584844');

    fireEvent.change(container.queryByTestId('google_analytics_id'), {
      target: { value: 'G-AIJDIWWI' }
    });
    expect(container.queryByTestId('google_analytics_id').value).toBe('G-AIJDIWWI');

    await waitFor(() => {
      expect(refetchMock).toBeCalled();
      expect(container.queryByText('community.community_updated')).toBeInTheDocument();
    }, 10);
  });
});
