import { createMuiTheme } from '@material-ui/core';

// eslint-disable-next-line import/prefer-default-export
export function theme(communityThemeColor) {
  const defaultColors = {
    primaryColor: '#69ABA4',
    secondaryColor: '#cf5628'
  };

  const themeColor = communityThemeColor || defaultColors;

  return createMuiTheme({
    palette: {
      primary: {
        main: themeColor.primaryColor,
        dew: themeColor.secondaryColor
      },
      secondary: {
        main: themeColor.secondaryColor
      }
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
  });
}
