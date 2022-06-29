import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { Container, Typography, useMediaQuery, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-apollo';
import DownloadIcon from '@mui/icons-material/Download';
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
  const { data: formDetailData, loading } = useQuery(FormQuery, { variables: { id: formId } });
  const [loginPublicUser] = useMutation(PublicUserMutation);
  const categoriesData = useQuery(FormCategoriesQuery, {
    variables: { formId: id },
    fetchPolicy: 'no-cache'
  });
  const isFormFilled = pathname.includes('user_form');
  const [isError, setIsError] = useState();
  const smMatches = useMediaQuery('(max-width:900px)');

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

  function handleDownload() {
    const actionButtons = document.querySelector('#form_update_actions');
    const viewPort = document.querySelector('[name=viewport]');

    if (viewPort) viewPort.setAttribute('content', 'width=1024');
    if (actionButtons) actionButtons.style.visibility = 'hidden';

    savePdf(document.querySelector('#form_update_container'), 'form');

    if (actionButtons) actionButtons.style.visibility = 'visible';
    if (viewPort) viewPort.setAttribute('content', 'width=device-width');
  }

  const breadCrumbObj =
    (authState?.user?.userType === 'public_user' && pathname.includes('public'))
      ? {}
      : {
          linkText: t('common:misc.forms'),
          linkHref: '/forms',
          pageName: t('form:misc.submit_form'),
        };

  const rightPanelObj =
    authState?.user?.userType === 'admin'
      ? [
          {
            mainElement: (
              <Button
                startIcon={!smMatches && <DownloadIcon />}
                onClick={handleDownload}
                variant="contained"
                color="primary"
                style={{ color: '#FFFFFF' }}
                data-testid="download_form_btn"
                disableElevation
                disabled={categoriesData?.loading}
              >
                {smMatches ? <DownloadIcon /> : t('common:misc.download')}
              </Button>
            ),
            key: 1,
          },
        ]
      : [];

  if (isError) {
   return (
     <CenteredContent>
       <Typography>{t('errors.something_went_wrong_forms')}</Typography>
     </CenteredContent>
     )
  }

  return (
    <PageWrapper
      pageTitle={t('form:misc.submit_form')}
      breadCrumbObj={breadCrumbObj}
      rightPanelObj={rightPanelObj}
    >
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
