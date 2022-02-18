/* eslint-disable max-lines */
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
} from '../../../../utils/constants';

const ordinalSuffix = ['st', 'nd', 'rd'];
const addSuffix = n => n + (ordinalSuffix[(n - 1) % 10] || 'th');
const numberToOrdinal = n => (`${n}`.match(/1\d$/) ? `n + th` : addSuffix(n));

const requiredError = (headerName, rowNumber, columnNumber) => {
  return ` <div>${headerName} is required in the ${numberToOrdinal(
    rowNumber
  )} row ${numberToOrdinal(columnNumber)} column  </div>`;
};

const validateError = (headerName, rowNumber, columnNumber) => {
  return ` <div> ${headerName} is not valid in the ${numberToOrdinal(rowNumber)} ${numberToOrdinal(
    columnNumber
  )} column  </div>`;
};

const uniqueError = headerName => {
  return ` <div>${headerName} is not unique  </div>`;
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
        )} row ${columnNumber} column  </div>`;
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
        )} row ${numberToOrdinal(columnNumber)} column  </div>`;
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
        )} row ${numberToOrdinal(columnNumber)} column  </div>`;
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
        )} row ${numberToOrdinal(columnNumber)} column`;
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
        )} row ${numberToOrdinal(columnNumber)} column  </div>`;
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
        )} row ${numberToOrdinal(columnNumber)} column  </div>`;
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
        )} row  ${numberToOrdinal(columnNumber)} column  </div>`;
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
        )} row ${numberToOrdinal(columnNumber)} column  </div>`;
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
        )} row / ${numberToOrdinal(columnNumber)} column  </div>`;
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
        )} row ${numberToOrdinal(columnNumber)} column </div>`;
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
        )} row ${numberToOrdinal(columnNumber)} column  </div>`;
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
