import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useQuery } from 'react-apollo';
import useMediaQuery from '@mui/material/useMediaQuery';
import PageHeader from '../../../../shared/PageHeader';
import { ProcessReplyComments } from '../graphql/process_queries';
import { Spinner } from '../../../../shared/Loading';
import CenteredContent from '../../../../shared/CenteredContent';
import { formatError, objectAccessor } from '../../../../utils/helpers';
import { StyledTabs, StyledTab, TabPanel, a11yProps } from '../../../../components/Tabs';
import PageWrapper from '../../../../shared/PageWrapper';
import ProcessCommentItem from './ProcessCommentItem';

export default function ProcessCommentsPage() {
  const matches = useMediaQuery('(max-width:600px)');
  const history = useHistory();
  const { t } = useTranslation(['process', 'task']);
  const [tabValue, setTabValue] = useState(0);

  const { data, loading, error } = useQuery(ProcessReplyComments, {
    fetchPolicy: 'cache-and-network'
  });

  const TAB_VALUES = {
    sent: 0,
    received: 1,
    resolved: 2
  };

  function handleTabValueChange(_event, newValue) {
    history.push(
      `?tab=${Object.keys(TAB_VALUES).find(key => objectAccessor(TAB_VALUES, key) === newValue)}`
    );
    setTabValue(Number(newValue));
  }

  if (loading) return <Spinner />;
  return (
    <>
      <PageHeader
        linkText={t('breadcrumbs.processes')}
        linkHref="/processes"
        pageName={t('breadcrumbs.comments')}
        PageTitle={t('templates.drc_comments')}
      />
      {loading ? (
        <Spinner />
      ) : (
        <PageWrapper>
          <StyledTabs
            value={tabValue}
            onChange={handleTabValueChange}
            aria-label="process-tabs"
            variant="standard"
            style={{ borderBottom: 'solid 1px #ececea' }}
          >
            <StyledTab
              label={t('comments.sent')}
              style={
                tabValue === objectAccessor(TAB_VALUES, 'sent')
                  ? { fontSize: '12px', textAlign: 'left', borderBottom: 'solid 1px' }
                  : { fontSize: '12px', textAlign: 'left' }
              }
              {...a11yProps(0)}
            />
            <StyledTab
              label={t('comments.received')}
              style={
                tabValue === objectAccessor(TAB_VALUES, 'received')
                  ? { fontSize: '12px', borderBottom: 'solid 1px' }
                  : { fontSize: '12px' }
              }
              {...a11yProps(1)}
            />
            <StyledTab
              label={t('comments.resolved')}
              style={
                tabValue === objectAccessor(TAB_VALUES, 'resolved')
                  ? { fontSize: '12px', borderBottom: 'solid 1px' }
                  : { fontSize: '12px' }
              }
              {...a11yProps(1)}
            />
          </StyledTabs>
          <TabPanel value={tabValue} index={0} pad={matches}>
            <div style={matches ? { paddingTop: '30px' } : {}}>
              {data.processReplyComments.sent.length > 0 ? (
                data.processReplyComments.sent.map(comment => (
                  <div key={comment.id}>
                    <ProcessCommentItem commentdata={comment} commentType="Sent" />
                  </div>
                ))
              ) : (
                <CenteredContent>{t('comments.no_comment')}</CenteredContent>
              )}
            </div>
          </TabPanel>
          <TabPanel value={tabValue} index={1} pad={matches}>
            <div style={matches ? { paddingTop: '30px' } : {}}>
              {data.processReplyComments.received.length > 0 ? (
                data.processReplyComments.received.map(comment => (
                  <div key={comment.id}>
                    <ProcessCommentItem commentdata={comment} commentType="Received" />
                  </div>
                ))
              ) : (
                <CenteredContent>{t('comments.no_comment')}</CenteredContent>
              )}
            </div>
          </TabPanel>
          <TabPanel value={tabValue} index={2} pad={matches}>
            <div style={matches ? { paddingTop: '30px' } : {}}>
              {data.processReplyComments.resolved.length > 0 ? (
                data.processReplyComments.resolved.map(comment => (
                  <div key={comment.id}>
                    <ProcessCommentItem commentdata={comment} commentType="Resolved" />
                  </div>
                ))
              ) : (
                <CenteredContent>{t('comments.no_comment')}</CenteredContent>
              )}
            </div>
          </TabPanel>
        </PageWrapper>
      )}
      {error && <CenteredContent>{formatError(error.message)}</CenteredContent>}
    </>
  );
}
