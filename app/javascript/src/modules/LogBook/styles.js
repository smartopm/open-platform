import { makeStyles } from '@material-ui/styles';

const useLogbookStyles = makeStyles(theme => ({
  avatar: {
    color: theme.palette.getContrastText(theme.palette.secondary.main),
    backgroundColor: theme.palette.secondary.main,
    width: 90,
    height: 90
  },
  chipAlign: {
    marginTop: 11,
  },
  chipRootAlign: {    
    '@media (max-width: 899px)': {
      marginLeft: '1.5% !important'
    }
  },
  moreOptionButton: {
    marginLeft: '30%'
  },
  timeDetails: {
    '@media (max-width: 390px)': {
      paddingLeft: '29px !important'
    }
  },
  guestName: {
    marginLeft: -14,
  },
  avatarTimeSection: {
    '@media (max-width: 1199px)': {
      marginBottom: '8px !important'
    }
  }
}));

export default useLogbookStyles;
