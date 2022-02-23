import { makeStyles } from '@material-ui/styles';

const useLogbookStyles = makeStyles(theme => ({
  avatar: {
    color: theme.palette.getContrastText(theme.palette.secondary.main),
    backgroundColor: theme.palette.secondary.main,
    width: 90,
    height: 90
  },
  chipAlign: {
    paddingTop: 12
  },
  moreOptionButton: {
    marginLeft: '38%'
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
    '@media (max-width: 390px)': {
      marginBottom: '8px !important'
    }
  }
}));

export default useLogbookStyles;
