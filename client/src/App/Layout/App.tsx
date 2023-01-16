
import { CssBaseline, Container, createTheme, ThemeProvider,  } from "@mui/material";
import { useState } from "react";
import Catalog from "../../Features/Catalog/Catalog";
import Header from "./Header";


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
        <CssBaseline />
        <Header darkModeChange={darkModeChange} darkMode={darkMode}></Header>
        <Container>
          <Catalog />
        </Container>
      </ThemeProvider>
  )
}

export default App;
