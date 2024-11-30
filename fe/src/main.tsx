import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}> {/* i have made changes here 29/11: */}
    <BrowserRouter>
    {/* <CssBaseline /> */}
    <App />
    </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
