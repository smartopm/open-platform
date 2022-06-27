import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-apollo';
import FormUpdate from '../components/FormUpdate';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import FormContextProvider from '../Context';
import Form from '../components/Category/Form';
import { FormQuery } from '../graphql/forms_queries';
import { PublicUserMutation } from '../graphql/forms_mutation';
import { AUTH_TOKEN_KEY } from '../../../utils/apollo';
import CenteredContent from '../../../shared/CenteredContent';
import { FormCategoriesQuery } from '../graphql/form_category_queries';
import { savePdf, useParamsQuery } from '../../../utils/helpers';
import PageWrapper from '../../../shared/PageWrapper';

export default function FormPage() {
  const { userId, formUserId, formId } = useParams();
  const { pathname } = useLocation();
  const authState = useContext(Context);
  const { t } = useTranslation(['common', 'form']);
  const path = useParamsQuery('');
  const id = path.get('formId');
  const download = path.get('download')
  const { data: formDetailData, loading } = useQuery(FormQuery, { variables: { id: formId } });
  const [loginPublicUser] = useMutation(PublicUserMutation);
  const categoriesData = useQuery(FormCategoriesQuery, {
    variables: { formId: id },
    fetchPolicy: 'no-cache'
  });
  const isFormFilled = pathname.includes('user_form');
  const [isError, setIsError] = useState();

  useEffect(() => {
    // check route and auto log the user
    if (!authState.user && pathname.includes('public')) {
      loginPublicUser()
        .then(({ data }) => {
          localStorage.setItem(AUTH_TOKEN_KEY, data.loginPublicUser.authToken);
          // This causes a blink in the screen, but needed for public user permission
          window.location.reload();
        })
        .catch(() => setIsError(true));
    }
  }, [authState.user, loginPublicUser, pathname]);

  useEffect(() => {
    if (!loading && formDetailData?.form) {
      if (!formDetailData?.form?.isPublic && authState?.user?.userType === 'public_user') {
        setIsError(true);
      }
    }
  }, [authState?.user?.userType, formDetailData?.form.isPublic]);

  useEffect(() => {
    let timer;
    if (download === 'true' && !categoriesData.loading) {
      const viewPort = document.querySelector('[name=viewport]');
      if (viewPort) {
        viewPort.setAttribute('content', 'width=1024');
      }
      timer = window.setTimeout(() => {
        const actionButtons = document.querySelector('#form_update_actions');
        if (actionButtons) { actionButtons.style.visibility = 'hidden'; }
        savePdf(document.querySelector('#form_update_container'), 'form');
        window.setTimeout(() => { window.close() }, 1000);
      }, 1000);
    }
    return () => window.clearTimeout(timer);
  }, [download, categoriesData?.loading]);

  const breadCrumbObj = {
    linkText: t('common:misc.forms'),
    linkHref: '/forms',
    pageName: t('form:misc.submit_form')
  };

  if (isError) {
   return (
     <CenteredContent>
       <Typography>{t('errors.something_went_wrong_forms')}</Typography>
     </CenteredContent>
     )
  }

  return (
    <PageWrapper pageTitle={t('form:misc.submit_form')} breadCrumbObj={breadCrumbObj}>
      <br />
      {isFormFilled ? (
        <FormContextProvider>
          <Container maxWidth="md" id="form_update_container">
            <FormUpdate
              userId={userId}
              formUserId={formUserId}
              authState={authState}
              categoriesData={categoriesData?.data?.formCategories}
            />
          </Container>
        </FormContextProvider>
      ) : (
        <FormContextProvider>
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
    </PageWrapper>
  );
}
