import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-apollo';
import FormUpdate from '../components/FormUpdate';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import FormContextProvider from '../Context';
import Form from '../components/Category/Form';
import FormHeader from '../components/FormHeader';
import { FormQuery } from '../graphql/forms_queries';
import { PublicUserMutation } from '../graphql/forms_mutation';
import { AUTH_TOKEN_KEY } from '../../../utils/apollo';
import CenteredContent from '../../../shared/CenteredContent';
import AccessCheck from '../../Permissions/Components/AccessCheck';

export default function FormPage() {
  const { userId, formUserId, formId } = useParams();
  const { pathname } = useLocation();
  const matches = useMediaQuery('(max-width:900px)');
  const authState = useContext(Context);
  const { t } = useTranslation(['common', 'form']);
  const { data: formDetailData, loading } = useQuery(FormQuery, { variables: { id: formId } });
  const [loginPublicUser] = useMutation(PublicUserMutation)
  const isFormFilled = pathname.includes('user_form');
  const [isError, setIsError] = useState()

  useEffect(() => {
    // check route and auto log the user
    if (!authState.user && pathname.includes('public')) {
        loginPublicUser()
          .then(({ data }) => {
            localStorage.setItem(AUTH_TOKEN_KEY, data.loginPublicUser.authToken)
            // This causes a blink in the screen, but needed for public user permission
            window.location.reload()
          })
          .catch(() => setIsError(true))
    }
  }, [authState.user, loginPublicUser, pathname])

  useEffect(() => {
    if (!loading && formDetailData?.form) {
      if (!formDetailData?.form?.isPublic && authState?.user?.userType === 'public_user') {
        setIsError(true);
      }
    }
  }, [authState?.user?.userType, formDetailData?.form.isPublic]);

  if(isError) {
   return (
     <CenteredContent>
       <Typography>{t('errors.something_went_wrong_forms')}</Typography>
     </CenteredContent>
     ) 
  }

  return (
    <>
      <br />
      {isFormFilled ? (
        <FormUpdate userId={userId} formUserId={formUserId} authState={authState} />
      ) : (
        <FormContextProvider>
          <div style={matches ? {marginTop: '-40px'} : {}}>
            <AccessCheck module='forms' allowedPermissions={['can_access_forms']}>
              <FormHeader
                linkText={t('common:misc.forms')}
                linkHref="/forms"
                pageName={t('form:misc.submit_form')}
                PageTitle={t('form:misc.submit_form')}
              />
            </AccessCheck>
          </div>
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
