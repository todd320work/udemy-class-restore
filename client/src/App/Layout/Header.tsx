import { AppBar, Switch, Toolbar, Typography } from "@mui/material";

interface Props {
    darkModeChange : () => void,
    darkMode : boolean,
}

export default function Header( {darkModeChange, darkMode}: Props){

    return ( 
        <AppBar position='static' sx={{mb:4}}>
            <Toolbar>
                <Typography variant='h6'>RE-STORE!</Typography>
                <Switch checked={darkMode}  onChange={darkModeChange}/>
            </Toolbar>
         </AppBar>)
}