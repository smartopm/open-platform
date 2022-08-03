import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, css } from 'aphrodite';
import { useMutation, useQuery } from 'react-apollo';
import { useHistory } from 'react-router-dom';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CreateActionFlow, UpdateActionFlow } from '../../graphql/mutations';
import ActionFlowModal from './ActionFlowModal';
import { Flows } from '../../graphql/queries';
import ActionFlowsList from '../../components/ActionFlowsList';
import Loading from '../../shared/Loading';
import ErrorPage from '../../components/Error';
import CenteredContent from '../../components/CenteredContent';
import Paginate from '../../components/Paginate';
import { formatError, useParamsQuery } from '../../utils/helpers';
import PageWrapper from '../../shared/PageWrapper';
import { SnackbarContext } from '../../shared/snackbar/Context';

export default function ActionFlows() {
  const limit = 10;
  const [open, setModalOpen] = useState(false);
  const [selectedActionFlow, setSelectedActionFlow] = useState({});
  const [offset, setOffset] = useState(0);
  const history = useHistory();
  const [createActionFlow] = useMutation(CreateActionFlow);
  const [updateActionFlow] = useMutation(UpdateActionFlow);
  const { t } = useTranslation(['actionflow', 'common']);

  const { showSnackbar, messageType } = useContext(SnackbarContext);

  const pathQuery = useParamsQuery('');
  const type = pathQuery.get('type');
  const currentFlow = pathQuery.get('flow');

  const { data, error, loading, refetch } = useQuery(Flows, {
    variables: { limit, offset }
  });

  useEffect(() => {
    if (type === 'new') {
      openModal();
    }

    if (type === 'edit') {
      openModal(currentFlow);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  function openModal(flowId = null) {
    let path = '/action_flows?type=new';
    if (flowId) {
      path = `/action_flows?flow=${flowId}&&type=edit`;
    }

    setSelectedActionFlow(getActionFlow(flowId));
    history.push(path);
    setModalOpen(true);
  }

  function closeModal() {
    setSelectedActionFlow({});
    history.push('/action_flows');
    setModalOpen(false);
  }

  /** whitelist some metadata fields that are not variables but contain whitespace
  e.g "message" field used by the notification action * */
  // TODO: Revisit this and remove potential complexity @Nurudeen and @Victor
  const metaDataVariableWhiteList = Object.freeze([
    'message',
    'body',
    'description',
    'title',
    'action'
  ]);

  function isMetaDataAVariable({ key, value }) {
    if (metaDataVariableWhiteList.indexOf(key) >= 0) {
      return false;
    }

    return value.indexOf(' ') >= 0;
  }

  function metaDataVariableValue(value) {
    return value.replace(/ /g, '_').toLowerCase();
  }

  function handleSave(dataObj, metaData) {
    const actionMetaData = {};
    Object.entries(metaData).forEach(([key, value]) => {
      actionMetaData[String(key)] = {
        name: key,
        value: isMetaDataAVariable({ key, value }) ? metaDataVariableValue(value) : value,
        type: isMetaDataAVariable({ key, value }) ? 'variable' : 'string'
      };
    });

    const eventAction = {
      action_name: dataObj.actionType,
      action_fields: actionMetaData,
    };

    let variables = {
      title: dataObj.title,
      description: dataObj.description,
      eventType: dataObj.eventType,
      eventCondition: dataObj.eventCondition,
      eventConditionQuery: dataObj.eventConditionQuery,
      eventAction,
    };

    let action = createActionFlow;

    if (Object.keys(selectedActionFlow).length) {
      variables = {
        ...variables,
        id: selectedActionFlow.id
      };

      action = updateActionFlow;
    }

    action({
      variables
    })
      .then(() => {
        closeModal();
        refetch();
        showSnackbar({ type: messageType.success, message: t('actionflow:messages.success_message') })
      })
      .catch(e => {
        showSnackbar({ type: messageType.error, message: formatError(e.message) })
      });
  }

  function getActionFlow(id) {
    if (!id) return {};

    return (
      data?.actionFlows.find(flow => {
        return flow.id === id;
      }) || {}
    );
  }

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) return;
      setOffset(offset - limit);
    } else if (action === 'next') {
      setOffset(offset + limit);
    }
  }

  if (loading) return <Loading />;
  if (error) return <ErrorPage title={error.message} />;

  return (
    <PageWrapper pageTitle={t('common:misc.action_flows')}>
      <div>
        <ActionFlowModal
          open={open}
          closeModal={closeModal}
          handleSave={handleSave}
          selectedActionFlow={selectedActionFlow}
        />
        <div style={{ textAlign: 'right' }}>
          <Button
            variant="contained"
            onClick={() => openModal()}
            color="primary"
            className={`${css(styles.addFlow)} `}
            data-testid="new-flow-btn"
          >
            {t('actionflow:form_actions.new_workflow')}
          </Button>
        </div>
        {data.actionFlows.length ? (
          <>
            <ActionFlowsList openFlowModal={openModal} data={data} refetch={refetch} />
            <CenteredContent>
              <Paginate
                offSet={offset}
                limit={limit}
                active={offset >= 1}
                handlePageChange={paginate}
              />
            </CenteredContent>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>{t('actionflow:messages.workflow_not_found')}</div>
        )}
      </div>
    </PageWrapper>
  );
}

const styles = StyleSheet.create({
  addFlow: {
    boxShadow: 'none',
    marginRight: 7,
    marginBottom: 20,
    color: '#FFFFFF'
  }
});
