import { createTheme } from "@mui/material";

const mode = localStorage.getItem('theme') ? localStorage.getItem('theme') : 'dark';

const theme = createTheme({
    palette: {
        mode: mode === 'dark' ? mode : 'light',
        primary: {
            main: '#f6b422'
        },
        secondary: {
            main: '#a67128'
        },
        text: {
            primary: '#fff',
            secondary: grey[500],
        }
    }
});

export default theme;