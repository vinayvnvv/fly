import { createTheme, responsiveFontSizes } from '@mui/material';
const GoogleBold = new URL(
  './../assets/fonts/GoogleSans-Bold.ttf',
  import.meta.url,
).href;
const GoogleMedium = new URL(
  './../assets/fonts/GoogleSans-Medium.ttf',
  import.meta.url,
).href;
const GoogleRegular = new URL(
  './../assets/fonts/GoogleSans-Regular.ttf',
  import.meta.url,
).href;

export const theme = options => {
  const { mode } = options || {};
  const _theme = createTheme({
    palette: {
      mode: mode || 'light',
      background: {
        default: mode === 'dark' ? '#000' : '#f8f9fa',
      },
      primary: {
        // main: '#5a50eb',
        main: '#357095',
        dark: '#1c3f56',
      },
      error: {
        main: '#ff5722',
        light: '#ff5722',
        dark: '#d4603b',
      },
      text: {
        primary: mode === 'light' ? '#222' : '#bbb',
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 1000,
        lg: 1300,
        xl: 1536,
      },
    },
    typography: {
      fontFamily: ['"Open Sans", sans-serif'],
      // fontFamily: ['Google'],
      body1: {
        fontSize: '0.9rem',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          // Name of the slot
          root: {
            textTransform: 'initial',
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: `
        @font-face {
          font-family: 'Google';
          src:  url('${GoogleBold}');
                url('${GoogleBold}');
          font-weight: 500;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Google';
          src:  url('${GoogleRegular}');
                url('${GoogleRegular}');
          font-weight: 300;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Google';
          src:  url('${GoogleMedium}');
                url('${GoogleMedium}');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
    `,
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'initial',
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            textTransform: 'initial',
          },
        },
      },
    },
  });
  return responsiveFontSizes(_theme);
};
