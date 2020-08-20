import { createMuiTheme } from '@material-ui/core'
import colors from './colors'

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.primary,
      contrastText: colors.textColor,
    },
    secondary: {
      main: colors.secondary,
      contrastText: colors.textColor,
    },
  },
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: colors.primary
      }
    },
    MuiPickersDay: {
      day: {
        color: colors.primary
      },
      daySelected: {
        backgroundColor: colors.primary
      },
      current: {
        color: colors.primary
      }
    },
    MuiPickersModal: {
      dialogAction: {
        color: colors.primary
      }
    }
  }
})
