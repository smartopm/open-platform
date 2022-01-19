/* eslint-disable max-statements */
/* eslint-disable no-use-before-define */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useState } from 'react';
import { useQuery, useMutation } from 'react-apollo';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { allCampaigns } from '../../../graphql/queries';
import Loading from '../../../shared/Loading';
import ErrorPage from '../../../components/Error';
// import CampaignDeleteAction from "./CampaignDeleteAction"
import CenteredContent from '../../../shared/CenteredContent';
import Paginate from '../../../components/Paginate';
import SearchInput from '../../../shared/search/SearchInput';
import useDebounce from '../../../utils/useDebounce';
import { DeleteCampaign } from '../../../graphql/mutations';
import MenuList from '../../../shared/MenuList';
import CampaignCard from './CampaignCard';
import CampaignSplitScreen from './CampaignSplitScreen';

export default function CampaignList() {
  const classes = useStyles();
  const history = useHistory();
  const limit = 50;
  const [offset, setOffset] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [campaign, setCampaign] = useState(null);
  const [deleteCampaign] = useMutation(DeleteCampaign);
  const anchorElOpen = Boolean(anchorEl);
  const debouncedSearchText = useDebounce(searchText, 500);
  const { data, error, loading, refetch } = useQuery(allCampaigns, {
    variables: { limit, offset, query: debouncedSearchText },
    fetchPolicy: 'cache-and-network'
  });
  const { t } = useTranslation(['campaign', 'common']);

  const menuList = [
    {
      content: t('misc.open_campaign_details'),
      isAdmin: true,
      handleClick: () => routeToAction()
    },
    {
      content: t('actions.delete_campaign'),
      isAdmin: true,
      handleClick: () => handleDeleteClick()
    }
  ];

  const menuData = {
    menuList,
    anchorEl,
    handleMenu,
    open: anchorElOpen,
    handleMenuClose
  };

  function handleMenu(event, camp) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setCampaign(camp);
  }

  function handleMenuClose(event) {
    event.stopPropagation();
    setAnchorEl(null);
    setCampaign(null);
  }

  function handleSearchText(e) {
    setSearchText(e.target.value);
  }

  function handleDeleteClick() {
    setOpenModal(!openModal);
  }

  function handleDelete() {
    deleteCampaign({
      variables: { id: campaign.id }
    }).then(() => {
      handleMenuClose();
      handleDeleteClick();
      refetch();
    });
  }

  function routeToAction() {
    return history.push(`/campaign/${campaign.id}`);
  }
  function routeToCreateCampaign() {
    return history.push('/campaign-create');
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

  if (loading) return <Loading />;
  if (error) return <ErrorPage />;
  return (
    <Grid container>
      <Grid item sm={5}>
        <div className="container">
          <Grid container>
            <Grid item sm={12} style={{marginBottom: '20px'}}>
              <Grid container>
                <Grid item sm={12}>
                  <Typography variant='h4'>Campaigns</Typography>
                </Grid>
                <Grid item sm={12}>
                  <Typography variant='body2'>Communicate with the community.</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item sm={12}>
              {data.campaigns.length > 0 ? (
                <>
                  {/* {openModal && (
              <CampaignDeleteDialogue handleClose={handleDeleteClick} handleDelete={handleDelete} open={openModal} /> 
            )} */}
                  <div style={{ marginBottom: '20px' }}>
                    <SearchInput
                      filterRequired={false}
                      title={t('common:misc.campaigns')}
                      searchValue={searchText}
                      handleSearch={handleSearchText}
                      handleClear={() => setSearchText('')}
                      data-testid="search_input"
                    />
                  </div>
                  {data.campaigns.map(camp => (
                    <Fragment key={camp.id}>
                      <CampaignCard camp={camp} menuData={menuData} />
                      <MenuList
                        open={menuData.open && menuData?.anchorEl?.getAttribute('dataid') === camp.id}
                        anchorEl={menuData.anchorEl}
                        handleClose={menuData.handleMenuClose}
                        list={menuData.menuList.filter(menuItem => menuItem.content !== null)}
                      />
                    </Fragment>
                  ))}

                  <br />
                  <CenteredContent>
                    <Paginate
                      offSet={offset}
                      limit={limit}
                      active={offset >= 1}
                      handlePageChange={paginate}
                    />
                  </CenteredContent>
                  <Fab
                    variant="extended"
                    color="primary"
                    style={{
                      position: 'fixed',
                      bottom: 24,
                      right: 57,
                      color: 'white'
                    }}
                    onClick={() => {
                      routeToCreateCampaign();
                    }}
                  >
                    <AddIcon /> 
                    {' '}
                    {t('common:menu.create')}
                  </Fab>
                </>
              ) : (
                // TODO add translation
                <p> No campaigns have been created yet</p>
              )}
            </Grid>
          </Grid>
        </div>
      </Grid>
      <Grid item sm={7} />
    </Grid>
  );
}

const useStyles = makeStyles(() => ({
  campaignBody: {
    maxWidth: '42ch',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    paddingLeft: '3px'
  },
  campaignBodyMobile: {
    maxWidth: '17ch',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    paddingLeft: '3px'
  }
}));
