import { Container, Typography } from '@mui/material';
import React, { useContext } from 'react'
import { useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import { Spinner } from '../../../../shared/Loading';
import UserFilledForms from '../../../Users/Components/UserFilledForms'
import { SubmittedFormsQuery } from '../graphql/userform_queries';

export default function FormUserList() {
  const authState = useContext(Context)
  const { data, loading } = useQuery(SubmittedFormsQuery)
  const { t } = useTranslation(['common']);
  return (
    <Container>
      <Typography variant="h3" color="text.secondary" data-testid="my_title">
        {t('menu.form', { count: 0 })}
      </Typography>
      {
        loading 
        ? <Spinner /> 
        : (
          <UserFilledForms
            userFormsFilled={data?.submittedForms}
            userId={authState.user.id}
            currentUser={authState.user.id}
          />
        )
      }
    </Container>
  );
}