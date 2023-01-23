

import { CssBaseline, Container, createTheme, ThemeProvider,  } from "@mui/material";
import { useState } from "react";
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AboutPage from "../../Features/About/AboutPage";
import Catalog from "../../Features/Catalog/Catalog";
import ProductDetails from "../../Features/Catalog/ProductDetails";
import ContactPage from "../../Features/Contact/ContactPage";
import HomePage from "../../Features/Home/HomePage";
import Header from "./Header";
import 'react-toastify/dist/ReactToastify.css'
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";


function App() {
  // Controls if the user wants light/dark mode
  const [darkMode, setDarkMode] = useState(false);

  const paletteType = darkMode ? 'dark' : 'light';

  const theme = createTheme({
    palette: { 
      mode: paletteType, 
      background: {
        default: darkMode ? '#121213' : '#eaeaea' /* just a nice light gray, but use a darker color in dark mode*/
      }
    }
  })

  

  function darkModeChange()  {
    setDarkMode( !darkMode);
  }
  return (
      <ThemeProvider theme={theme}>
        <ToastContainer position='bottom-right' hideProgressBar theme='colored'/>
        <CssBaseline />
        <Header darkModeChange={darkModeChange} darkMode={darkMode}></Header>
        <Container>
          <Switch>
            <Route path='/server-error' component={ServerError} />
            <Route path='/catalog/:id' component={ProductDetails} />
            <Route path='/about' component={AboutPage} />
            <Route path='/contact' component={ContactPage} />
            <Route exact path='/catalog' component={Catalog} />
            <Route exact path='/' component={HomePage} />
            <Route component={NotFound} />
          </Switch>
        </Container>
      </ThemeProvider>
  )
}

export default App;
