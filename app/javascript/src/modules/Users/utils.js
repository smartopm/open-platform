/* eslint-disable max-lines */
/* eslint-disable complexity */
/* eslint-disable max-params */
import PropTypes from 'prop-types';
import {
  clientCategories,
  leadTemperatureOptions,
  leadStatusOptions,
  leadSourceOptions,
  leadTypeOptions,
  internationalizationLevels,
  industrySubSectorOptions,
  industryCategoryOptions,
  industryBusinessActivityOptions,
  regionOptions,
  countries
} from '../../utils/constants';

export const initialLeadFormData = {
  user: {
    roleName: '',
    companyName: '',
    phoneNumber: '',
    email: '',
    country: '',
    region: '',
    companyDescription: '',
    companyLinkedin: '',
    companyWebsite: '',
    relevantLink: '',
    companyEmployees: '',
    companyAnnualRevenue: '',
    industry: '',
    industryBusinessActivity: '',
    levelOfInternationalization: '',
    leadTemperature: '',
    leadStatus: '',
    leadSource: '',
    companyContacted: '',
    clientCategory: '',
    leadType: '',
    leadOwner: '',
    modifiedBy: '',
    createdBy: '',
    nextSteps: '',
    firstContactDate: new Date(),
    lastContactDate: new Date(),
    followupAt: new Date(),
    contactInfos: [
      {
        id: '',
        info: '',
        contactType: ''
      }
    ],
    industrySubSector: '',
    africanPresence: '',

    // Contact information to help pick values from form
    name: '',
    title: '',
    primaryEmail: '',
    secondaryEmail: '',
    primaryPhoneNumber: '',
    secondaryPhoneNumber: '',
    linkedinUrl: '',

    // contact details object for easier update
    contactDetails: {
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

export const userProps = PropTypes.shape({
  roleName: PropTypes.string,
  companyName: PropTypes.string,
  phoneNumber: PropTypes.string,
  email: PropTypes.string,
  country: PropTypes.string,
  region: PropTypes.string,
  companyDescription: PropTypes.string,
  companyLinkedin: PropTypes.string,
  companyWebsite: PropTypes.string,
  relevantLink: PropTypes.string,
  companyEmployees: PropTypes.string,
  companyAnnualRevenue: PropTypes.string,
  industry: PropTypes.string,
  industryBusinessActivity: PropTypes.string,
  levelOfInternationalization: PropTypes.string,
  leadTemperature: PropTypes.string,
  leadStatus: PropTypes.string,
  leadSource: PropTypes.string,
  companyContacted: PropTypes.string,
  clientCategory: PropTypes.string,
  leadType: PropTypes.string,
  leadOwner: PropTypes.string,
  modifiedBy: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  createdBy: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  nextSteps: PropTypes.string,
  firstContactDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  lastContactDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  followupAt: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  industrySubSector: PropTypes.string,
  africanPresence: PropTypes.string,
  name: PropTypes.string,
  title: PropTypes.string,
  primaryEmail: PropTypes.string,
  secondaryEmail: PropTypes.string,
  primaryPhoneNumber: PropTypes.string,
  secondaryPhoneNumber: PropTypes.string,
  linkedinUrl: PropTypes.string
}).isRequired;

export const secondaryInfoUserObject = PropTypes.shape({
  ...userProps,
  contactDetails: PropTypes.shape({
    primaryContact: PropTypes.shape({
      name: PropTypes.string,
      title: PropTypes.string,
      primaryEmail: PropTypes.string,
      secondaryEmail: PropTypes.string,
      primaryPhoneNumber: PropTypes.string,
      secondaryPhoneNumber: PropTypes.string,
      linkedinUrl: PropTypes.string
    }),
    secondaryContact1: PropTypes.shape({
      name: PropTypes.string,
      title: PropTypes.string,
      primaryEmail: PropTypes.string,
      secondaryEmail: PropTypes.string,
      primaryPhoneNumber: PropTypes.string,
      secondaryPhoneNumber: PropTypes.string,
      linkedinUrl: PropTypes.string
    }),
    secondaryContact2: PropTypes.shape({
      name: PropTypes.string,
      title: PropTypes.string,
      primaryEmail: PropTypes.string,
      secondaryEmail: PropTypes.string,
      primaryPhoneNumber: PropTypes.string,
      secondaryPhoneNumber: PropTypes.string,
      linkedinUrl: PropTypes.string
    })
  })
}).isRequired;

const ITEM_HEIGHT = 50;
const ITEM_PADDING_TOP = 8;
export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    }
  }
};

export const selectOptions = [
  {
    menu: {
      user_settings: 'User Settings'
    },
    subMenu: {
      edit_user: 'Edit User',
      invite_history: 'Invite History',
      print_id: 'Print ID'
    }
  },
  {
    menu: {
      communications: 'Communications'
    },
    subMenu: {
      communications: 'Communications',
      send_sms: 'Send SMS',
      send_otp: 'Send OTP',
      message_support: 'Message Support'
    }
  },
  {
    menu: {
      payments: 'Payments'
    }
  },
  {
    menu: {
      plots: 'Plots'
    }
  },
  {
    menu: {
      notes: 'Notes'
    }
  },
  {
    menu: {
      lead_management: 'Lead Management'
    }
  },
  {
    menu: {
      user_logs: 'User Logs'
    }
  },
  {
    menu: {
      merge_user: 'Merge User'
    }
  }
];
const ordinalSuffix = ['st', 'nd', 'rd'];
const addSuffix = n => n + (ordinalSuffix[(n - 1) % 10] || 'th');
const numberToOrdinal = n => (`${n}`.match(/1\d$/) ? `n + th` : addSuffix(n));

const requiredError = (headerName, rowNumber, columnNumber) => {
  return ` <div>${headerName} is required in the ${numberToOrdinal(
    rowNumber
  )} row ${numberToOrdinal(columnNumber)} column.  </div>`;
};

const validateError = (headerName, rowNumber, columnNumber) => {
  return ` <div> ${headerName} is not valid in the ${numberToOrdinal(rowNumber)} ${numberToOrdinal(
    columnNumber
  )} column.  </div>`;
};

const uniqueError = headerName => {
  return ` <div>${headerName} is not unique.  </div>`;
};

const configObject = {
  headers: [
    {
      name: 'Name',
      inputName: 'firstName',
      required: true,
      requiredError,
      uniqueError,
      validateError
    },

    {
      name: 'Title',
      inputName: 'title',
      validateError
    },
    {
      name: 'Email',
      inputName: 'email',
      uniqueError,
      validateError
    },
    {
      name: 'Secondary Email',
      inputName: 'secondaryEmail',
      validateError
    },
    {
      name: 'Primary Phone',
      inputName: 'primaryPhone',
      validateError
    },
    {
      name: 'Secondary Phone',
      inputName: 'secondaryPhone',
      validateError
    },
    {
      name: 'LinkedIn',
      inputName: 'linkedIn',
      validateError
    },
    {
      name: 'Contact 1 Name',
      inputName: 'contact1Name',
      validateError
    },
    {
      name: 'Contact 1 Title',
      inputName: 'contact1Title',
      validateError
    },
    {
      name: 'Contact 1 Primary Email',
      inputName: 'contact1PrimaryEmail',
      validateError
    },
    {
      name: 'Contact 1 Secondary Email',
      inputName: 'contact1SecondaryEmail',
      validateError
    },
    {
      name: 'Contact 1 Primary Phone',
      inputName: 'contact1PrimaryPhone',
      validateError
    },
    {
      name: 'Contact 1 Secondary Phone',
      inputName: 'contact1SecondaryPhone',
      validateError
    },

    {
      name: 'Contact 1 LinkedIn',
      inputName: 'contact1LinkedIn',
      validateError
    },

    {
      name: 'Contact 2 Name',
      inputName: 'contact2Name',
      validateError
    },
    {
      name: 'Contact 2 Title',
      inputName: 'contact2Title',
      validateError
    },
    {
      name: 'Contact 2 Primary Email',
      inputName: 'contact2PrimaryEmail',
      validateError
    },
    {
      name: 'Contact 2 Secondary Email',
      inputName: 'contact2SecondaryEmail',
      validateError
    },
    {
      name: 'Contact 2 Primary Phone',
      inputName: 'contact2PrimaryPhone',
      validateError
    },
    {
      name: 'Contact 2 Secondary Phone',
      inputName: 'contact2SecondaryPhone',
      validateError
    },
    {
      name: 'Contact 2 LinkedIn',
      inputName: 'contact2LinkedIn',
      validateError
    },
    {
      name: 'Company Name',
      inputName: 'companyName',
      validateError
    },
    {
      name: 'Company Description',
      inputName: 'companyDescription',
      validateError
    },
    {
      name: 'Company LinkedIn',
      inputName: 'companyLinkedIn',
      validateError
    },

    {
      name: 'Company Website',
      inputName: 'companyWebsite',
      validateError
    },
    {
      name: 'Relevant Links',
      inputName: 'relevantLinks',
      validateError
    },
    {
      name: 'Country',
      inputName: 'country',
      validate: country => {
        return countries.includes(country);
      },
      validateError: (headerName, rowNumber, columnNumber) => {
        return ` <div>${headerName} is not valid in the ${numberToOrdinal(
          rowNumber
        )} row ${numberToOrdinal(columnNumber)} column.  </div>`;
      }
    },
    {
      name: 'Region',
      inputName: 'region',
      validate: region => {
        return regionOptions.includes(region);
      },
      validateError: (headerName, rowNumber, columnNumber) => {
        return `<div> ${headerName} is not valid in the ${numberToOrdinal(
          rowNumber
        )} row ${numberToOrdinal(columnNumber)} column.  </div>`;
      }
    },
    {
      name: 'Industry Sector',
      inputName: 'industrySector',
      validate: industrySector => {
        return industryCategoryOptions.includes(industrySector);
      },
      validateError: (headerName, rowNumber, columnNumber) => {
        return `<div> ${headerName} is not valid in the ${numberToOrdinal(
          rowNumber
        )} row ${numberToOrdinal(columnNumber)} column.  </div>`;
      }
    },
    {
      name: 'Industry Sub Sector',
      inputName: 'industrySubSector',
      validate: industrySubSector => {
        return industrySubSectorOptions.includes(industrySubSector);
      },
      validateError: (headerName, rowNumber, columnNumber) => {
        return `<div> ${headerName} is not valid in the ${numberToOrdinal(
          rowNumber
        )} row ${numberToOrdinal(columnNumber)} column. </div>`;
      }
    },
    {
      name: 'Industry Business Activity',
      inputName: 'industryBusinessActivity',
      validate: industryBusinessActivity => {
        return industryBusinessActivityOptions.includes(industryBusinessActivity);
      },
      validateError: (headerName, rowNumber, columnNumber) => {
        return `<div> ${headerName} is not valid in the ${numberToOrdinal(
          rowNumber
        )} row ${numberToOrdinal(columnNumber)} column.  </div>`;
      }
    },
    {
      name: 'Level of internationalization',
      inputName: 'levelOfInternationalization',
      validate: levelOfInternationalization => {
        return internationalizationLevels.includes(levelOfInternationalization);
      },
      validateError: (headerName, rowNumber, columnNumber) => {
        return `<div> ${headerName} is not valid in the ${numberToOrdinal(
          rowNumber
        )} row ${numberToOrdinal(columnNumber)} column.  </div>`;
      }
    },
    {
      name: 'Number of Employees',
      inputName: 'NumberOfEmployees',
      validateError
    },
    {
      name: 'Annual Revenue',
      inputName: 'annualRevenue',
      validateError
    },
    {
      name: 'African Presences',
      inputName: 'AafricanPresences',
      validateError
    },

    {
      name: 'Lead Temperature',
      inputName: 'leadTemperature',
      validate: leadTemperature => {
        return leadTemperatureOptions.includes(leadTemperature);
      },
      validateError: (headerName, rowNumber, columnNumber) => {
        return `<div> ${headerName} is not valid in the ${numberToOrdinal(
          rowNumber
        )} row  ${numberToOrdinal(columnNumber)} column.  </div>`;
      }
    },
    {
      name: 'Lead Status',
      inputName: 'leadStatus',
      validate: leadStatus => {
        return leadStatusOptions.includes(leadStatus);
      },
      validateError: (headerName, rowNumber, columnNumber) => {
        return `<div> ${headerName} is not valid in the ${numberToOrdinal(
          rowNumber
        )} row ${numberToOrdinal(columnNumber)} column.  </div>`;
      }
    },

    {
      name: 'Lead Type',
      inputName: 'leadType',
      validate: leadType => {
        return leadTypeOptions.includes(leadType);
      },
      validateError: (headerName, rowNumber, columnNumber) => {
        return `<div> ${headerName} is not valid in the ${numberToOrdinal(
          rowNumber
        )} row / ${numberToOrdinal(columnNumber)} column.  </div>`;
      }
    },

    {
      name: 'Lead Source',
      inputName: 'leadSource',
      validate: leadSource => {
        return leadSourceOptions.includes(leadSource);
      },
      validateError: (headerName, rowNumber, columnNumber) => {
        return `<div>${headerName} is not valid in the ${numberToOrdinal(
          rowNumber
        )} row ${numberToOrdinal(columnNumber)} column. </div>`;
      }
    },
    {
      name: 'Client Category',
      inputName: 'clientCategory',
      validate: clientCategory => {
        return clientCategories.includes(clientCategory);
      },
      validateError: (headerName, rowNumber, columnNumber) => {
        return `<div> ${headerName} is not valid in the ${numberToOrdinal(
          rowNumber
        )} row ${numberToOrdinal(columnNumber)} column.  </div>`;
      }
    },
    {
      name: 'Company Contacted',
      inputName: 'companyContacted',
      validateError
    },

    {
      name: 'Next Steps',
      inputName: 'nextSteps',
      validateError
    },

    {
      name: 'Lead Owner',
      inputName: 'leadOwner',
      validateError
    },
    {
      name: 'Created By',
      inputName: 'createdBy',
      validateError
    },
    {
      name: 'Modified By',
      inputName: 'modifiedBy',
      validateError
    },

    {
      name: 'First Contact Date',
      inputName: 'firstContactDate',
      validateError
    },

    {
      name: 'Last Contact Date',
      inputName: 'lastContactDate',
      validateError
    },
    {
      name: 'Date Follow Up',
      inputName: 'dateFollowUp',
      validateError
    }
  ]
};

export default configObject;
export function selectOptions(
  setSelectKey,
  checkModule,
  checkCommunityFeatures,
  history,
  data,
  handleMenuItemClick,
  handleMergeUserItemClick,
  checkRole
) {
  return [
    {
      key: 'user_settings',
      value: 'User Settings',
      handleMenuItemClick: key => setSelectKey(key),
      show: checkCommunityFeatures('Users') && checkModule('user'),
      subMenu: [
        {
          key: 'edit_user',
          value: 'Edit User',
          handleMenuItemClick: () => history.push(`/user/${data.user.id}/edit`),
          show: checkCommunityFeatures('Users') && checkModule('user')
        },
        {
          key: 'print_id',
          value: 'Print ID',
          handleMenuItemClick: () => history.push(`/print/${data.user.id}`),
          show: checkCommunityFeatures('Users') && checkModule('user')
        }
      ]
    },
    {
      key: 'communication',
      value: 'Communications',
      handleMenuItemClick: key => setSelectKey(key),
      show: true,
      subMenu: [
        {
          key: 'communications',
          value: 'Communication',
          handleMenuItemClick,
          show: checkCommunityFeatures('Messages') && checkModule('communication')
        },
        {
          key: 'send_sms',
          value: 'Send SMS',
          handleMenuItemClick: () => history.push(`/message/${data.user.id}`),
          show: checkCommunityFeatures('Messages') && checkRole(['admin'], 'Messages')
        },
        {
          key: 'send_otp',
          value: 'Send OTP',
          handleMenuItemClick: () => history.push(`/user/${data.user.id}/otp`),
          show: checkCommunityFeatures('Messages') && checkModule('user')
        },
        {
          key: 'message_support',
          value: 'Message Support',
          handleMenuItemClick: () => history.push(`/message/${data.user.id}`),
          show: checkCommunityFeatures('Messages')
        }
      ]
    },
    {
      key: 'payments',
      value: 'Plans',
      handleMenuItemClick,
      show: checkCommunityFeatures('Payments') && checkRole(['admin', 'client', 'resident'], 'Payments')
    },
    {
      key: 'plots',
      value: 'Plots',
      handleMenuItemClick,
      show: checkCommunityFeatures('Properties') && checkRole(['admin', 'client', 'resident'], 'Properties')
    },
    {
      key: 'lead_management',
      value: 'LeadManagement',
      handleMenuItemClick,
      show: checkCommunityFeatures('Users') && checkModule('user')
    },
    {
      key: 'forms',
      value: 'Forms',
      handleMenuItemClick,
      show: checkCommunityFeatures('Forms') && checkModule('forms') 
    },
    {
      key: 'customer_journey',
      value: 'CustomerJourney',
      handleMenuItemClick,
      show: checkCommunityFeatures('Customer Journey') && checkRole(['admin'], 'Customer Journey')
    },
    {
      key: 'user_logs',
      value: 'User Logs',
      handleMenuItemClick: () => history.push(`/user/${data.user.id}/logs`),
      show: checkCommunityFeatures('LogBook') && checkModule('entry_request')
    },
    {
      key: 'merge_user',
      value: 'Merge User',
      handleMenuItemClick: () => handleMergeUserItemClick(),
      show: checkCommunityFeatures('Users') && checkModule('user')
    }
  ];
}

export function createMenuContext(type, data, userType, authState){
  if(['LogBook', 'Users', 'Properties'].includes(type)){
    return {
      userId: data.user.id,
      userType,
      loggedInUserId: authState.user.id,
    }
  }

  // context for Payments & Payment Plans
  if(['Payments'].includes(type)){
    return {
      userType,
      paymentCheck: true,
      loggedInUserPaymentPlan: authState.user?.paymentPlan,
    }
  }

  return undefined;
}
