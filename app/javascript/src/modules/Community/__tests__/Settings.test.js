/* eslint-disable max-lines */
/* eslint-disable max-statements */
import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';

import CommunitySettings from '../components/Settings';
import { CommunityUpdateMutation } from '../graphql/community_mutations';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import { EmailTemplatesQuery } from '../../Emails/graphql/email_queries';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
// TODO(Nurudeen): Check why this requires more time
jest.setTimeout(15000);
describe('Community settings page', () => {
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
        menuItems: [
          {
            menu_link: 'http://some-link.com',
            menu_name: 'Custom Menu',
            display_on: ['Menu'],
            roles: ['admin']
          },
          { menu_link: '', menu_name: '', display_on: ['Dashboard'], roles: [] }
        ],
        leadMonthlyTargets: [{ division: 'China', target: '20' }],
        imageBlobId: null,
        templates: {
          payment_reminder_template_behind: '501b718c-8687-4e78-60b732df534ab1',
          payment_reminder_template_upcoming: '501b718c-8687-4e78-60b732df534ab1'
        },
        gaId: '',
        currency: 'zambian_kwacha',
        locale: 'en-US',
        tagline: 'This is our tagline',
        logoUrl: 'https://something.com',
        wpLink: 'https://wordpress.com',
        securityManager: '',
        subAdministratorId: '',
        themeColors: { primaryColor: '#69ABA4', secondaryColor: '#cf5628' },
        bankingDetails: {
          bankName: 'UBA',
          accountName: 'Thebe',
          accountNo: '1234',
          branch: 'LU',
          swiftCode: 'xyz',
          sortCode: '067',
          address: '11 Sub',
          city: 'woodlands',
          country: 'zambia',
          taxIdNo: '432'
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

  it('renders the necessary fields', async () => {
    render(
      <MockedProvider mocks={[communityMutationMock, templateMock]} addTypename={false}>
        <MockedThemeProvider>
          <CommunitySettings data={data} token="374857uwehfsdf232" refetch={refetchMock} />
        </MockedThemeProvider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('community.community_logo')).toBeInTheDocument();
      expect(screen.queryByText('community.change_community_logo')).toBeInTheDocument();
      expect(screen.queryByText('community.upload_logo')).toBeInTheDocument();
      expect(screen.queryByText('community.support_contact')).toBeInTheDocument();
      expect(screen.queryByText('community.make_changes_support_contact')).toBeInTheDocument();
      expect(screen.queryByText('common:form_fields.add_phone_number')).toBeInTheDocument();
      expect(screen.queryByText('common:form_fields.add_email_address')).toBeInTheDocument();
      expect(screen.queryByText('common:form_fields.add_whatsapp_number')).toBeInTheDocument();
      expect(screen.queryByText('common:form_fields.add_social_link')).toBeInTheDocument();
      expect(screen.queryByText('common:form_fields.add_menu_item')).toBeInTheDocument();
      expect(screen.queryByText('common:form_fields.add_division')).toBeInTheDocument();
      expect(screen.queryByText('community.update_community')).toBeInTheDocument();
      expect(screen.queryByText('community.update_community')).not.toBeDisabled();
      expect(screen.queryAllByLabelText('common:form_fields.email')).toHaveLength(2);
      expect(screen.queryByLabelText('common:form_fields.phone_number')).toBeInTheDocument();
      expect(screen.queryByLabelText('WhatsApp')).toBeInTheDocument();
      expect(screen.queryAllByText('community.sms_phone_numbers')[0]).not.toBeDisabled();
      expect(screen.queryAllByText('community.emergency_call_number')[0]).not.toBeDisabled();
      expect(screen.queryByText('community.sms_phone_numbers_header')).toBeInTheDocument();
      expect(screen.queryAllByText('community.google_analytics_id')[0]).toBeInTheDocument();
      expect(screen.queryByTestId('locale')).toBeInTheDocument();
      expect(screen.queryByTestId('currency')).toBeInTheDocument();
      expect(screen.queryByTestId('accountName')).toBeInTheDocument();
      expect(screen.queryByTestId('accountNo')).toBeInTheDocument();
      expect(screen.queryByTestId('bankName')).toBeInTheDocument();
      expect(screen.queryByTestId('branch')).toBeInTheDocument();
      expect(screen.queryByTestId('swiftCode')).toBeInTheDocument();
      expect(screen.queryByTestId('sortCode')).toBeInTheDocument();
      expect(screen.queryByTestId('address')).toBeInTheDocument();
      expect(screen.queryByTestId('city')).toBeInTheDocument();
      expect(screen.queryByTestId('country')).toBeInTheDocument();
      expect(screen.queryByTestId('taxIdNo')).toBeInTheDocument();
      expect(screen.queryByTestId('smsPhoneNumber')).toBeInTheDocument();
      expect(screen.queryByTestId('emergencyCallNumber')).toBeInTheDocument();
      expect(screen.queryByTestId('plan_status_behind')).toBeInTheDocument();
      expect(screen.queryByTestId('plan_status_upcoming')).toBeInTheDocument();
      expect(screen.queryByTestId('disable_deny_gate_access')).toBeInTheDocument();
      expect(screen.queryByTestId('enable_automated_task_reminders')).toBeInTheDocument();
    });
  });

  it('sets notification reminder templates', async () => {
    render(
      <MockedProvider mocks={[communityMutationMock, templateMock]} addTypename={false}>
        <MockedThemeProvider>
          <CommunitySettings data={data} token="374857uwehfsdf232" refetch={refetchMock} />
        </MockedThemeProvider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('payment_reminder_template_behind')).toBeInTheDocument();
      expect(screen.queryByTestId('payment_reminder_template_upcoming')).toBeInTheDocument();

      // Idea from https://stackoverflow.com/a/61491607/6139537
      const selectTemplateDiv = screen.getAllByRole('button', {
        name: 'community.select_template ​'
      });
      fireEvent.mouseDown(selectTemplateDiv[0]);
      const listboxBehind = within(screen.getByRole('listbox'));
      fireEvent.click(listboxBehind.getByText('payment_reminder_template'));
      expect(screen.getByTestId('payment_reminder_template_behind')).toHaveTextContent(
        'payment_reminder_template'
      );

      fireEvent.mouseDown(selectTemplateDiv[1]);
      const listboxUpcoming = within(screen.getByRole('listbox'));
      fireEvent.click(listboxUpcoming.getByText('payment_reminder_template'));
      expect(screen.getByTestId('payment_reminder_template_upcoming')).toHaveTextContent(
        'payment_reminder_template'
      );
    });
  });

  // TODO: Simplify this test further, it takes long to run
  it('updates community settings successfully', async () => {
    const updateMock = {
      ...communityMutationMock,
      request: {
        ...communityMutationMock.request,
        variables: {
          ...communityMutationMock.request.variables,
          templates: {}
        }
      }
    };

    render(
      <MockedProvider mocks={[updateMock, templateMock]} addTypename={false}>
        <MockedThemeProvider>
          <CommunitySettings data={data} token="374857uwehfsdf232" refetch={refetchMock} />
        </MockedThemeProvider>
      </MockedProvider>
    );

    expect(screen.queryAllByLabelText('remove')).toHaveLength(6);

    fireEvent.click(screen.queryAllByTestId('add_number')[0]);
    expect(screen.queryAllByLabelText('remove')).toHaveLength(7)

    fireEvent.click(screen.queryAllByLabelText('remove')[0]);
    expect(screen.queryAllByLabelText('remove')).toHaveLength(6)

    fireEvent.change(screen.queryByTestId('locale'), { target: { value: 'en-US' } });
    expect(screen.queryByTestId('locale').value).toBe('en-US');

    fireEvent.change(screen.queryByTestId('currency'), { target: { value: 'zambian_kwacha' } });
    expect(screen.queryByTestId('currency').value).toBe('zambian_kwacha');

    fireEvent.change(screen.queryByTestId('accountName'), { target: { value: 'Thebe' } });
    expect(screen.queryByTestId('accountName').value).toBe('Thebe');

    fireEvent.change(screen.queryByTestId('accountNo'), { target: { value: '1234' } });
    expect(screen.queryByTestId('accountNo').value).toBe('1234');

    fireEvent.change(screen.queryByTestId('bankName'), { target: { value: 'UBA' } });
    expect(screen.queryByTestId('bankName').value).toBe('UBA');

    fireEvent.change(screen.queryByTestId('branch'), { target: { value: 'LU' } });
    expect(screen.queryByTestId('branch').value).toBe('LU');

    fireEvent.change(screen.queryByTestId('swiftCode'), { target: { value: 'xyz' } });
    expect(screen.queryByTestId('swiftCode').value).toBe('xyz');

    fireEvent.change(screen.queryByTestId('sortCode'), { target: { value: '067' } });
    expect(screen.queryByTestId('sortCode').value).toBe('067');

    fireEvent.change(screen.queryByTestId('address'), { target: { value: '11 Sub' } });
    expect(screen.queryByTestId('address').value).toBe('11 Sub');

    fireEvent.change(screen.queryByTestId('city'), { target: { value: 'woodlands' } });
    expect(screen.queryByTestId('city').value).toBe('woodlands');

    fireEvent.change(screen.queryByTestId('country'), { target: { value: 'zambia' } });
    expect(screen.queryByTestId('country').value).toBe('zambia');

    fireEvent.change(screen.queryByTestId('taxIdNo'), { target: { value: '432' } });
    expect(screen.queryByTestId('taxIdNo').value).toBe('432');

    fireEvent.click(screen.queryByTestId('email_click'));
    expect(screen.queryAllByLabelText('common:form_fields.email')).toHaveLength(3);

    fireEvent.click(screen.queryByTestId('whatsapp_click'));
    expect(screen.queryAllByLabelText('WhatsApp')).toHaveLength(2);

    fireEvent.click(screen.queryByTestId('social_link_click'));
    expect(screen.queryAllByLabelText('common:form_fields.social_link')).toHaveLength(2);

    fireEvent.click(screen.queryByTestId('menu_item_click'));
    expect(screen.queryAllByLabelText('common:form_fields.link')).toHaveLength(2);

    fireEvent.change(screen.queryByTestId('logo_url'), {
      target: { value: 'https://something.com' }
    });
    expect(screen.queryByTestId('logo_url').value).toBe('https://something.com');

    const file = new Blob(['some text'], { type: 'image/png' });
    fireEvent.change(screen.queryByTestId('logo-input'), { target: { files: [file] } });

    fireEvent.change(screen.queryByTestId('tagline'), {
      target: { value: 'This is our tagline' }
    });
    expect(screen.queryByTestId('tagline').value).toBe('This is our tagline');

    fireEvent.change(screen.queryByTestId('wp_link'), {
      target: { value: 'https://wordpress.com' }
    });
    expect(screen.queryByTestId('wp_link').value).toBe('https://wordpress.com');

    // fire the mutation update_community
    expect(screen.queryByTestId('update_community')).not.toBeDisabled();

    fireEvent.click(screen.queryByTestId('update_community'));

    expect(screen.queryByTestId('update_community')).toBeDisabled();

    fireEvent.change(screen.queryByTestId('emergencyCallNumber'), {
      target: { value: '+94848584844' }
    });
    expect(screen.queryByTestId('emergencyCallNumber').value).toBe('+94848584844');

    fireEvent.change(screen.queryByTestId('google_analytics_id'), {
      target: { value: 'G-AIJDIWWI' }
    });
    expect(screen.queryByTestId('google_analytics_id').value).toBe('G-AIJDIWWI');

    await waitFor(() => {
      expect(refetchMock).toBeCalled();
      expect(screen.queryByText('community.community_updated')).toBeInTheDocument();
    });
  });
});
