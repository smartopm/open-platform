import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';
import { Button, ButtonGroup, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useQuery, useLazyQuery } from 'react-apollo';
import { ProcessCommentsQuery, ProcessReplyComments } from '../graphql/process_queries';
import { Spinner } from '../../../../shared/Loading';
import CenteredContent from '../../../../shared/CenteredContent';
import { formatError, objectAccessor, useParamsQuery } from '../../../../utils/helpers';
import Paginate from '../../../../components/Paginate';
import { StyledTabs, StyledTab, TabPanel, a11yProps } from '../../../../components/Tabs';
import PageWrapper from '../../../../shared/PageWrapper';
import ProcessCommentItem from './ProcessCommentItem';

export default function ProcessCommentsPage() {
  const { id: processId } = useParams();
  const theme = useTheme();
  const matches = useTheme(theme.breakpoints.down('sm'));
  const history = useHistory();
  const path = useParamsQuery();
  const { t } = useTranslation(['process', 'task']);
  const [tabValue, setTabValue] = useState(0);
  const processName = path.get('process_name');
  const [viewType, setViewType] = useState('tab');
  const limit = 50;
  const [offset, setOffset] = useState(0);

  const { data, loading, error } = useQuery(ProcessReplyComments, {
    variables: { processId },
    fetchPolicy: 'cache-and-network'
  });

  const [loadProcessComments,
    { data: processComments, loading: processCommentsLoading, error: processCommentsError },
  ] = useLazyQuery(ProcessCommentsQuery, {
    variables: { processId }
  });

  useEffect(() => {
    if (viewType === 'list') {
      loadProcessComments();
    }
  }, [viewType, loadProcessComments]);

  const TAB_VALUES = {
    sent: 0,
    received: 1,
    resolved: 2
  };

  function handleCommentsViewType(view) {
    setViewType(view);
  }

  const rightPanelObj = [
    {
      mainElement: (
        <ButtonGroup disableElevation color="primary" variant="outlined" aria-label="status button">
          <Button
            onClick={() => handleCommentsViewType('list')}
            data-testid="comments-list-view"
          >
            {t('process:comments.list_view')}
          </Button>
          <Button
            onClick={()=> handleCommentsViewType('tab')}
            data-testid="comments-tab-view"
          >
            {t('process:comments.tab_view')}
          </Button>
        </ButtonGroup>
      ),
      key: 1,
    },
  ];

  function handleTabValueChange(_event, newValue) {
    history.push(
      `?tab=${Object.keys(TAB_VALUES).find(key => objectAccessor(TAB_VALUES, key) === newValue)}`
    );
    setTabValue(Number(newValue));
  }

  const breadCrumbObj = {
    linkText: t('breadcrumbs.processes'),
    linkHref: '/processes',
    pageName: t('breadcrumbs.comments')
  };

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) {
        return;
      }
      setOffset(offset - limit);
    } else if (action === 'next') {
      setOffset(offset + limit);
    }
  }

  return (
    <PageWrapper
      oneCol
      pageTitle={t('task:processes.comments')}
      breadCrumbObj={breadCrumbObj}
      rightPanelObj={rightPanelObj}
    >
      <Typography
        variant="h5"
        color="textSecondary"
        style={{marginBottom: '24px'}}
      >
        {processName}
      </Typography>
      {viewType === 'tab' && (
        <>
          {loading ? (
            <Spinner />
          ) : (
            <>
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
                  {data?.processReplyComments?.sent?.length > 0 ? (
              data?.processReplyComments?.sent?.map(comment => (
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
                  {data?.processReplyComments?.received?.length > 0 ? (
              data?.processReplyComments?.received?.map(comment => (
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
                  {data?.processReplyComments?.resolved?.length > 0 ? (
              data?.processReplyComments?.resolved?.map(comment => (
                <div key={comment.id}>
                  <ProcessCommentItem commentdata={comment} commentType="Resolved" />
                </div>
              ))
            ) : (
              <CenteredContent>{t('comments.no_comment')}</CenteredContent>
            )}
                </div>
              </TabPanel>
            </>
          )}
          {error && <CenteredContent>{formatError(error.message)}</CenteredContent>}
        </>
      )}
      {viewType === 'list' && (
        <>
          {processCommentsLoading? <Spinner /> : (
            processComments?.processComments?.length > 0 ? (
              processComments.processComments.map(comment => (
                <div key={comment.id}>
                  <ProcessCommentItem listView commentdata={comment} />
                </div>
              ))
            ) : (
              <CenteredContent>{t('comments.no_comment')}</CenteredContent>
            )
          )}
          {processCommentsError && (
            <CenteredContent>{formatError(processCommentsError.message)}</CenteredContent>
          )}
          <CenteredContent>
            <Paginate
              count={processComments?.processComments?.length}
              offSet={offset}
              limit={limit}
              active={offset >= 1}
              handlePageChange={paginate}
            />
          </CenteredContent>
        </>
      )}
    </PageWrapper>
  );
}
