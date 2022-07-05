/* eslint-disable max-statements */
/* eslint-disable no-use-before-define */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-apollo';
import useMediaQuery from '@mui/material/useMediaQuery';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { makeStyles, useTheme } from '@mui/styles';
import { allCampaigns } from '../../../graphql/queries';
import { Spinner } from '../../../shared/Loading';
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
import SplitScreen from '../../../shared/SplitScreen';
import PageWrapper from '../../../shared/PageWrapper';

export default function CampaignList() {
  const classes = useStyles();
  const path = useLocation().pathname;
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const { id } = useParams();
  const history = useHistory();
  const limit = 50;
  const [offset, setOffset] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deletingCampaign, setDeletingCampaign] = useState(false);
  const [campaign, setCampaign] = useState(null);
  const [show, setShow] = useState(false);
  const [deleteCampaign] = useMutation(DeleteCampaign);
  const anchorElOpen = Boolean(anchorEl);
  const [deleteError, setDeleteError] = useState(null);
  const debouncedSearchText = useDebounce(searchText, 500);
  const { data, error, loading, refetch } = useQuery(allCampaigns, {
    variables: { limit, offset, query: debouncedSearchText },
    fetchPolicy: 'cache-and-network',
  });
  const { t } = useTranslation(['campaign', 'common']);

  const menuList = [
    {
      content: t('misc.open_campaign_details'),
      isAdmin: true,
      handleClick: () => openDetailsClick(),
      show: true,
    },
    {
      content: t('actions.delete_campaign'),
      isAdmin: true,
      handleClick: () => handleDeleteClick(),
      show: showMenu(),
    },
  ];

  const menuData = {
    menuList,
    anchorEl,
    handleMenu,
    open: anchorElOpen,
    handleMenuClose,
  };

  function handleMenu(event, camp) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setCampaign(camp);
  }

  function showMenu() {
    return campaign?.status === 'draft' || campaign?.status === 'scheduled';
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

  function openDetailsClick() {
    routeToAction(campaign.id);
    setAnchorEl(null);
  }

  function handleDelete() {
    setDeletingCampaign(true);
    deleteCampaign({
      variables: { id: campaign.id },
    })
      .then(() => {
        setDeletingCampaign(false);
        handleMenuClose();
        handleDeleteClick();
        refetch();
      })
      .catch(err => {
        setDeleteError(err.message);
      });
  }

  function routeToAction(camId) {
    history.push(`/campaign/${camId}`);
    setShow(true);
  }

  function handleCreateCampaign() {
    history.push(`/campaign/campaign-create`);
    setShow(true);
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

  useEffect(() => {
    if ((id || path === '/campaign-create') && !matches) {
      setShow(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) return <ErrorPage />;
  return (
    <PageWrapper pageTitle={t('campaign.campaigns')}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Grid container data-testid="container">
            {deleteError && (
              <CenteredContent>
                <p>{deleteError}</p>
              </CenteredContent>
            )}
            <Grid
              item
              lg={5}
              md={5}
              sm={12}
              xs={12}
              data-testid="campaign-list"
              className={classes.campaignList}
            >
              <Grid container>
                <Grid item sm={12} style={{ marginBottom: '20px' }}>
                  <Grid container>
                    <Grid item sm={10} xs={10} />
                    <Grid item sm={2} xs={2} style={{ textAlign: 'right' }}>
                      <Tooltip title={t('actions.new_campaign')} placement="top">
                        <IconButton
                          aria-label="new-campaign"
                          color="primary"
                          data-testid="new-campaign"
                          onClick={() => handleCreateCampaign()}
                          size="large"
                        >
                          <AddCircleIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item sm={12} xs={12} style={{ marginBottom: '20px' }}>
                  <SearchInput
                    filterRequired={false}
                    title={t('common:misc.campaigns')}
                    searchValue={searchText}
                    handleSearch={handleSearchText}
                    handleClear={() => setSearchText('')}
                    data-testid="search_input"
                  />
                </Grid>
                <Grid item lg={12} sm={12} md={12} xs={12}>
                  {data?.campaigns.length > 0 && (
                    <>
                      {openDeleteModal && (
                        <DeleteDialogueBox
                          open={openDeleteModal}
                          handleClose={handleDeleteClick}
                          handleAction={handleDelete}
                          title={t('campaign.campaign')}
                          action={t('common:menu.delete')}
                          loading={deletingCampaign}
                        />
                      )}
                      {data.campaigns.map(camp => (
                        <Fragment key={camp.id}>
                          <CampaignCard
                            camp={camp}
                            handleClick={() => routeToAction(camp.id)}
                            menuData={menuData}
                          />
                          <MenuList
                            open={
                              menuData.open &&
                              menuData?.anchorEl?.getAttribute('dataid') === camp.id
                            }
                            anchorEl={menuData.anchorEl}
                            handleClose={menuData.handleMenuClose}
                            list={menuData.menuList.filter(menuItem => menuItem.show)}
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
            </Grid>
            <Grid item lg={6} md={12} sm={12} xs={12}>
              <SplitScreen open={matches ? true : show}>
                <CampaignSplitScreen
                  campaignId={id}
                  campaignLength={data?.campaigns.length}
                  refetch={refetch}
                  setShow={setShow}
                />
              </SplitScreen>
            </Grid>
          </Grid>
        </>
      )}
    </PageWrapper>
  );
}

const useStyles = makeStyles(() => ({
  campaignList: {
    overflowX: 'hidden',
    overflowY: 'auto',
  },
}));
