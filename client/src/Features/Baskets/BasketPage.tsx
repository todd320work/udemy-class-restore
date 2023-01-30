import { Add, Delete, Remove } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import BasketSummary from "./BasketSummary";
import { addBasketItemAsync, removeBasketItemAsync, StatusType } from "../../Features/Baskets/basketSlice";
import { useAppDispatch, useAppSelector } from "../../App/store/configureStore";

export default function BasketPage() {
    const dispatch = useAppDispatch();
    const {basket, status} = useAppSelector( state => state.basket);

    if (!basket) return <Typography variant='h3'>Your basket is empty...</Typography>

    return (
        <>
            {/* This is a comment. */}
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} >

                    <TableHead>
                        <TableRow>
                            <TableCell component="td" >Product</TableCell>    
                            <TableCell align="right">Price</TableCell>    
                            <TableCell align="center">Quantity</TableCell>    
                            <TableCell align="right">Subtotal</TableCell>    
                            <TableCell align="right">action...</TableCell>    
                        </TableRow>
                    </TableHead> 
                    <TableBody>
                        {basket.items.map( item => (
                            /* once we are inside, we are okay */
                            //More comments.
                            <TableRow
                                key={item.product.id}
                                sx={{ '&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell component="th" scope="row">
                                    <Box display='flex' alignItems='center'>
                                        <img src={item.product.pictureUrl} alt={item.product.name}  style={{height: 50, marginRight: 20}}/>
                                        <span>{item.product.name} ({item.product.id} and {item.product.id})</span>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">${(item.product.price/100).toFixed(2)}</TableCell>
                                <TableCell align="center">
                                    <LoadingButton loading={status.state === StatusType.PendingRemove && status.productId === item.product.id} color='error' 
                                                    onClick={() => dispatch(removeBasketItemAsync({productId: item.product.id,
                                                                                                   quantity: 1, 
                                                                                                   type: StatusType.PendingRemove
                                                                                                   })
                                                                            )
                                                            }
                                        >
                                        <Remove />
                                    </LoadingButton>
                                    {item.quantity}
                                    <LoadingButton loading={status.state === StatusType.PendingAdd && status.productId === item.product.id} color='secondary' 
                                                    onClick={() => dispatch(addBasketItemAsync({productId: item.product.id, quantity: 1}))}>
                                        <Add />
                                    </LoadingButton>
                                </TableCell>
                                <TableCell align="right">${(item.product.price * item.quantity / 100).toFixed(2)}</TableCell>
                                <TableCell align="right">
                                    <span>({item.product.id})</span>
                                    <LoadingButton loading={status.state === StatusType.PendingDelete && status.productId === item.product.id} color='error' 
                                                    onClick={() => dispatch( removeBasketItemAsync({productId: item.product.id, 
                                                                                                    quantity: item.quantity, 
                                                                                                    type: StatusType.PendingDelete}))}>
                                        <Delete />
                                    </LoadingButton>
                                </TableCell>

                            </TableRow>
                            ))
                        }
                        
                    </TableBody>
                </Table>


            </TableContainer> 
            <Grid container>
                <Grid item xs={6}></Grid>
                <Grid item xs={6}>
                    <BasketSummary />
                    <Button 
                        component={Link}
                        to='/checkout'
                        fullWidth
                        variant='contained'
                        size='large'
                    >
                        Checkout
                    </Button>

                </Grid>
            </Grid>
        </>
    )
             
}

