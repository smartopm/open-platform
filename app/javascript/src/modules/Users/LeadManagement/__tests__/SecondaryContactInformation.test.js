import React from 'react';

import { render, screen } from '@testing-library/react';
import SecondaryCcntactInformation from '../Components/SecondaryContactInformation';

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
      contactDetails: {
        primaryContact: {
          name: '',
          title: '',
          primaryEmail: '',
          secondaryEmail: '',
          primaryPhoneNumber: '',
          secondaryPhoneNumber: '',
          linkedinUrl: ''
        },
        secondaryContact1: {
          name: '',
          title: '',
          primaryEmail: '',
          secondaryEmail: '',
          primaryPhoneNumber: '',
          secondaryPhoneNumber: '',
          linkedinUrl: ''
        },
        secondaryContact2: {
          name: '',
          title: '',
          primaryEmail: '',
          secondaryEmail: '',
          primaryPhoneNumber: '',
          secondaryPhoneNumber: '',
          linkedinUrl: ''
        }
      }
    }
  };

  it('LeadManagementDetails component', () => {
    const onChange = jest.fn();
    render(
      <SecondaryCcntactInformation
        leadFormData={data}
        handleSecondaryContact1Change={onChange}
        handleSecondaryContact2Change={onChange}
      />
    );

    expect(
      screen.queryByTestId('lead-management-secondary-info-section-header')
    ).toBeInTheDocument();
    expect(
      screen.queryByText('lead_management.secondary_contact_section1_header')
    ).toBeInTheDocument();
    expect(
      screen.queryByText('lead_management.secondary_contact_section2_header')
    ).toBeInTheDocument();
  });
});
