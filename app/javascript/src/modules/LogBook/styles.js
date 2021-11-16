import { makeStyles } from '@material-ui/styles';

const useLogbookStyles = makeStyles((theme) => ({
    avatar: {
      color: theme.palette.getContrastText(theme.palette.primary.main),
      backgroundColor: theme.palette.primary.main,
      width: 90,
      height: 90
    },
  }));

  export default useLogbookStyles