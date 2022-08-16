import React, { useState, useContext } from "react";
import { useQuery } from "react-apollo";
import { useTranslation } from 'react-i18next';
import { Context as AuthStateContext } from "../../../containers/Provider/AuthStateProvider";
import Loading from "../../../shared/Loading";
import { AllEventLogsQuery } from "../graphql/queries";
import ErrorPage from "../../../components/Error";
import Events from "./Events"
import PageWrapper from "../../../shared/PageWrapper";

export default ({ history }) => {
  const authState = useContext(AuthStateContext);
  const { t } = useTranslation('common');
  return AllEventLogs(history, authState, t);
};
// Todo: Find the total number of allEventLogs
const limit = 30;
const AllEventLogs = (history, authState, t) => {
  const [offset, setOffset] = useState(0);
  const { loading, error, data } = useQuery(AllEventLogsQuery, {
    variables: { subject: null, refId: null, refType: null, offset, limit },
    fetchPolicy: "cache-and-network"
  });
  const { token } = authState;
  if (loading) return <Loading />;
  if (error) return <ErrorPage title={error.message} />;
  function handleNextPage() {
    setOffset(offset + limit);
  }
  function handlePreviousPage() {
    if (offset < limit) {
      return;
    }
    setOffset(offset - limit);
  }
  return (
    <PageWrapper pageTitle={t('misc.event_logs')}>
      <Events
        data={data}
        previousPage={handlePreviousPage}
        offset={offset}
        nextPage={handleNextPage}
        router={history}
        userToken={token}
      />
    </PageWrapper>
  );
};