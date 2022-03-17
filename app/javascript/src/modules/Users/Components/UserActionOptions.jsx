import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next'
import makeStyles from '@mui/styles/makeStyles';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import UserAvatar from "./UserAvatar";
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';

export default function UserActionOptions(){
  const authState = useContext(AuthStateContext);
  const [open, setOpen] = useState(false)
  const classes = useStyles();
  const { t } = useTranslation('users')
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();

  function handleOpen(e) {
    setAnchorEl(e.currentTarget)
    setOpen(true)
  }

  function handleClose() {
    setAnchorEl(null)
    setOpen(false)
  }

  function handleMenuItemLink(to){
    history.push(to)
    return handleClose()
  }

  return (
    <div className={classes.menuButton} data-testid="avatar_menu">
      <UserAvatar
         // eslint-disable-next-line react/prop-types
        imageUrl={authState?.user?.imageUrl}
        handleOpenMenu={handleOpen}
      />
      <Popover open={open} anchorEl={anchorEl} onClose={handleClose} className={classes.popOver}>
        <Typography data-testid='user_settings' align="center" className={classes.logOut} gutterBottom onClick={() => handleMenuItemLink('/user/settings')}>
          {t('common:menu.user_settings')}
        </Typography>
        <Typography data-testid='my_profile' align="center" className={classes.logOut} gutterBottom onClick={() => handleMenuItemLink(`/user/${authState?.user?.id}`)}>
          {t('common:menu.my_profile')}
        </Typography>
        <Typography data-testid='logout' align="center" className={classes.logOut} gutterBottom onClick={() => handleMenuItemLink('/logout')}>
          {t('common:menu.logout')}
        </Typography>
      </Popover>
    </div>
  )
}

const useStyles = makeStyles(() => ({
  menuButton: {
    cursor: 'pointer',
    position: 'absolute',
    bottom: 4,
    right: -31,
    height: '40px'
  },
  logOut: {
    margin: '20px',
    cursor: 'pointer'
  },
  popOver: {
    marginTop: '30px'
  }
}));