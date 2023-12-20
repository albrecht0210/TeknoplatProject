import { ThemeProvider } from '@emotion/react';
import { SnackbarProvider } from 'notistack';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import { useEffect } from 'react';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <CssBaseline />
        {/* <UrlPaths /> */}
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
