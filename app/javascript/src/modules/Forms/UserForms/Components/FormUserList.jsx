import React, { useContext } from 'react';
import { useQuery } from 'react-apollo';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import { Spinner } from '../../../../shared/Loading';
import UserFilledForms from '../../../Users/Components/UserFilledForms';
import { SubmittedFormsQuery } from '../graphql/userform_queries';

export default function FormUserList() {
  const authState = useContext(Context);
  const { data, loading } = useQuery(SubmittedFormsQuery);

  return (
      loading ? (
        <Spinner />
      ) : (
        <UserFilledForms
          userFormsFilled={data?.submittedForms}
          userId={authState.user.id}
          currentUser={authState.user.id}
        />
      )
  );
}
