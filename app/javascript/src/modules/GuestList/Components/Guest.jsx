import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';
import { Grid, IconButton, Typography } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Box from '@material-ui/core/Box';
import { checkRequests } from '../../LogBook/utils';
import { dateToString, dateTimeToString } from '../../../components/DateContainer';
import Label from '../../../shared/label/Label';
import DataList from '../../../shared/list/DataList';
import MenuList from '../../../shared/MenuList'
import Text from '../../../shared/Text';

export default function Guest({guestListEntry, handleGuestDetails, handleGuestRevoke}) {
  const [anchorEl, setAnchorEl] = useState(null)
  const anchorElOpen = Boolean(anchorEl)
  const { t } = useTranslation(['logbook', 'common'])
  const menuList = [
    { content: t('common:menu.revoke_access'), handleClick: () => handleGuestRevoke({guestListEntryId: guestListEntry.id}) },
    { content: t('common:menu.more_details'), handleClick: () => handleGuestDetails({guestListEntryId: guestListEntry.id}) }
  ];

  const guestListHeaders = [
    { title: 'Guest Name', col: 1 },
    { title: 'Start of Visit', col: 4},
    { title: 'End of Visit', col: 4 },
    { title: 'validity', col: 1 },
    { title: 'Menu', col: 2}
  ]

  const menuData = {
    menuList,
    anchorEl,
    handleGuestMenu,
    open: anchorElOpen,
    handleClose,
  }
  
  function handleGuestMenu(event){
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  function handleClose(event) {
    event.stopPropagation()
    setAnchorEl(null)
  }

  return(
    <DataList
      key={guestListEntry.id}
      keys={guestListHeaders}
      hasHeader={false}
      clickable
      data={renderGuestData(
        guestListEntry,
        menuData,
        t
      )}
    />
  );
}


export function renderGuestData(guestListEntry, menuData, translate) {
  return [
    {
      'Guest Name': (
        <Grid item xs={12} sm={2} md={2} pl={10} data-testid="guest_name">
          <Box pl={2}>
            <Typography color="primary">
              {guestListEntry.name}
            </Typography>
          </Box>
        </Grid>
      ),
      
      'Start of Visit': (
        <Grid item xs={12} sm={2} md={3} style={{fontSize: '12px'}} data-testid="start_of_visit">
          <Text 
            content={translate('logbook:guest_book.start_on_date_time', { date: dateToString(guestListEntry.startTime), time: dateTimeToString(guestListEntry.startTime) })} 
          />
        </Grid>
      ),


      'End of Visit': (
        <Grid item xs={12} sm={2} md={3} style={{fontSize: '12px'}} data-testid="end_of_visit">
          <Text 
            content={guestListEntry.endTime ? translate('logbook:guest_book.ends_on_date_time', { date: dateToString(guestListEntry.endTime), time: dateTimeToString(guestListEntry.startTime)  }) : '-'} 
          />
        </Grid>
      ),
      validity: (
        <Grid item xs={12} sm={2} md={2} data-testid="validity">
          <Box sx={{ width: '50%' }}>
            <Label title={checkRequests(guestListEntry, translate).title} color={checkRequests(guestListEntry, translate).color} />
          </Box>
        </Grid>
      ),
      Menu: (
        <Grid item xs={12} sm={2} md={2} style={{ textAlign: 'center'}} data-testid="menu">
          <IconButton
            aria-controls="simple-menu"
            aria-haspopup="true"
            data-testid="guest-list-menu"
            onClick={(event) => menuData.handleGuestMenu(event)}
          >
            <MoreHorizIcon />
          </IconButton>
          <MenuList
            open={menuData.open}
            anchorEl={menuData.anchorEl}
            handleClose={menuData.handleClose}
            list={menuData.menuList}
          />
        </Grid>
      )
    }
  ];
}

Guest.propTypes = {
  handleGuestDetails: PropTypes.func.isRequired,
  handleGuestRevoke: PropTypes.func.isRequired,
  guestListEntry: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    startTime: PropTypes.string,
    visitationDate:  PropTypes.string,
    visitEndDate:  PropTypes.string,
    occursOn: PropTypes.arrayOf(PropTypes.string),
    user: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      userType: PropTypes.string,
    })
  }).isRequired
}