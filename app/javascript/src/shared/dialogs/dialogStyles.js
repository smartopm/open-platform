import { makeStyles } from '@material-ui/core/styles';

const useDialogStyles = makeStyles(theme => ({
    title: {
      color: theme.palette.primary.main,
      borderBottom: `1px ${theme.palette.primary.main} solid`
    },
    textField: {
      width: "100%"
    },
  }));

  export default useDialogStyles;