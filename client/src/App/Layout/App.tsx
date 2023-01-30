

import { CssBaseline, Container, createTheme, ThemeProvider,  } from "@mui/material";
import { useEffect, useState } from "react";
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
import BasketPage from "../../Features/Baskets/BasketPage";
import { getCookie } from "../utilities/util";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";
import CheckoutPage from "../../Features/Baskets/CheckoutPage";
import { useAppDispatch } from "../store/configureStore";
import { setBasket } from "../../Features/Baskets/basketSlice";


function App() {
  const dispatch = useAppDispatch();
  
  // loading flag to indicate the state of whether or not we have finished the query
  // to get the basket state...
  const [loading, setLoading] = useState(true);

  useEffect( () => {
    const buyerId = getCookie('buyerID');
    if( buyerId) {
      agent.Basket.get()
        .then( basket => dispatch(setBasket(basket)))
        .catch( error => console.log(error))
        .finally( () => setLoading(false));
    }
    else
      setLoading(false);
  }, [dispatch] )
  
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

  if( loading ) {
    return <LoadingComponent message='Initializing app...' />
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
            <Route path='/basket'  component={BasketPage} />
            <Route path='/checkout' component={CheckoutPage} />
            <Route exact path='/catalog' component={Catalog} />
            <Route exact path='/' component={HomePage} />
            <Route component={NotFound} />
          </Switch>
        </Container>
      </ThemeProvider>
  )
}

export default App;
