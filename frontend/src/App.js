import { ThemeProvider } from '@emotion/react';
import { SnackbarProvider } from 'notistack';
import { CssBaseline, createTheme } from '@mui/material';
import UrlPaths from './router';
import { RootThemeContext } from './context/RootThemeContext';
import { useState } from 'react';
import { grey } from '@mui/material/colors';

function App() {
  const mode = localStorage.getItem("theme") ? localStorage.getItem("theme") : "dark";

  const [darkMode, setDarkMode] = useState(mode === "dark" ? true : false);

  const theme = createTheme({
    palette: {
        mode: darkMode ? "dark" : "light",
        primary: {
            light: "#fbd483",
            dark: "#f6b422",
            main: "#f6b422"
        },
        // secondary: {
        //     main: "#a67128"
        // },
        text: {
            primary: darkMode ? "#fff" : "#000",
            secondary: darkMode ? grey[500] : grey[700],
        }
    }
});

  return (
    <RootThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <CssBaseline />
          <UrlPaths />
        </SnackbarProvider>
      </ThemeProvider>
    </RootThemeContext.Provider>
  );
}

export default App;
