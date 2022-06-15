import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs, Grid, Typography } from '@mui/material';
import { Link , useHistory, useLocation } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { useQuery, useMutation } from 'react-apollo';
import { formatError } from '../../../utils/helpers';
import CenteredContent from '../../../shared/CenteredContent';
import Paginate from '../../../components/Paginate';
import { Spinner } from '../../../shared/Loading';
import { ProcessTemplatesQuery } from '../graphql/process_list_queries';
import ProcessItem from './ProcessItem';
import MenuList from '../../../shared/MenuList';
import SpeedDial from '../../../shared/buttons/SpeedDial';
import { ActionDialog } from '../../../components/Dialog';
import { ProcessDeleteMutation } from '../graphql/process_list_mutation';
import MessageAlert from '../../../components/MessageAlert';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import PageWrapper from '../../../shared/PageWrapper';

export default function ProcessList() {
  const classes = useStyles();
  const { t } = useTranslation(['process', 'common']);
  const limit = 50;
  const [anchorEl, setAnchorEl] = useState(null);
  const [offset, setOffset] = useState(0);
  const anchorElOpen = Boolean(anchorEl);
  const authState = useContext(AuthStateContext);
  const [isDialogOpen, setOpen] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const [processItem, setProcessItem] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [info, setInfo] = useState({ loading: false, error: false, message: '' });
  const [processDelete] = useMutation(ProcessDeleteMutation);

  const { data, loading, error, refetch } = useQuery(ProcessTemplatesQuery, {
    variables: {
      offset,
      limit
    },
    fetchPolicy: 'cache-and-network'
  });

  useEffect(() => {
    if (location?.state?.from === '/processes/templates/edit') {
      refetch();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.state?.from, refetch])

  function isPermitted(permission) {
    if (!authState) return false;
    const userPermissionsModule = authState.user?.permissions.find(permissionObject => permissionObject.module === 'process');
    if (!userPermissionsModule){
      return false;
    }
    return userPermissionsModule?.permissions?.includes(permission)
  }


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

  const menuList = [
    {
      content: isPermitted('can_update_process_template') ? t('common:menu.edit_process_template') : null,
      isAdmin: true,
      handleClick: () => handleEditProcessTemplate()
    },
    {
      content: isPermitted('can_delete_process_template') ? t('common:menu.delete_process_template') : null,
      isAdmin: true,
      handleClick: () => handleDeleteProcessTemplate()
    }
  ];

  const menuData = {
    menuList,
    anchorEl,
    handleMenu,
    open: anchorElOpen,
    handleClose
  };

  function handleEditProcessTemplate() {
    history.push({
      pathname: '/processes/templates/edit',
      state: { process: processItem }
    });
  }

  function handleDeleteProcessTemplate() {
    setOpen(!isDialogOpen);
    setAnchorEl(null)
  }

  function handleProcessDelete() {
    processDelete({
      variables: { id: processItem?.id }
    })
    .then(() => {
      setInfo({
        ...info,
        message: t('templates.process_deleted'),
        loading: false,
      });
      setAlertOpen(true);
      setOpen(!isDialogOpen);
      refetch()
    })
    .catch(err => {
      setInfo({
        ...info,
        error: true,
        message: formatError(err.message),
      });
      setAlertOpen(true);
    })
  }

  function handleMenu(event, process) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setProcessItem(process);
  }

  function handleClose(event) {
    event.stopPropagation();
    setAnchorEl(null);
  }

  if (error) return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  if (loading) return <Spinner />;

  return (
    <PageWrapper>
      <div>
        <Grid container spacing={1}>
          <Grid item md={12} xs={12} style={{ paddingLeft: '10px' }}>
            <div role="presentation">
              <Breadcrumbs aria-label="breadcrumb" style={{ paddingBottom: '10px' }}>
                <Link to="/processes">
                  <Typography color="primary" style={{ marginLeft: '5px' }}>
                    {t('breadcrumbs.processes')}
                  </Typography>
                </Link>
                <Typography color="text.primary">{t('breadcrumbs.template_list')}</Typography>
              </Breadcrumbs>
            </div>
          </Grid>
          <Grid container>
            <Grid item md={11} xs={10} className={classes.header}>
              <Grid container>
                <Grid item md={9} xs={10}>
                  <Typography variant="h4" style={{ marginLeft: '5px', marginBottom: '24px' }}>
                    {t('templates.template_list')}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              item
              md={1}
              xs={2}
              data-testid="template-speed-dial"
              style={{ marginTop: '-20px' }}
            >
              <SpeedDial handleAction={() => history.push('/processes/templates/create')} />
            </Grid>
          </Grid>
        </Grid>
        {data?.processTemplates?.length > 0 ? (
          <div>
            {data.processTemplates.map(process => (
              <div key={process.id}>
                <ProcessItem key={process?.id} process={process} menuData={menuData} />
              </div>
            ))}
          </div>
        ) : (
          <CenteredContent>{t('templates.no_template_list')}</CenteredContent>
        )}
        <CenteredContent>
          <Paginate
            count={data?.processTemplates?.length}
            offSet={offset}
            limit={limit}
            active={offset > 1}
            handlePageChange={paginate}
          />
        </CenteredContent>

        <MessageAlert
          type={info.error ? 'error' : 'success'}
          message={info.message}
          open={alertOpen}
          handleClose={() => setAlertOpen(false)}
        />

        <ActionDialog
          open={isDialogOpen}
          handleClose={handleDeleteProcessTemplate}
          handleOnSave={handleProcessDelete}
          message={t('templates.process_delete_confirmation_message')}
        />
      </div>

      <MenuList
        open={menuData.open}
        anchorEl={menuData.anchorEl}
        handleClose={menuData.handleClose}
        list={menuData.menuList.filter(menuItem => menuItem.content !== null)}
      />
    </PageWrapper>
  );
}

const useStyles = makeStyles({
  header: {
    marginBottom: '10px'
  }
});
