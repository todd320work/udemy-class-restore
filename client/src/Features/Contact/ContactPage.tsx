import { Button, ButtonGroup, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../App/store/configureStore";
import { decrement, increment } from "./counterSlice";


export default function Contactpage(){
    const dispatch = useAppDispatch();
    const theState = useAppSelector( state => state.counter);
    return( 
        <>
            <Typography variant='h2'>Contacts go here</Typography>
            <Typography variant='h2'>{theState.title} - {theState.data}</Typography>
            <ButtonGroup>
                <Button onClick={() => dispatch(decrement(1))} variant='contained' color='error'>Decre</Button>
                <Button onClick={() => dispatch(increment(1))} variant='contained' color='primary'>INC</Button>
                <Button onClick={() => dispatch(increment(5))} variant='contained' color='secondary'>INC 5</Button>
                
                
            </ButtonGroup>
        </>
    )
}