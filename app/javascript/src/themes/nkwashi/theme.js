import { createMuiTheme } from '@material-ui/core'

// eslint-disable-next-line import/prefer-default-export
export const theme = themeColor =>  createMuiTheme({
  palette: {
    primary: {
      main: themeColor.primaryColor,
      dew: themeColor.secondaryColor
    },
    secondary: {
      main: themeColor.secondaryColor,
    },
  },
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: themeColor.primaryColor
      }
    },
    MuiPickersDay: {
      day: {
        color: themeColor.primaryColor
      },
      daySelected: {
        backgroundColor: themeColor.primaryColor
      },
      current: {
        color: themeColor.primaryColor
      }
    }
  }
})