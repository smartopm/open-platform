/* eslint-disable no-nested-ternary */
/* eslint-disable complexity */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Hidden from '@material-ui/core/Hidden';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import MoreVertOutlined from '@material-ui/icons/MoreVertOutlined';
import PhotoIcon from '@material-ui/icons/Photo';
import { Spinner } from '../../../shared/Loading';
import { dateTimeToString, dateToString } from '../../../components/DateContainer';
import { toTitleCase, objectAccessor } from '../../../utils/helpers';
import { LogLabelColors } from '../../../utils/constants';
import Card from '../../../shared/Card';
import { DetailsDialog } from '../../../components/Dialog';
import ImageUploadPreview from '../../../shared/imageUpload/ImageUploadPreview';
import MenuList from '../../../shared/MenuList';
import Text from '../../../shared/Text';
import CenteredContent from '../../../components/CenteredContent';

export default function LogEvents({
  data,
  loading,
  error,
  userType,
  handleExitEvent,
  handleAddObservation,
  routeToAction,
  enrollUser
}) {
  const [imageOpen, setImageOpen] = useState(false);
  const [id, setId] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [eventData, setEventData] = useState({});
  const open = Boolean(anchorEl);
  const matches = useMediaQuery('(max-width:800px)');
  const { t } = useTranslation('logbook');

  function handleClick(logId) {
    setId(logId);
    setImageOpen(true);
  }

  function exitEvent() {
    handleExitEvent(eventData, 'exit');
    setAnchorEl(null);
  }

  function handleObservation(evt) {
    handleAddObservation(evt);
    setAnchorEl(null);
  }

  function checkVisitorsName(entry) {
    const visitorName = entry.data.ref_name || entry.data.visitor_name || entry.data.name;
    return !!visitorName
  }

  const menuList = [
    {
      content: t('logbook.exit_log'),
      isAdmin: true,
      show: Boolean(eventData.entryRequest?.grantor) && eventData.data?.note !== 'Exited',
      handleClick: () => exitEvent()
    },
    {
      content: t('access_actions.grant_access'),
      isAdmin: true,
      show:
        Boolean(eventData.entryRequest) &&
        Boolean(!eventData.entryRequest?.grantor) &&
        eventData.data?.note !== 'Exited',
      handleClick: () => routeToAction(eventData)
    },
    {
      content: t('logbook.add_observation'),
      isAdmin: true,
      show: Boolean(!eventData.data?.note),
      handleClick: () => handleObservation(eventData)
    },
    {
      content: t('logbook.view_details'),
      isAdmin: true,
      show: true,
      handleClick: () => routeToAction(eventData)
    },
    {
      content: t('logbook.enroll_user'),
      isAdmin: true,
      show: true,
      handleClick: () => enrollUser(eventData)
    },
    {
      content: t('logbook.print_scan'),
      isAdmin: true,
      show: true,
      color: '#818188',
      handleClick: () => {}
    }
  ];

  function handleMenuList(list) {
    const listData = [];
    list.map(menu => menu.show && listData.push(menu));
    return listData;
  }

  function handleMenu(event, entry) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setEventData(entry);
  }

  function handleMenuClose(event) {
    event.stopPropagation();
    setAnchorEl(null);
  }

  const menuData = {
    menuList,
    handleMenu,
    anchorEl,
    open,
    userType,
    handleClose: event => handleMenuClose(event)
  };
  return (
    <div style={{ marginTop: '20px' }} data-testid="card">
      {error && <CenteredContent>{error}</CenteredContent>}
      {loading ? (
        <Spinner />
      ) : data?.length > 0 ? (
        data.map(entry => (
          <Card key={entry.id}>
            <Grid container spacing={1}>
              <Grid item md={4} xs={8}>
                {entry.entryRequest ? (
                  <>
                    <Typography variant="caption" color="primary" data-testid="name">
                      {entry.entryRequest?.name}
                    </Typography>
                    <br />
                    <Typography variant="caption">
                      {t('logbook.host')}
                      {' '}
                    </Typography>
                    <Link to={`/user/${entry.actingUser.id}`} data-testid="acting-user">
                      <Text color="secondary" content={entry.actingUser.name} />
                    </Link>
                    <br />
                    <Typography variant="caption" color="textSecondary" data-testid="note">
                      {entry.data?.note}
                    </Typography>
                  </>
                ) : (
                  <>
                    {checkVisitorsName(entry) && (
                      <>
                        <Link to={`/user/${entry.actingUser.id}`} data-testid="acting-user">
                          <Text color="secondary" content={entry.data.ref_name || entry.data.visitor_name || entry.data.name} />
                        </Link>
                        <br />
                      </>
                    )}
                    <Typography variant="caption" color="textSecondary">
                      {entry.data?.note}
                    </Typography>
                  </>
                )}
              </Grid>
              {(Boolean(entry.entryRequest) || entry.subject === 'user_temp') && (
                <Hidden mdUp>
                  <Grid item md={1} xs={4} style={{ textAlign: 'right' }}>
                    <IconButton
                      aria-controls="sub-menu"
                      aria-haspopup="true"
                      dataid={entry.id}
                      onClick={event => menuData.handleMenu(event, entry)}
                      data-testid="menu-list"
                    >
                      <MoreVertOutlined />
                    </IconButton>
                    <MenuList
                      open={
                        menuData?.open && menuData?.anchorEl?.getAttribute('dataid') === entry.id
                      }
                      anchorEl={menuData?.anchorEl}
                      userType={menuData?.userType}
                      handleClose={menuData?.handleClose}
                      list={handleMenuList(menuData?.menuList)}
                    />
                  </Grid>
                </Hidden>
              )}
              <Grid item md={7} xs={12} style={!matches ? { paddingTop: '7px' } : {}}>
                <Grid container spacing={1}>
                  <Grid item sm={2} md={3} style={!matches ? { paddingTop: '15px' } : {}}>
                    <Typography variant="caption" color="textSecondary" data-testid="created-at">
                      {dateToString(entry.createdAt)}
                    </Typography>
                  </Grid>
                  <Grid item sm={1} md={2} style={!matches ? { paddingTop: '15px' } : {}}>
                    <Typography variant="caption" color="textSecondary">
                      {dateTimeToString(entry.createdAt)}
                    </Typography>
                  </Grid>
                  <Grid item md={7} xs={12}>
                    <Grid container>
                      {(entry.subject === 'user_entry' || entry.subject === 'user_temp' || entry.subject === 'visitor_entry')  && (
                      <Chip
                        data-testid="user-entry"
                        label={t('logbook.user_entry')}
                        style={{ background: '#D1D229', color: 'white', marginRight: '16px' }}
                      />
                      )}
                      {entry.entryRequest?.grantor && entry.data.note !== 'Exited' && (
                        <Chip
                          data-testid="granted-access"
                          label={t('logbook.granted_access')}
                          style={{ background: '#77B08A', color: 'white', marginRight: '16px' }}
                        />
                      )}
                      {entry.data.note === 'Exited' && (
                        <Chip
                          label={t('logbook.exit_logged')}
                          style={{ background: '#C4584F', color: 'white', marginRight: '16px' }}
                        />
                      )}
                      {entry.subject === 'observation_log' && (
                        <Chip
                          label={t('logbook.observation')}
                          style={{ background: '#EBC64F', color: 'white', marginRight: '16px' }}
                          data-testid="observation"
                        />
                      )}
                      {entry.entryRequest && entry.data.note !== 'Exited' && (
                        <Chip
                          label={toTitleCase(entry.entryRequest?.reason)}
                          style={{
                            background: objectAccessor(LogLabelColors, entry.entryRequest?.reason),
                            color: 'white'
                          }}
                        />
                      )}
                      {entry.imageUrls && (
                        <Grid item sm={1} md={1} data-testid="image-area">
                          <IconButton color="primary" onClick={() => handleClick(entry.id)}>
                            <PhotoIcon />
                          </IconButton>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {(Boolean(entry.entryRequest) || entry.subject === 'user_temp')  && (
                <Hidden smDown>
                  <Grid item md={1} style={{ textAlign: 'right' }}>
                    <IconButton
                      aria-controls="sub-menu"
                      aria-haspopup="true"
                      dataid={entry.id}
                      onClick={event => menuData.handleMenu(event, entry)}
                      data-testid="menu-list"
                    >
                      <MoreVertOutlined />
                    </IconButton>
                    <MenuList
                      open={
                        menuData?.open && menuData?.anchorEl?.getAttribute('dataid') === entry.id
                      }
                      anchorEl={menuData?.anchorEl}
                      userType={menuData?.userType}
                      handleClose={menuData?.handleClose}
                      list={handleMenuList(menuData?.menuList)}
                    />
                  </Grid>
                </Hidden>
              )}
            </Grid>
            {imageOpen && (
              <DetailsDialog
                open={entry.id === id && imageOpen}
                handleClose={() => setImageOpen(false)}
                title="Attached Images"
              >
                <ImageUploadPreview imageUrls={entry.imageUrls} sm={6} xs={6} imgHeight="300px" />
              </DetailsDialog>
            )}
          </Card>
        ))
      ) : (
        <CenteredContent data-testid="no-logs">{t('logbook.no_logs')}</CenteredContent>
      )}
    </div>
  );
}

LogEvents.defaultProps = {
  error: ''
};

LogEvents.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  userType: PropTypes.string.isRequired,
  handleAddObservation: PropTypes.func.isRequired,
  handleExitEvent: PropTypes.func.isRequired,
  routeToAction: PropTypes.func.isRequired,
  enrollUser: PropTypes.func.isRequired,
  error: PropTypes.string
};
