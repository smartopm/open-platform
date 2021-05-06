import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider'

export default function UserAction() {
  const authState = useContext(AuthStateContext)
  const classes = useStyles();
  return (
    <div className={classes.body}>
      <Avatar alt="user_image" src={authState.user.imageUrl} className={classes.avatar} />
      <Typography>{authState.user.name}</Typography>
      <UserOptions icon={<AccountCircleIcon />} primaryText='Edit personal details' secondaryText='Make changes to your account details' />
    </div>
  )
}

export function UserOptions({ icon, primaryText, secondaryText}){
  const classes = useStyles();
  return (
    <div>
      <IconButton
        aria-label="icons"
        edge="start"
        className={classes.menuButton}
        data-testid="icons"
      >
        {icon}
      </IconButton>
      <Typography>{primaryText}</Typography>
      <Typography>{secondaryText}</Typography>
    </div>
  )
}

const useStyles = makeStyles(() => ({
  body: {
    margin: '0 224px',
    background: '#FCFCFC',
    paddingTop: '81px'
  },
  avatar: {
    width: '145px',
    height: '145px',
    marginLeft: '297px'
  },
  name: {
    margin: '29px 278px 64px 0',
    fontSize: '24px',
    fontWeight: 500,
    color: '#141414'
  },
  menuButton: {
    
  }
}));