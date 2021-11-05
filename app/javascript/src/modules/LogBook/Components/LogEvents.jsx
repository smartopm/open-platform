/* eslint-disable complexity */
import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import MoreVertOutlined from '@material-ui/icons/MoreVertOutlined';
import PhotoIcon from '@material-ui/icons/Photo';
import { Spinner } from '../../../shared/Loading';
import { dateTimeToString, dateToString } from '../../../components/DateContainer';
import Label from '../../../shared/label/Label';
import { toTitleCase, objectAccessor } from '../../../utils/helpers';
import { LogLabelColors } from '../../../utils/constants';
import Card from '../../../shared/Card';
import { DetailsDialog } from '../../../components/Dialog';
import ImageUploadPreview from '../../../shared/imageUpload/ImageUploadPreview';
import MenuList from '../../../shared/MenuList';
import Text from '../../../shared/Text';

export default function LogEvents({
  data,
  loading,
  error,
  refetch,
  userType,
  handleExitEvent,
  handleAddObservation
}) {
  const [imageOpen, setImageOpen] = useState(false);
  const [id, setId] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [eventData, setEventData] = useState({});
  const open = Boolean(anchorEl);

  function handleClick(logId) {
    setId(logId);
    setImageOpen(true);
  }

  function exitEvent() {
    handleExitEvent(eventData, 'exit');
    setAnchorEl(null);
  }

  const menuList = [
    {
      content: 'Log Exit',
      isAdmin: true,
      handleClick: () => exitEvent()
    },
    {
      content: 'Grant Access',
      isAdmin: true,
      handleClick: () => {}
    },
    {
      content: 'Block',
      isAdmin: true,
      handleClick: () => {}
    },
    {
      content: 'Add Observation',
      isAdmin: true,
      handleClick: () => handleAddObservation(eventData)
    },
    {
      content: 'User details',
      isAdmin: true,
      handleClick: () => {}
    },
    {
      content: 'Print Scan',
      isAdmin: true,
      handleClick: () => {}
    }
  ];

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
    <div style={{marginTop: '20px'}}>
      {loading ? (
        <Spinner />
      ) : (
        data.map(entry => (
          <>
            <Card key={entry.id}>
              <Grid container spacing={1}>
                <Grid item md={4}>
                  {entry.entryRequest ? (
                    <>
                      <Typography variant='caption' color="primary">
                        {entry.entryRequest?.name}
                      </Typography>
                      <br />
                      <Typography variant='caption'>Host: </Typography>
                      <Link to={`/user/${entry.actingUser.id}`}>
                        <Text color='secondary' content={entry.actingUser.name}  />
                      </Link>
                      <br />
                      <Typography variant='caption' color="textSecondary">{entry.data?.note}</Typography>
                    </>
                  ) : (
                    <Typography variant='caption' color="textSecondary">{entry.data?.note}</Typography>
                  )}
                </Grid>
                <Grid item md={7} style={{ paddingTop: '7px' }}>
                  <Grid container spacing={1}>
                    <Grid item md={2} style={{ paddingTop: '15px' }}>
                      <Typography variant='caption' color="textSecondary">{dateToString(entry.createdAt)}</Typography>
                    </Grid>
                    <Grid item md={1} style={{ paddingTop: '15px' }}>
                      <Typography variant='caption' color="textSecondary">
                        {dateTimeToString(entry.createdAt)}
                      </Typography>
                    </Grid>
                    <Grid item md={9}>
                      <Grid container spacing={1}>
                        {entry.entryRequest?.grantor && entry.data.note !== 'Exited' && (
                          <Grid item md={6}>
                            <Label title="Granted Access" color="#77B08A" />
                          </Grid>
                        )}
                        {entry.data.note === 'Exited' && (
                          <Grid item md={6}>
                            <Label title="Exit Logged" color="#C4584F" />
                          </Grid>
                        )}
                        {entry.subject === 'observation_log' && (
                          <Grid item md={5}>
                            <Label title="Observation" color="#EBC64F" />
                          </Grid>
                        )}
                        {entry.imageUrls && (
                          <Grid item md={1}>
                            <IconButton color="primary" onClick={() => handleClick(entry.id)}>
                              <PhotoIcon />
                            </IconButton>
                          </Grid>
                        )}
                        {entry.entryRequest && entry.data.note !== 'Exited' && (
                          <Grid item md={6}>
                            <Label
                              title={toTitleCase(entry.entryRequest?.reason)}
                              color={objectAccessor(LogLabelColors, entry.entryRequest?.reason)}
                            />
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={1}>
                  <IconButton
                    aria-controls="sub-menu"
                    aria-haspopup="true"
                    dataid={entry.id}
                    onClick={event => menuData.handleMenu(event, entry)}
                  >
                    <MoreVertOutlined />
                  </IconButton>
                  <MenuList
                    open={menuData?.open && menuData?.anchorEl?.getAttribute('dataid') === entry.id}
                    anchorEl={menuData?.anchorEl}
                    userType={menuData?.userType}
                    handleClose={menuData?.handleClose}
                    list={menuData?.menuList}
                  />
                </Grid>
              </Grid>
            </Card>
            {imageOpen && (
              <DetailsDialog
                open={entry.id === id && imageOpen}
                handleClose={() => setImageOpen(false)}
                title="Attached Images"
              >
                <ImageUploadPreview imageUrls={entry.imageUrls} sm={6} xs={6} imgHeight="300px" />
              </DetailsDialog>
            )}
          </>
        ))
      )}
    </div>
  );
}
