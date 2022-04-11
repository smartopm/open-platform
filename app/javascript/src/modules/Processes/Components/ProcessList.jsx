import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs, Grid, Typography } from '@mui/material';
import { Link , useHistory } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { useQuery } from 'react-apollo';
import { formatError } from '../../../utils/helpers';
import CenteredContent from '../../../shared/CenteredContent';
import Paginate from '../../../components/Paginate';
import { Spinner } from '../../../shared/Loading';
import ProcessTemplatesQuery from '../graphql/process_list_queries';
import ProcessItem from './ProcessItem';
import MenuList from '../../../shared/MenuList';
import SpeedDial from '../../../shared/buttons/SpeedDial';


export default function ProcessList() {
  const classes = useStyles();
  const { t } = useTranslation(['process', 'common']);
  const limit = 50;
  const [anchorEl, setAnchorEl] = useState(null);
  const [offset, setOffset] = useState(0);
  const anchorElOpen = Boolean(anchorEl);
  const canEditProcess = true; // TODO: Check the edit permission in the next ticket
  const history = useHistory();

  const { data, loading, error } = useQuery(ProcessTemplatesQuery, {
    variables: {
      offset,
      limit
    },
    fetchPolicy: 'cache-and-network'
  });

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
      content: canEditProcess ? t('common:menu.edit_process_template') : null,
      isAdmin: true,
      handleClick: () => {}
    }
  ];

  const menuData = {
    menuList,
    anchorEl,
    handleMenu,
    open: anchorElOpen,
    handleClose
  };

  function handleMenu(event) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }

  function handleClose(event) {
    event.stopPropagation();
    setAnchorEl(null);
  }

  if (error) return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  if (loading) return <Spinner />;

  return (
    <>
      <div className="container">
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
              <SpeedDial handleAction={() => history.push('/processes/templates/new')} />
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
      </div>

      <MenuList
        open={menuData.open}
        anchorEl={menuData.anchorEl}
        handleClose={menuData.handleClose}
        list={menuData.menuList.filter(menuItem => menuItem.content !== null)}
      />
    </>
  );
}

const useStyles = makeStyles({
  header: {
    marginBottom: '10px'
  }
});
