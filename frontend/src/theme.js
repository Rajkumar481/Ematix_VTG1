// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  },  
  palette: {
    primary: {
      main: '#ff5733', 
    },
    secondary: {
      main: '#ff4081', 
    },
    background: {
      default: '#f4f6f8',
    },
  },
});

export default theme;
