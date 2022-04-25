import { createTheme } from '@mui/material';

export const defaultColors = {
  primaryColor: '#69ABA4',
  secondaryColor: '#cf5628',
  error: '#D15249',
  info: '#598EC1',
  success: '#67B388',
  white: "#FFFFFF"
};
// eslint-disable-next-line import/prefer-default-export
export function theme(communityThemeColor) {

  const themeColor = communityThemeColor || defaultColors;

  return createTheme({
    palette: {
      primary: {
        main: themeColor.primaryColor,
        dew: themeColor.secondaryColor
      },
      secondary: {
        main: themeColor.secondaryColor
      },
      success: {
        main: '#67B388',
        contrastText: '#fff',
      },
      warning: {
        main: '#F3D158',
        contrastText: '#fff',
      },
      error: {
        main: '#D15249',
        contrastText: '#fff',
      },
      info: {
        main: '#598EC1',
        contrastText: '#fff',
      },
      default: {
        main: '#FDFDFD',
        contrastText: '#fff',
      }
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
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
  });
}
