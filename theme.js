import {createMuiTheme} from '@material-ui/core/styles';

// Create a theme instance.
const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#484848',
            main: '#212121',
            dark: '#000000',
            contrastText: '#ffffff',
        },
        secondary: {
            light: '#7b5e57',
            main: '#4e342e',
            dark: '#260e04',
            contrastText: '#ffffff',
        },
        error: {
            main: '#b70f0a',
        },
        background: {
            default: '#fff',
            light: "#f2f2f2"
        },
    },
});

export default theme;
