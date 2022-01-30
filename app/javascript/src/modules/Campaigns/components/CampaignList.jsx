/* eslint-disable max-statements */
/* eslint-disable no-use-before-define */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useState } from 'react';
import { useQuery, useMutation } from 'react-apollo';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { allCampaigns } from '../../../graphql/queries';
import Loading from '../../../shared/Loading';
import ErrorPage from '../../../components/Error';
import CenteredContent from '../../../shared/CenteredContent';
import Paginate from '../../../components/Paginate';
import SearchInput from '../../../shared/search/SearchInput';
import useDebounce from '../../../utils/useDebounce';
import { DeleteCampaign } from '../../../graphql/mutations';
import MenuList from '../../../shared/MenuList';
import CampaignCard from './CampaignCard';
import CampaignSplitScreen from './CampaignSplitScreen';
import DeleteDialogueBox from '../../../shared/dialogs/DeleteDialogue';

export default function CampaignList() {
  const classes = useStyles();
  const { id } = useParams()
  const history = useHistory();
  const limit = 50;
  const [offset, setOffset] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deletingCampaign, setDeletingCampaign] = useState(false);
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
      handleClick: () => routeToAction(campaign.id)
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

  function handleMenuClose() {
    setAnchorEl(null);
    setCampaign(null);
  }

  function handleSearchText(e) {
    setSearchText(e.target.value);
  }

  function handleDeleteClick() {
    setOpenDeleteModal(!openDeleteModal);
  }

  function handleDelete() {
    setDeletingCampaign(true);
    deleteCampaign({
      variables: { id: campaign.id }
    }).then(() => {
      setDeletingCampaign(false);
      handleMenuClose();
      handleDeleteClick();
      refetch();
    });
  }

  function routeToAction(camId) {
    return history.push(`/campaign/${camId}`);
  }

  function handleCreateCampaign() {
    history.push(`/campaign/campaign-create`);
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
      <Grid item sm={5} className={classes.campaignList}>
        <div className="container">
          <Grid container>
            <Grid item sm={12} style={{ marginBottom: '20px' }}>
              <Grid container>
                <Grid item sm={10}>
                  <Typography variant="h4">Campaigns</Typography>
                </Grid>
                <Grid item sm={2} style={{ textAlign: 'right' }}>
                  <Tooltip title="New Campaign" placement="top">
                    <IconButton
                      aria-label="new-campaign"
                      color="primary"
                      onClick={() => handleCreateCampaign()}
                    >
                      <AddCircleIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item sm={12}>
                  <Typography variant="body2">Communicate with the community.</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item sm={12} style={{ marginBottom: '20px' }}>
              <SearchInput
                filterRequired={false}
                title={t('common:misc.campaigns')}
                searchValue={searchText}
                handleSearch={handleSearchText}
                handleClear={() => setSearchText('')}
                data-testid="search_input"
              />
            </Grid>
            <Grid item sm={12}>
              {data?.campaigns.length > 0 && (
                <>
                  {openDeleteModal && (
                    <DeleteDialogueBox
                      open={openDeleteModal}
                      handleClose={handleDeleteClick}
                      handleAction={handleDelete}
                      title="Campaign"
                      action="delete"
                      loading={deletingCampaign}
                    />
                  )}
                  {data.campaigns.map(camp => (
                    <Fragment key={camp.id}>
                      <CampaignCard
                        camp={camp}
                        handleClick={() =>  routeToAction(camp.id)}
                        menuData={menuData}
                      />
                      <MenuList
                        open={
                          menuData.open && menuData?.anchorEl?.getAttribute('dataid') === camp.id
                        }
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
                </>
              )}
            </Grid>
          </Grid>
        </div>
      </Grid>
      <Grid item sm={7} className={classes.splitScreen}>
        <CampaignSplitScreen
          campaignId={id}
          campaignLength={data?.campaigns.length}
          refetch={refetch}
        />
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles(() => ({
  splitScreen: {
    background: '#FAFAFA',
    height: '92vh',
    marginTop: '-20px',
    // position: 'absolute',
    right: 0,
    width: '100%',
    overflowX: 'hidden',
    overflowY: 'auto'
  },
  campaignList: {
    overflowX: 'hidden',
    overflowY: 'auto',
  }
}));
