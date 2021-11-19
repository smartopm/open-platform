import { makeStyles } from '@material-ui/styles';

const useLogbookStyles = makeStyles((theme) => ({
    avatar: {
      color: theme.palette.getContrastText(theme.palette.secondary.main),
      backgroundColor: theme.palette.secondary.main,
      width: 90,
      height: 90
    },
  }));

  export default useLogbookStyles