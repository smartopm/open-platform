/* eslint-disable complexity */
/* eslint-disable max-statements */
/* eslint-disable max-lines */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';
import { Button, ButtonGroup, Grid, IconButton, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useQuery, useLazyQuery } from 'react-apollo';
import { ProcessCommentsQuery, ProcessReplyComments } from '../graphql/process_queries';
import SearchInput from '../../../../shared/search/SearchInput';
import { Spinner } from '../../../../shared/Loading';
import useDebouncedValue from '../../../../shared/hooks/useDebouncedValue';
import useFetchMoreRecords from '../../../../shared/hooks/useFetchMoreRecords';
import CenteredContent from '../../../../shared/CenteredContent';
import MenuList from '../../../../shared/MenuList';
import { formatError, handleQueryOnChange, objectAccessor, useParamsQuery } from '../../../../utils/helpers';
import { StyledTabs, StyledTab, TabPanel, a11yProps } from '../../../../components/Tabs';
import PageWrapper from '../../../../shared/PageWrapper';
import ProcessCommentItem from './ProcessCommentItem';
import QueryBuilder from '../../../../components/QueryBuilder'; // TODO: Move this to a shared directory
import { commentsBuilderConfig, commentsBuilderInitialValue, commentsFilterFields } from '../../../../utils/constants';

export default function ProcessCommentsPage() {
  const { id: processId } = useParams();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const history = useHistory();
  const path = useParamsQuery();
  const { t } = useTranslation(['common', 'process', 'task', 'search']);
  const [tabValue, setTabValue] = useState(0);
  const processName = path.get('process_name');
  const [viewType, setViewType] = useState('tab');
  const limit = 15;
  const [anchorEl, setAnchorEl] = useState(null);
  const anchorElOpen = Boolean(anchorEl);
  const [searchOpen, setSearchOpen] = useState(false);
  const { value, dbcValue, setSearchValue } = useDebouncedValue();
  const [displayBuilder, setDisplayBuilder] = useState('none');
  const [filterOpen, setOpenFilter] = useState(false);

  const { data, loading, error } = useQuery(ProcessReplyComments, {
    variables: { processId },
    fetchPolicy: 'cache-and-network'
  });

  const [loadProcessComments,
    {
      fetchMore,
      data: processComments,
      loading: processCommentsLoading,
      error: processCommentsError
    },
  ] = useLazyQuery(ProcessCommentsQuery, {
    variables: { processId, limit, query: value }
  });

  const variables = { offset: processComments?.processComments?.length };
  const { loadMore, hasMoreRecord } = useFetchMoreRecords(fetchMore, 'processComments', variables);

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

  function handleCommentsViewType(e, view) {
    setViewType(view);
    if (anchorElOpen) {
      handleClose(e)
    }
  }

  function handleSearch() {
    if (!searchOpen) {
      setViewType('list');
    } else {
      setViewType('tab');
    }
    setSearchOpen(!searchOpen);
  }

  const menuList = [
    {
      content: t('process:comments.list_view'),
      handleClick: (e) => handleCommentsViewType(e, 'list')
    },
    {
      content: t('process:comments.tab_view'),
      handleClick: (e) =>handleCommentsViewType(e, 'tab')
    }
  ];

  const rightPanelObj = [
    {
      mainElement: matches ? (
        <IconButton
          aria-label="view option"
          size="large"
          onClick={(event) => menuData.handleViewMenu(event)}
          data-testid='view-toggle-btn'
        >
          <VisibilityIcon />
        </IconButton>
      ) : (
        <ButtonGroup disableElevation color="primary" variant="outlined" aria-label="status button">
          <Button
            onClick={(e) => handleCommentsViewType(e, 'list')}
            data-testid="comments-list-view"
          >
            {t('process:comments.list_view')}
          </Button>
          <Button
            onClick={(e)=> handleCommentsViewType(e, 'tab')}
            data-testid="comments-tab-view"
          >
            {t('process:comments.tab_view')}
          </Button>
        </ButtonGroup>
      ),
      key: 1,
    },
    {
      mainElement: matches ? (
        <IconButton color="primary" data-testid="search" onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
      ) : (
        <Button
          startIcon={<SearchIcon />}
          data-testid="search"
          onClick={handleSearch}
        >
          {t('common:menu.search')}
        </Button>
      ),
      key: 2
    }
  ];

  function handleViewMenu(event) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }

  function handleClose(event) {
    event.stopPropagation();
    setAnchorEl(null);
  }

  const menuData = {
    menuList,
    handleViewMenu,
    anchorEl,
    open: anchorElOpen,
    handleClose
  };

  function handleTabValueChange(_event, newValue) {
    history.push(
      `?tab=${Object.keys(TAB_VALUES).find(key => objectAccessor(TAB_VALUES, key) === newValue)}&&process_name=${processName}`
    );
    setTabValue(Number(newValue));
  }

  const breadCrumbObj = {
    linkText: t('process:breadcrumbs.processes'),
    linkHref: '/processes',
    pageName: t('process:breadcrumbs.comments')
  };

  function toggleFilterMenu() {
    if (displayBuilder === '') {
      setDisplayBuilder('none');
    } else {
      setDisplayBuilder('');
    }
    setOpenFilter(!filterOpen);
  }

  function queryOnChange(selectedOptions) {
    setSearchValue(handleQueryOnChange(selectedOptions, commentsFilterFields));
  }

  return (
    <PageWrapper
      oneCol
      pageTitle={t('task:processes.comments')}
      breadCrumbObj={breadCrumbObj}
      rightPanelObj={rightPanelObj}
    >
      <Grid container spacing={1}>
        {searchOpen && (
          <>
            <Grid
              item
              md={6}
              xs={12}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
            >
              <SearchInput
                filterRequired
                title={t('task:processes.comments')}
                searchValue={value || ''}
                handleSearch={event => setSearchValue(event.target.value)}
                handleClear={() => setSearchValue('')}
                filters={[dbcValue]}
                handleFilter={toggleFilterMenu}
                fullWidth
                data-testid="search_input"
              />
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
              style={{
                display: displayBuilder,

              }}
            >
              <QueryBuilder
                handleOnChange={queryOnChange}
                builderConfig={commentsBuilderConfig}
                initialQueryValue={commentsBuilderInitialValue}
                addRuleLabel={t('common:misc.add_filter')}
              />
            </Grid>
          </>
        )}
      </Grid>
      <Typography
        variant="h5"
        color="textSecondary"
        style={matches ? {marginBottom: '12px', marginTop: '5px'} : {marginTop: '10px', marginBottom: '24px'}}
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
                  label={t('process:comments.sent')}
                  style={
                    tabValue === objectAccessor(TAB_VALUES, 'sent')
                      ? { fontSize: '12px', textAlign: 'left', borderBottom: 'solid 1px' }
                      : { fontSize: '12px', textAlign: 'left' }
                    }
                  {...a11yProps(0)}
                />
                <StyledTab
                  label={t('process:comments.received')}
                  style={
                  tabValue === objectAccessor(TAB_VALUES, 'received')
                    ? { fontSize: '12px', borderBottom: 'solid 1px' }
                    : { fontSize: '12px' }
                  }
                  {...a11yProps(1)}
                />
                <StyledTab
                  label={t('process:comments.resolved')}
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
              <CenteredContent>{t('process:comments.no_comment')}</CenteredContent>
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
              <CenteredContent>{t('process:comments.no_comment')}</CenteredContent>
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
              <CenteredContent>{t('process:comments.no_comment')}</CenteredContent>
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
              <CenteredContent>{t('process:comments.no_comment')}</CenteredContent>
            )
          )}
          {processCommentsError && (
            <CenteredContent>{formatError(processCommentsError.message)}</CenteredContent>
          )}
          <CenteredContent>
            {processComments?.processComments.length ? (
              <Button
                variant="outlined"
                color="primary"
                onClick={loadMore}
                disabled={processCommentsLoading || !hasMoreRecord}
              >
                {t('search:search.load_more')}
              </Button>
            ) : <span />}
          </CenteredContent>
        </>
      )}
      <MenuList
        open={menuData.open}
        anchorEl={menuData.anchorEl}
        handleClose={menuData.handleClose}
        list={menuData.menuList}
      />
    </PageWrapper>
  );
}
