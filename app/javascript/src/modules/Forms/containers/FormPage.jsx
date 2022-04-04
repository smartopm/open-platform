import React, { useContext } from 'react';
import { useLocation, useParams } from 'react-router';
import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-apollo';
import FormUpdate from '../components/FormUpdate';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import FormContextProvider from '../Context';
import Form from '../components/Category/Form';
import FormHeader from '../components/FormHeader';
import { FormQuery } from '../graphql/forms_queries';

export default function FormPage() {
  const { userId, formUserId, formId } = useParams();
  const { pathname } = useLocation();
  const authState = useContext(Context);
  const { t } = useTranslation(['common', 'form']);
  const { data: formDetailData, loading } = useQuery(FormQuery, { variables: { id: formId } });
  const isFormFilled = pathname.includes('user_form');
  return (
    <>
      <br />
      {isFormFilled ? (
        <FormUpdate userId={userId} formUserId={formUserId} authState={authState} />
      ) : (
        <FormContextProvider>
          <FormHeader
            linkText={t('common:misc.forms')}
            linkHref="/forms"
            pageName={t('form:misc.submit_form')}
            PageTitle={t('form:misc.submit_form')}
          />
          <Container maxWidth="md">
            <Form
              editMode={false}
              formId={formId}
              formDetailData={formDetailData}
              loading={loading}
            />
          </Container>
        </FormContextProvider>
      )}
    </>
  );
}
