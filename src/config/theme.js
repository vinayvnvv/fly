import { createTheme, responsiveFontSizes } from '@mui/material';

export const theme = options => {
  const { mode } = options || {};
  const _theme = createTheme({
    palette: {
      mode: mode || 'light',
      background: {
        default: mode === 'dark' ? '#000' : '#f8f9fa',
      },
      primary: {
        main: '#5a50eb',
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
    // breakpoints: {
    //   values: {
    //     xs: 0,
    //     sm: 600,
    //     md: 1000,
    //     lg: 1300,
    //     xl: 1536,
    //   },
    // },
    typography: {
      fontFamily: ['"Open Sans", sans-serif'],
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
      MuiTab: {
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
