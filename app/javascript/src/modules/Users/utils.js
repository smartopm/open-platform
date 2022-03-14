/* eslint-disable max-lines */
import CSVFileValidator from 'csv-file-validator';
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
    capexAmount: '',
    kickOffDate: new Date(),
    jobsCreated: ' ',
    jobsTimeline: ' ',
    investmentSize: ' ',
    investmentTimeline: ' ',
    decisionTimeline: ' ',

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
  capexAmount: PropTypes.string,
  jobsCreated: PropTypes.string,
  jobsTimeline: PropTypes.string,
  investmentSize: PropTypes.string,
  investmentTimeline: PropTypes.string,
  decisionTimeline: PropTypes.string,
  modifiedBy: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  createdBy: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  nextSteps: PropTypes.string,
  firstContactDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  lastContactDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  followupAt: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  kickOffDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
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
const ordinalSuffix = ['st', 'nd', 'rd'];
const addSuffix = n => n + (ordinalSuffix[(n - 1) % 10] || 'th');
const numberToOrdinal = n => (`${n}`.match(/1\d$/) ? `n + th` : addSuffix(n));

const requiredError = (headerName, rowNumber, columnNumber) => {
  return ` <div>${headerName} is required in the ${numberToOrdinal(
    rowNumber
  )} row ${numberToOrdinal(columnNumber)} column. </div>`;
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
      unique: true, // ensures column values are unique
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
        if (!country) {
          return true;
        }
        return countries.includes(country.replace(/^\s+|\s+$/gm, ''));
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
        if (!region) {
          return true;
        }
        return regionOptions.includes(region.replace(/^\s+|\s+$/gm, ''));
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
        if (!industrySector) {
          return true;
        }
        return industryCategoryOptions.includes(industrySector.replace(/^\s+|\s+$/gm, ''));
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
        if (!industrySubSector) {
          return true;
        }
        return industrySubSectorOptions.includes(industrySubSector.replace(/^\s+|\s+$/gm, ''));
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
        if (!industryBusinessActivity) {
          return true;
        }
        return industryBusinessActivityOptions.includes(
          industryBusinessActivity.replace(/^\s+|\s+$/gm, '')
        );
      },
      validateError: (headerName, rowNumber, columnNumber) => {
        return `<div> ${headerName} is not valid in the ${numberToOrdinal(
          rowNumber
        )} row ${numberToOrdinal(columnNumber)} column.  </div>`;
      }
    },
    {
      name: 'Level of Internationalization',
      inputName: 'levelOfInternationalization',
      validate: levelOfInternationalization => {
        if (!levelOfInternationalization) {
          return true;
        }
        return internationalizationLevels.includes(
          levelOfInternationalization.replace(/^\s+|\s+$/gm, '')
        );
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
        if (!leadTemperature) {
          return true;
        }
        return leadTemperatureOptions.includes(leadTemperature.replace(/^\s+|\s+$/gm, ''));
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
        if (!leadStatus) {
          return true;
        }
        return leadStatusOptions.includes(leadStatus.replace(/^\s+|\s+$/gm, ''));
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
        if (!leadType) {
          return true;
        }
        return leadTypeOptions.includes(leadType.replace(/^\s+|\s+$/gm, ''));
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
        if (!leadSource) {
          return true;
        }
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
        if (!clientCategory) {
          return true;
        }
        return clientCategories.includes(clientCategory.replace(/^\s+|\s+$/gm, ''));
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
    },

    {
      name: 'Kick Off Date',
      inputName: 'kickOffDate',
      validateError
    },
    {
      name: 'Capex Amount',
      inputName: 'capexAmount',
      validateError
    },
    {
      name: 'Jobs',
      inputName: 'jobsCreated',
      validateError
    },
    {
      name: 'Jobs Timeline',
      inputName: 'jobsTimeline',
      validateError
    },
    {
      name: 'Investment Size',
      inputName: 'investmentSize',
      validateError
    },
    {
      name: 'Investment Timeline',
      inputName: 'investmentTimeline',
      validateError
    },
    {
      name: 'Decision Timeline',
      inputName: 'decisionTimeline',
      validateError
    }
  ]
};

export function selectOptions(
  setSelectKey,
  checkModule,
  checkCommunityFeatures,
  history,
  data,
  handleMenuItemClick,
  handleMergeUserItemClick,
  checkRole,
  t
) {
  return [
    {
      key: 'user_settings',
      value: 'User Settings',
      name: t('common:menu.user_settings'),
      handleMenuItemClick: key => setSelectKey(key),
      show: checkCommunityFeatures('Users') && checkModule('user'),
      subMenu: [
        {
          key: 'edit_user',
          value: 'Edit User',
          name: t('common:right_menu.edit_user'),
          handleMenuItemClick: () => history.push(`/user/${data.user.id}/edit`),
          show: checkCommunityFeatures('Users') && checkModule('user')
        },
        {
          key: 'print_id',
          value: 'Print ID',
          name: t('common:menu.print_id'),
          handleMenuItemClick: () => history.push(`/print/${data.user.id}`),
          show: checkCommunityFeatures('Users') && checkModule('user')
        },
        {
          key: 'merge_user',
          value: 'Merge User',
          name: t('common:menu.merge_user'),
          handleMenuItemClick: () => handleMergeUserItemClick(),
          show: checkCommunityFeatures('Users') && checkModule('user')
        },
        {
          key: 'user_logs',
          value: 'User Logs',
          name: t('common:menu.user_logs'),
          handleMenuItemClick: () => history.push(`/user/${data.user.id}/logs`),
          show: checkCommunityFeatures('LogBook') && checkModule('entry_request')
        }
      ]
    },
    {
      key: 'communication',
      value: 'Communications',
      name: t('common:misc.communication'),
      handleMenuItemClick: key => setSelectKey(key),
      show: true,
      subMenu: [
        {
          key: 'communications',
          value: 'Communication',
          name: t('common:right_menu.communications'),
          handleMenuItemClick,
          show: checkCommunityFeatures('Messages') && checkModule('communication')
        },
        {
          key: 'send_sms',
          value: 'Send SMS',
          name: t('common:menu.send_sms'),
          handleMenuItemClick: () => history.push(`/message/${data.user.id}`),
          show: checkCommunityFeatures('Messages') && checkRole(['admin'], 'Messages')
        },
        {
          key: 'send_otp',
          value: 'Send OTP',
          name: t('common:menu.send_otp'),
          handleMenuItemClick: () => history.push(`/user/${data.user.id}/otp`),
          show: checkCommunityFeatures('Messages') && checkModule('user')
        },
        {
          key: 'message_support',
          value: 'Message Support',
          name: t('common:menu.message_support'),
          handleMenuItemClick: () => history.push(`/message/${data.user.id}`),
          show: checkCommunityFeatures('Messages')
        }
      ]
    },
    {
      key: 'payments',
      value: 'Plans',
      name: t('common:misc.payments'),
      handleMenuItemClick,
      show:
        checkCommunityFeatures('Payments') && checkRole(['admin', 'client', 'resident'], 'Payments')
    },
    {
      key: 'plots',
      value: 'Plots',
      name: t('common:misc.plots'),
      handleMenuItemClick,
      show:
        checkCommunityFeatures('Properties') &&
        checkRole(['admin', 'client', 'resident'], 'Properties')
    },
    {
      key: 'lead_management',
      value: 'LeadManagement',
      name: t("common:misc.lead_details"),
      handleMenuItemClick,
      show: checkCommunityFeatures('Users') && checkModule('user')
    },
    {
      key: 'invitations',
      value: 'Invitations',
      name: t('common:menu.invitations'),
      handleMenuItemClick,
      show: checkCommunityFeatures('LogBook') && checkModule('entry_request')
    },
    {
      key: 'notes',
      value: 'Notes',
      name: t('common:misc.notes'),
      handleMenuItemClick,
      show: checkCommunityFeatures('Tasks') && checkModule('note')
    },
    {
      key: 'forms',
      value: 'Forms',
      name: t('common:misc.forms'),
      handleMenuItemClick,
      show: checkCommunityFeatures('Forms') && checkModule('forms')
    },
    {
      key: 'customer_journey',
      value: 'CustomerJourney',
      name: t('common:menu.customer_journey'),
      handleMenuItemClick,
      show: checkCommunityFeatures('Customer Journey') && checkRole(['admin'], 'Customer Journey')
    }
  ];
}

export function createMenuContext(type, data, userType, authState) {
  if (['LogBook', 'Users', 'Properties'].includes(type)) {
    return {
      userId: data.user.id,
      userType,
      loggedInUserId: authState.user.id
    };
  }

  if (['Payments'].includes(type)) {
    return {
      userType,
      paymentCheck: true,
      loggedInUserPaymentPlan: authState.user?.paymentPlan
    };
  }

  return undefined;
}

export const csvValidate = async file => {
  const csvErrors = await CSVFileValidator(file, configObject);
  return csvErrors.inValidMessages || [];
};

export async function readFileAsText(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      resolve(e.target.result);
    };
    reader.readAsText(file);
  });
}

export function userTabList(t) {
  return {
    Contacts: t("common:menu.contact"),
    Communication: t("common:right_menu.communications"),
    Plans: t("common:misc.payments"),
    Plots: t("common:misc.plots"),
    LeadManagement: t("common:misc.lead_details"),
    Invitations: t("common:menu.invitations"),
    Forms: t("common:misc.forms"),
    CustomerJourney: t("common:menu.customer_journey")
  }
}
