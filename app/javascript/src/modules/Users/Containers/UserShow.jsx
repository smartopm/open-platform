/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useQuery, useMutation } from 'react-apollo';
import ReactGA from 'react-ga';
import UserInformation from '../Components/UserInformation';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import Loading from '../../../shared/Loading';
import { UserQuery, UserAccountQuery } from '../../../graphql/queries';
import { AddActivityLog, SendOneTimePasscode } from '../../../graphql/mutations';
import ErrorPage from '../../../components/Error';
import PageWrapper from '../../../shared/PageWrapper';

export default function UserShow({ history }) {
  const { id, dg, tm } = useParams(); // get timestamp and dg
  const authState = useContext(AuthStateContext);
  const { loading, error, data, refetch } = useQuery(UserQuery, {
    variables: { id },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  });
  // GA-event Digital scanning
  ReactGA.event({
    category: 'IDScanning',
    action: 'DigitalScan',
    eventLabel: tm + dg,
    nonInteraction: true
  });
  const [addLogEntry, entry] = useMutation(AddActivityLog, {
    variables: {
      userId: id,
      digital: Boolean(dg) || false,
      timestamp: tm
    }
  });

  const { data: accountData, refetch: accountRefetch } = useQuery(UserAccountQuery, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  const [sendOneTimePasscode] = useMutation(SendOneTimePasscode);

  if (loading || entry.loading) return <Loading />;
  if (entry.data) return <Redirect to="/" />;
  if (error && !error.message.includes('permission')) {
    return <ErrorPage title={error.message || error} />; // error could be a string sometimes
  }
  return (
    <PageWrapper>
      <UserInformation
        data={data}
        accountData={accountData}
        accountRefetch={accountRefetch}
        authState={authState}
        onLogEntry={addLogEntry}
        sendOneTimePasscode={sendOneTimePasscode}
        refetch={refetch}
        userId={id}
        router={history}
      />
    </PageWrapper>
  );
}
