import PropTypes from 'prop-types';

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
