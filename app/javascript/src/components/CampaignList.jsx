/* eslint-disable no-use-before-define */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useState } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { useQuery, useMutation } from 'react-apollo'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import { useHistory } from 'react-router-dom'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { useTranslation } from 'react-i18next';
import { allCampaigns } from '../graphql/queries'
import Loading from "../shared/Loading"
import ErrorPage from "./Error"
import { dateToString } from "./DateContainer"
import CampaignDeleteAction from "./Campaign/CampaignDeleteAction"
import CenteredContent from '../shared/CenteredContent'
import Paginate from './Paginate'
import SearchInput from '../shared/search/SearchInput'
import useDebounce from '../utils/useDebounce'
import { makeStyles } from '@material-ui/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { IconButton } from '@material-ui/core'
import Card from '../shared/Card';
import Hidden from '@material-ui/core/Hidden';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CampaignDeleteDialogue from './Campaign/CampaignDeleteDialogue';
import { DeleteCampaign } from '../graphql/mutations';
import MenuList from '../shared/MenuList';

export default function CampaignList() {
  const history = useHistory();
  const limit = 50;
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:800px)');
  const [offset, setOffset] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);;
  const [openModal, setOpenModal] = useState(false);
  const [campaign, setCampaign] = useState(null);
  const [deleteCampaign] = useMutation(DeleteCampaign);
  const anchorElOpen = Boolean(anchorEl);
  const debouncedSearchText = useDebounce(searchText, 500);
  const { data, error, loading, refetch } = useQuery(allCampaigns, {
    variables: { limit, offset, query: debouncedSearchText },
    fetchPolicy: 'cache-and-network'
  })
  const { t } = useTranslation(['campaign', 'common']);

  let menuList = [
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

  function handleMenu(event, campaign) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setCampaign(campaign);
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
    setOpenModal(!openModal)
  }

  function handleDelete() {
    deleteCampaign({
      variables: { id: campaign.id }
    }).then(() => {
      handleMenuClose();
      handleDeleteClick();
      refetch();
    })
  }

  function routeToAction() {
    return history.push(`/campaign/${campaign.id}`)
  }
  function routeToCreateCampaign() {
    return history.push('/campaign-create')
  }

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) {
        return
      }
      setOffset(offset - limit)
    } else if (action === 'next') {
      setOffset(offset + limit)
    }
  }

  if (loading) return <Loading />
  if (error) return <ErrorPage />
  return (
    data.campaigns.length > 0 ? ( 
    <div className="container">
      {openModal && (
      <CampaignDeleteDialogue handleClose={handleDeleteClick} handleDelete={handleDelete} open={openModal} /> 
      )}
      <SearchInput
        filterRequired={false}
        title={t('common:misc.campaigns')}
        searchValue={searchText}
        handleSearch={handleSearchText}
        handleClear={() => setSearchText('')}
        data-testid="search_input"
      />
      {data.campaigns.map(camp => (
        <Fragment key={camp.id}>
          <div>
            <Card styles={{marginBottom: 0}} contentStyles={{ padding: '4px' }}>
              <Grid container spacing={2}>
                <Grid item md={5} xs={10} style={{ display: 'flex', alignItems: 'center' }} data-testid="task_body_section">
                  <Grid item md={8} xs={4}>
                    <Typography variant="body2" component="span">
                      {camp.batchTime ? dateToString(camp.batchTime) : 'Never '}
                    </Typography>
                  </Grid>
                  <Grid item md={8} xs={4}>
                    <Typography
                      variant="body2"
                      data-testid="campaign_name"
                      component="p"
                      className={matches ? classes.campaignBodyMobile : classes. campaignBody}
                    >
                      {camp.name}
                    </Typography>
                  </Grid>
                  <Grid item md={1} xl={1}>
                    <Hidden smDown>
                      <IconButton
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        data-testid="campaign-item-menu"
                        dataid={camp.id}
                        onClick={event => menuData.handleMenu(event, camp)}
                        color="primary"
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Hidden>
                  </Grid>
                </Grid>
              </Grid>
            </Card>
            <MenuList
              open={menuData.open}
              anchorEl={menuData.anchorEl}
              handleClose={menuData.handleMenuClose}
              list={menuData.menuList.filter(menuItem => menuItem.content !== null)}
            />
          </div>

          {/* <div className="border-top my-3" /> */}
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
          color: 'white',
        }}
        onClick={() => {
          routeToCreateCampaign()
        }}
      >
        <AddIcon />
        {' '}
        {t('common:menu.create')}
      </Fab>
    </div>
    ) : (
      // TODO add translation
      <p> No campaigns have been created yet</p>
    )
  )
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
  },
}));

