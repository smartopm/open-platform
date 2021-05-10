/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTranslation } from 'react-i18next'
import Avatar from '@material-ui/core/Avatar';
import { useHistory } from 'react-router';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Divider from '@material-ui/core/Divider';
import SettingsIcon from '@material-ui/icons/Settings';
import HeadsetMicIcon from '@material-ui/icons/HeadsetMic';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider'

export default function UserAction() {
  const authState = useContext(AuthStateContext)
  const matches = useMediaQuery('(max-width:600px)')
  const classes = useStyles();
  const history = useHistory()
  const { t } = useTranslation(['users', 'common'])
  return (
    <div className={matches ? classes.bodyMobile : classes.body}>
      <Avatar alt="user_image" data-testid='avatar' src={authState?.user?.imageUrl} className={matches ? classes.avatarMobile : classes.avatar} />
      <Typography data-testid='text' className={matches ? classes.nameMobile : classes.name}>{authState?.user?.name}</Typography>
      <UserOptions 
        icon={<AccountCircleIcon style={{height: '36px', width: '36px'}} />} 
        primaryText={t('users.personal_details')} 
        secondaryText={t('users.personal_details_subtext')}
        handleClick={() => history.push(`user/${authState.user.id}/edit`)} 
      />
      <Divider className={matches ? classes.dividerMobile : classes.divider} />
      <UserOptions 
        icon={<SettingsIcon style={{height: '36px', width: '36px',}} />} 
        primaryText={t('users.preferences')} 
        secondaryText={t('users.preferences_subtext')}
        handleClick={() => history.push('/settings')} 
      />
      <Divider className={matches ? classes.dividerMobile : classes.divider} />
      <UserOptions 
        icon={<HeadsetMicIcon style={{height: '36px', width: '36px'}} />} 
        primaryText={t('users.support', { communityName: authState?.user?.community.name })}  
        secondaryText={t('users.support_subtext')}
        handleClick={() => history.push('/contact')} 
      />
      <Divider className={matches ? classes.dividerMobile : classes.divider} />
      <UserOptions 
        icon={<ExitToAppIcon style={{height: '36px', width: '36px'}} />} 
        primaryText={t('common:menu.logout')} 
        secondaryText={t('users.logout_subtext')}
        handleClick={() => history.push('/logout')} 
      />
    </div>
  )
}

export function UserOptions({ icon, primaryText, secondaryText, handleClick}){
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:600px)')
  return (
    <div className={matches ? classes.optionsMobile : classes.options} data-testid="options" onClick={handleClick}>
      <IconButton
        aria-label="icons"
        edge="start"
        className={classes.menuButton}
        data-testid="icons"
      >
        {icon}
      </IconButton>
      <div>
        <Typography data-testid="title" className={classes.primaryText}>{primaryText}</Typography>
        <Typography data-testid="caption" className={classes.secondaryText}>{secondaryText}</Typography>
      </div>
    </div>
  )
}

const useStyles = makeStyles(() => ({
  body: {
    margin: '0 224px',
    background: '#FCFCFC',
    padding: '81px 0',
    marginTop: '-40px'
  },
  avatar: {
    width: '145px',
    height: '145px',
    marginLeft: '297px'
  },
  avatarMobile: {
    height: '71px',
    width: '71px',
    marginLeft: '135px'
  },
  name: {
    padding: '29px 0 64px 0',
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 500,
    color: '#141414'
  },
  nameMobile: {
    padding: '14px 0 25px 0',
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
  optionsMobile: {
    display: 'flex',
    marginLeft: '20px',
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
  },
  bodyMobile: {
    margin: '0 20px'
  },
  divider: {
    marginLeft: '81px', 
    marginBottom: '13px', 
    height: '1px', 
    color: '#ECECEC'
  },
  dividerMobile: {
    marginLeft: '20px', 
    marginBottom: '13px', 
    height: '1px', 
    color: '#ECECEC'
  }
}));

UserOptions.propTypes = {
  icon: PropTypes.node.isRequired,
  primaryText: PropTypes.string.isRequired,
  secondaryText: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired
};