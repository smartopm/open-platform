import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-apollo';
import { useHistory } from 'react-router';
import { AllEventLogsQuery } from '../../EventLogs/graphql/queries';
import { FormPropertiesQuery, FormQuery } from '../graphql/forms_queries';
import { Spinner } from '../../../shared/Loading';
import { FormUpdateMutation } from '../graphql/forms_mutation';
import { formStatus } from '../../../utils/constants';
import FormTimeline from '../../../shared/TimeLine';
import { ActionDialog } from '../../../components/Dialog';
import { formatError, objectAccessor } from '../../../utils/helpers';
import Form from './Category/Form';
import FormContextProvider from '../Context';
import ErrorPage from '../../../components/Error';
import { StyledTabs, StyledTab, TabPanel, a11yProps } from '../../../components/Tabs';
import FormTitle from './FormTitle';
import FormCreate from './FormCreate';
import PageWrapper from '../../../shared/PageWrapper';
import { SnackbarContext } from '../../../shared/snackbar/Context';

/**
 * @param {String} formId
 * @description puts form related components(fields) together and allow user to dynamically create different form properties
 * @returns {Node}
 */
export default function FormBuilder({ formId }) {
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const [tabValue, setTabValue] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const { t } = useTranslation(['form', 'common']);
  const { showSnackbar, messageType } = useContext(SnackbarContext);

  const [updateForm] = useMutation(FormUpdateMutation);
  const { data, error, loading, refetch: dataRefetch } = useQuery(FormPropertiesQuery, {
    variables: { formId },
    errorPolicy: 'all'
  });
  const { data: formDetailData, loading: formDetailLoading, refetch: formDetailRefetch } = useQuery(
    FormQuery,
    {
      variables: { id: formId }
    }
  );
  const formLogs = useQuery(AllEventLogsQuery, {
    variables: {
      refId: formId,
      refType: 'Forms::Form',
      subject: null
    }
  });
  const formData = useQuery(FormQuery, {
    variables: { id: formId }
  });

  const TAB_VALUES = {
    form_builder: 0,
    form_settings: 1,
    update_history: 2
  };

  function handleTabValueChange(_event, newValue) {
    history.push(
      `?tab=${Object.keys(TAB_VALUES).find(key => objectAccessor(TAB_VALUES, key) === newValue)}`
    );
    setTabValue(Number(newValue));
  }

  function handleConfirmPublish() {
    setOpen(!open);
  }

  function publishForm() {
    setIsPublishing(true);
    setOpen(!open);
    updateForm({
      variables: { id: formId, status: formStatus.publish }
    })
      .then(() => {
        showSnackbar({ type: messageType.success, message: t('misc.published_form') });
        setIsPublishing(false);
      })
      .catch(err => {
        showSnackbar({ type: messageType.error, message: formatError(err.message) });
        setIsPublishing(false);
      });
  }

  const breadCrumbObj = {
    linkText: t('common:misc.forms'),
    linkHref: '/forms',
    pageName: t('misc.configure_form')
  };

  if (loading || formLogs.loading || formData.loading) return <Spinner />;
  if (error || formLogs.error || formData.error)
    return <ErrorPage title={error?.message || formLogs?.error?.message} />;

  return (
    <PageWrapper oneCol pageTitle={t('misc.configure_form')} breadCrumbObj={breadCrumbObj}>
      {formDetailLoading && <Spinner />}
      <FormContextProvider>
        <Container>
          <ActionDialog
            open={open}
            handleClose={handleConfirmPublish}
            handleOnSave={publishForm}
            message={t('misc.are_you_sure_to_publish')}
            type="confirm"
          />
          {loading && <Spinner />}
          {!loading && formDetailData && <FormTitle name={formDetailData.form?.name} />}
          <StyledTabs
            value={tabValue}
            onChange={handleTabValueChange}
            aria-label="form_builder"
            variant="standard"
            style={{ borderBottom: 'solid 1px #ececea' }}
          >
            <StyledTab
              label={t('misc.form_builder')}
              style={
                tabValue === objectAccessor(TAB_VALUES, 'form_builder')
                  ? { fontSize: '14px', textAlign: 'left', borderBottom: 'solid 1px' }
                  : { fontSize: '14px', textAlign: 'left' }
              }
              {...a11yProps(0)}
            />
            <StyledTab
              label={t('misc.form_settings')}
              style={
                tabValue === objectAccessor(TAB_VALUES, 'form_settings')
                  ? { fontSize: '14px', borderBottom: 'solid 1px' }
                  : { fontSize: '14px' }
              }
              {...a11yProps(1)}
            />
            <StyledTab
              label={t('misc.update_history')}
              style={
                tabValue === objectAccessor(TAB_VALUES, 'update_history')
                  ? { fontSize: '14px', borderBottom: 'solid 1px' }
                  : { fontSize: '14px' }
              }
              {...a11yProps(2)}
            />
          </StyledTabs>
          <TabPanel value={tabValue} index={0} pad>
            <div style={{ paddingBottom: '20px' }}>
              <Form
                formId={formId}
                editMode
                property={Boolean(data.formProperties.length)}
                publishForm={publishForm}
                isPublishing={isPublishing}
                handleConfirmPublish={handleConfirmPublish}
                formDetailRefetch={dataRefetch}
              />
            </div>
          </TabPanel>
          <TabPanel value={tabValue} index={1} pad>
            <FormCreate
              formMutation={updateForm}
              refetch={formDetailRefetch}
              actionType="update"
              formId={formId}
              t={t}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={2} pad>
            <FormTimeline data={formLogs.data?.result} />
          </TabPanel>
        </Container>
      </FormContextProvider>
    </PageWrapper>
  );
}

FormBuilder.propTypes = {
  formId: PropTypes.string.isRequired
};
