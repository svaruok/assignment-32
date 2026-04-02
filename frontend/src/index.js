import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { Toaster } from 'react-hot-toast';

const Root = () => {
  return (
    <ThemeProvider theme={theme}>
      <Toaster position="top-right" />
      <App />
    </ThemeProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root />);
