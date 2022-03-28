import { makeStyles } from '@mui/styles';

const useLogbookStyles = makeStyles(theme => ({
  avatar: {
    color: theme.palette.getContrastText(theme.palette.secondary.main),
    backgroundColor: theme.palette.secondary.main,
    width: 90,
    height: 90
  },
  statCard: {
    backgroundColor: theme.palette.secondary.main,
    color: '#FFFFFF',
    height: '80%'
  },
  chipAlign: {
    marginTop: 11,
  },
  chipRootAlign: {    
    '@media (max-width: 899px)': {
      marginLeft: '1.5% !important'
    }
  },
  actionSection: {
    '@media (max-width: 388px)': {
      marginRight: '-16px !important'
    }
  },
  moreOptionButton: {
    '@media (max-width: 388px)': {
      marginRight: '-23px !important'
    }
  },
  timeDetails: {
    '@media (max-width: 390px)': {
      paddingLeft: '5% !important'
    }
  },
  guestName: {
    marginLeft: -14,
  },
  avatarTimeSection: {
    whiteSpace: 'nowrap',
    '@media (max-width: 1199px)': {
      marginBottom: '8px !important'
    }
  }
}));

export default useLogbookStyles;
