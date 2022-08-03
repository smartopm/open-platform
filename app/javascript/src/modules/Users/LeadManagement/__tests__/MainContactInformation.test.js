import React from 'react';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MainContactInformation from '../Components/MainContactInformation';

describe('LeadManagementDetails Page', () => {
  const data = {
    user: {
      africanPresence: 'Everywhere',
      avatarUrl:
        'https://daniel.dgdp.site/rails/active_storage/blobs/redirect/eyRsa0xU-unsplash.jpg',
      clientCategory: 'industryAssociation',
      companyAnnualRevenue: '$112234442',
      companyContacted: '30',
      companyDescription: 'Real estate company',
      companyEmployees: '50000',
      companyLinkedin: 'blah',
      companyName: 'Tatu City',
      companyWebsite: 'www.westernseedcompany.com',
      country: 'bhutan',
      createdBy: 'Daniel Mutuba',
      email: 'daniel@doublegdp.com',
      firstContactDate: '2022-02-26T08:48:00Z',
      followupAt: '2022-02-09T21:00:00Z',
      id: 'c96f64bb-e3b4-42ff-b6a9-66889ec79e99',
      industry: 'consumerProducts',
      industryBusinessActivity: 'manufacturing',
      industrySubSector: 'businessSupportServices',
      lastContactDate: '2022-02-25T08:48:00Z',
      leadOwner: 'Daniel Mutuba',
      leadSource: 'inboundInquiry',
      leadStatus: 'investimentMotiveVerified',
      leadTemperature: 'neutral',
      leadType: 'investmentFund',
      levelOfInternationalization: 'exportingToNigeria',
      linkedinUrl: 'https://www.linkedin.com/in/daniel-mutuba-31748190/',
      modifiedBy: 'Daniel Mutuba',
      name: 'Daniel Mutuba',
      nextSteps: 'Move to South America',
      phoneNumber: '10234567876',
      region: 'cWOfIndStates',
      relevantLink: 'today is hot',
      roleName: 'Admin',
      secondaryEmail: '',
      secondaryPhoneNumber: '',
      title: 'The Big Boss',
      primaryEmail: '',
      primaryPhoneNumber: ''
    }
  };

  const handleChange = jest.fn()
  it('LeadManagementDetails component', async () => {
    render(<MainContactInformation leadFormData={data} handleChange={handleChange} disabled />);

    expect(screen.queryByTestId('lead-management-main-contact-section')).toBeInTheDocument();
    expect(screen.queryByTestId('contact_info')).toBeInTheDocument();
    expect(screen.queryByText('lead_management.primary_info')).toBeInTheDocument();
    expect(screen.queryByTestId('lead_management_button')).toBeInTheDocument();
    expect(screen.queryByTestId('lead_management_button')).toBeDisabled();
    expect(screen.queryByText('lead_management.save_updates')).toBeInTheDocument();
    expect(screen.queryByText('lead_management.name')).toBeInTheDocument();

    expect(screen.queryAllByText('lead_management.title')[0]).toBeInTheDocument();
    expect(screen.queryAllByText('lead_management.primary_email')[0]).toBeInTheDocument();
    expect(screen.queryAllByText('lead_management.secondary_email')[0]).toBeInTheDocument();
    expect(screen.queryAllByText('form_fields.phone_number')[0]).toBeInTheDocument();
    expect(screen.queryAllByText('lead_management.secondary_phone')[0]).toBeInTheDocument();
    expect(screen.queryByLabelText('linkedin')).toBeInTheDocument();

    const titleField = screen.queryByTestId('main-section-title-input');
    fireEvent.change(titleField, { target: { value: 'The New Updated Boss' } });
    expect(handleChange).toBeCalled();

    // simulate input
    await waitFor(
      () => {
        const button = screen.queryByTestId('main-section-title-input');
        expect(button).toBeEnabled();
      },
      { timeout: 50 }
    );
  });
});
