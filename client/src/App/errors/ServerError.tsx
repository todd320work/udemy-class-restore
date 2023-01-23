import { Button, Container, Divider, Paper, Typography } from "@mui/material";
import { useHistory, useLocation } from "react-router";


export default function ServerError() {
    const history = useHistory();
    const {state} = useLocation<any>();
    
    return( 
        <Container component={Paper}>
            <Typography variant='h5' gutterBottom> Server Error </Typography>
            {
                state?.error ? (
                    <>
                        <Typography variant='h3' color='error' gutterBottom>{state.error.title} </Typography>
                        <Divider></Divider>
                        <Typography variant='h6' gutterBottom>{state.error.detail || 'Internal Server Error'}</Typography>
                    </>
                ) : (
                    <Typography variant='h6' gutterBottom>Server error detial blank.</Typography>
                )
            }
            <Button onClick={() => history.push('/catalog')}>Go Back to the Store</Button>
        </Container>
    )
}