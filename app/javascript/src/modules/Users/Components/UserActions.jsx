/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { useHistory } from 'react-router';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Divider from '@material-ui/core/Divider';
import SettingsIcon from '@material-ui/icons/Settings';
import HeadsetMicIcon from '@material-ui/icons/HeadsetMic';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider'

export default function UserAction() {
  const authState = useContext(AuthStateContext)
  const classes = useStyles();
  const history = useHistory()
  return (
    <div className={classes.body}>
      <Avatar alt="user_image" src={authState.user.imageUrl} className={classes.avatar} />
      <Typography className={classes.name}>{authState.user.name}</Typography>
      <UserOptions 
        icon={<AccountCircleIcon style={{height: '36px', width: '36px'}} />} 
        primaryText='Edit personal details' 
        secondaryText='Make changes to your account details'
        handleClick={() => history.push(`user/${authState.user.id}/edit`)} 
      />
      <Divider style={{marginLeft: '81px', marginBottom: '13px', height: '1px', color: '#ECECEC'}} />
      <UserOptions 
        icon={<SettingsIcon style={{height: '36px', width: '36px',}} />} 
        primaryText='Preferences' 
        secondaryText='Set notification preferences'
        handleClick={() => history.push('/settings')} 
      />
      <Divider style={{marginLeft: '81px', marginBottom: '13px', height: '1px', color: '#ECECEC'}} />
      <UserOptions 
        icon={<HeadsetMicIcon style={{height: '36px', width: '36px'}} />} 
        primaryText='Nkwashi support' 
        secondaryText='Have issues? Reach out to customer care'
        handleClick={() => history.push('/contact')} 
      />
      <Divider style={{marginLeft: '81px', marginBottom: '13px', height: '1px', color: '#ECECEC'}} />
      <UserOptions 
        icon={<ExitToAppIcon style={{height: '36px', width: '36px'}} />} 
        primaryText='Log out' 
        secondaryText='Sign out of your DoubleGDP account'
        handleClick={() => history.push('/logout')} 
      />
    </div>
  )
}

export function UserOptions({ icon, primaryText, secondaryText, handleClick}){
  const classes = useStyles();
  return (
    <div className={classes.options} onClick={handleClick}>
      <IconButton
        aria-label="icons"
        edge="start"
        className={classes.menuButton}
        data-testid="icons"
      >
        {icon}
      </IconButton>
      <div>
        <Typography className={classes.primaryText}>{primaryText}</Typography>
        <Typography className={classes.secondaryText}>{secondaryText}</Typography>
      </div>
    </div>
  )
}

const useStyles = makeStyles(() => ({
  body: {
    margin: '0 224px',
    background: '#FCFCFC',
    padding: '81px 0'
  },
  avatar: {
    width: '145px',
    height: '145px',
    marginLeft: '297px'
  },
  name: {
    padding: '29px 0 64px 0',
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 500,
    color: '#141414'
  },
  options: {
    display: 'flex',
    marginLeft: '116px',
    cursor: 'pointer'
  },
  primaryText: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#141414'
  },
  secondaryText: {
    fontSize: '14px',
    fontWeight: 400,
    color: '#141414'
  }
}));