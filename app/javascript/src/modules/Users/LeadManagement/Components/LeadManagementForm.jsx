import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import { useLazyQuery, useMutation } from 'react-apollo';
import { Divider } from '@material-ui/core';
import PropTypes from 'prop-types';
import { LeadDetailsQuery } from '../../../../graphql/queries';
import { UpdateUserMutation } from '../../../../graphql/mutations/user';
import { Spinner } from '../../../../shared/Loading';
import CenteredContent from '../../../../shared/CenteredContent';
import { formatError } from '../../../../utils/helpers';
import { initialLeadFormData } from '../../utils';
import LeadInformation from './LeadInformation';
import CompanyInformation from './CompanyInformation';
import MainContactInformation from './MainContactInformation';
import SecondaryContactInformation from './SecondaryContactInformation';

export default function LeadManagementForm({ userId }) {
  const [leadFormData, setLeadFormData] = useState(initialLeadFormData);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const [errors, setErr] = useState('');

  const [disabled, setDisabled] = useState(true);

  function handleChange(event) {
    setDisabled(false);
    const { name, value } = event.target;
    setLeadFormData({
      user: { ...leadFormData?.user, [name]: value }
    });
  }

  function handleSecondaryContact1Change(event) {
    setDisabled(false);
    const { name, value } = event.target;
    setLeadFormData({
      user: {
        ...leadFormData?.user,
        contactDetails: {
          ...leadFormData?.user?.contactDetails,
          secondaryContact1: {
            ...leadFormData?.user?.contactDetails?.secondaryContact1,
            [name]: value
          }
        }
      }
    });
  }

  function handleSecondaryContact2Change(event) {
    setDisabled(false);
    const { name, value } = event.target;
    setLeadFormData({
      user: {
        ...leadFormData?.user,
        contactDetails: {
          ...leadFormData?.user?.contactDetails,
          secondaryContact2: {
            ...leadFormData?.user?.contactDetails?.secondaryContact2,
            [name]: value
          }
        }
      }
    });
  }

  function handleTimeInputChange(event) {
    setDisabled(false);
    const { name, value } = event.target;
    setLeadFormData({
      ...leadFormData,
      user: { ...leadFormData?.user, [name]: value }
    });
  }

  const [leadDataUpdate] = useMutation(UpdateUserMutation);

  const [loadLeadData, { loading, error, data }] = useLazyQuery(LeadDetailsQuery, {
    variables: { id: userId },
    fetchPolicy: 'cache-and-network'
  });

  function handleSubmit(event) {
    event.preventDefault();
    setLoadingStatus(true);

    const formSecondaryPhoneNumber =
      leadFormData?.user?.secondaryPhoneNumber === undefined
        ? ''
        : leadFormData?.user?.secondaryPhoneNumber;
    const formSecondaryEmail =
      leadFormData?.user?.secondaryEmail === undefined ? '' : leadFormData?.user?.secondaryEmail;

    const existingSecondaryPhoneInfo = leadFormData?.user?.contactInfos.find(
      obj => obj.contactType === 'phone'
    );
    const existingSecondaryEmailInfo = leadFormData?.user?.contactInfos.find(
      obj => obj.contactType === 'email'
    );

    if (existingSecondaryPhoneInfo !== undefined) {
      existingSecondaryPhoneInfo.info = formSecondaryPhoneNumber;
    }

    if (existingSecondaryEmailInfo !== undefined) {
      existingSecondaryEmailInfo.info = formSecondaryEmail;
    }

    const secondaryInfo = [
      { contactType: 'phone', info: formSecondaryPhoneNumber },
      { contactType: 'email', info: formSecondaryEmail }
    ];
    const cleanedSecondaryInfo = secondaryInfo.filter(obj => obj.info !== undefined);
    leadDataUpdate({
      variables: {
        ...leadFormData?.user,
        secondaryInfo:
          leadFormData?.user?.contactInfos?.length === 0
            ? cleanedSecondaryInfo
            : leadFormData?.user?.contactInfos,
        id: userId
      }
    })
      .then(() => {
        setLoadingStatus(false);
        setDisabled(true);
      })
      .catch(err => {
        setDisabled(true);
        setErr(err);
      });
  }

  useEffect(() => {
    loadLeadData();
    if (data?.user) {
      setLeadFormData({
        user: {
          ...data.user,
          contactDetails: {
            ...data.user.contactDetails,
            secondaryContact1: {
              ...data.user.contactDetails?.secondaryContact1
            },
            secondaryContact2: {
              ...data.user.contactDetails?.secondaryContact2
            }
          }
        }
      });
    }
  }, [data, loadLeadData]);

  if (loading || loadingStatus) return <Spinner />;
  if (error) return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  // TODO: This error should be an alert instead of blocking the whole UI.
  if (errors) return <CenteredContent>{formatError(errors.message)}</CenteredContent>;

  return (
    <Grid container data-testid="lead-management-form">
      <Grid item md={12} xs={12}>
        <form onSubmit={handleSubmit} style={{ margin: '0 -25px 0 -25px' }}>
          <MainContactInformation
            leadFormData={leadFormData}
            handleChange={handleChange}
            disabled={disabled}
          />
          <br />
          <br />
          <Grid item md={12} xs={12} style={{ marginBottom: '2px' }}>
            <Divider />
          </Grid>
          <br />
          <SecondaryContactInformation
            leadFormData={leadFormData}
            handleChange={handleChange}
            handleSecondaryContact1Change={handleSecondaryContact1Change}
            handleSecondaryContact2Change={handleSecondaryContact2Change}
          />
          <br />
          <br />
          <Grid item md={12} xs={12} style={{ marginBottom: '2px' }}>
            <Divider />
          </Grid>
          <br />
          <CompanyInformation leadFormData={leadFormData} handleChange={handleChange} />
          <br />
          <br />
          <Grid item md={12} xs={12} style={{ marginBottom: '2px' }}>
            <Divider />
          </Grid>
          <br />
          <LeadInformation
            leadFormData={leadFormData}
            handleChange={handleChange}
            handleTimeInputChange={handleTimeInputChange}
          />
        </form>
      </Grid>
    </Grid>
  );
}

LeadManagementForm.propTypes = {
  userId: PropTypes.string.isRequired
};
