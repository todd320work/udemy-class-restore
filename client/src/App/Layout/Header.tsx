import { ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Box, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { Link, NavLink } from "react-router-dom";

import { useAppSelector } from "../store/configureStore";

interface Props {
    darkModeChange : () => void,
    darkMode : boolean,
}
const midLinks = [
    {title: 'catalog', path: '/catalog'},
    {title: 'about', path: '/about'},
    {title: 'contact', path: '/contact'},
]
const rightLinks = [
    {title: 'login', path: '/login'},
    {title: 'register', path: '/register'},
]

const linksSXProps = 
{
    color: 'inherit', 
    textDecoration: 'none',
    typography: 'h6',
    // &: does what?
    // &. does what?? 
    '&:hover': { color: 'grey.500'}, 
    '&.active': { color: 'text.secondary'},
}


export default function Header( {darkModeChange, darkMode}: Props){
    const {basket} = useAppSelector( state => state.basket);

    const basketCount = basket?.items.reduce( (sum, item) => sum + item.quantity, 0 );
    
    return ( 
        <AppBar position='static' sx={{mb:4}}>
            <Toolbar
                sx={{
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    }}>
                <Box display='flex' alignItems='center'>
                    <Typography 
                        variant='h6'
                        component={NavLink}
                        to='/'
                        sx={{color: 'inherit', textDecoration: 'none'}}>
                        RE-STORE!
                    </Typography>
                    <Switch checked={darkMode}  onChange={darkModeChange}/>
                </Box>

                <Box>
                    <List sx={{display: 'flex'}}>
                        {
                            midLinks.map((item) => (
                                <ListItem 
                                    component={NavLink}
                                    to={item.path}
                                    key={item.path}
                                    sx={linksSXProps}
                                >
                                    {item.title}
                                </ListItem>
                            ))
                        }
                    </List>
                </Box>
                <Box display='flex' alignItems='center'>
                    <IconButton component={Link} to='/basket' size='large' sx={{ color: 'inherit'}} >
                        <Badge badgeContent={basketCount} color='secondary'>
                            <ShoppingCart />
                        </Badge>
                    </IconButton>
                    <List sx={{display: 'flex'}}>
                        {
                            rightLinks.map((item) => (
                                <ListItem 
                                    component={NavLink}
                                    to={item.path}
                                    key={item.path}
                                    sx={linksSXProps}
                                >
                                    {item.title}
                                </ListItem>
                            ))
                        }
                    </List>
                </Box>
            </Toolbar>
         </AppBar>)
}