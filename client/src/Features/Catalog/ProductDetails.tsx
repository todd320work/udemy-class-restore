import { LoadingButton } from "@mui/lab";
import { Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material"
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import NotFound from "../../App/errors/NotFound";
import LoadingComponent from "../../App/Layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../App/store/configureStore";
import { removeBasketItemAsync, addBasketItemAsync, StatusType } from "../Baskets/basketSlice";
import { fetchProductByIdAsync, productSelectors } from "./catalogSlice";

export default function ProductDetails() {
    // Gets the parameter from the URL
    const {id} = useParams<{id: string}>();
    const {status: productStatus}  = useAppSelector( state => state.catalog);
    // redux state and dispatch mechanism needed
    const {basket, status} = useAppSelector( state => state.basket);
    const dispatch = useAppDispatch();
    const product = useAppSelector(state => productSelectors.selectById(state, id));
 

    // Data used to display the item if it's in the cart
    const [quantity, setQuantity] = useState(0);

    const item = basket?.items.find( obj => obj.product.id === product?.id);

    useEffect( () => {
        if (item) setQuantity(item.quantity);

        if( !product) dispatch(fetchProductByIdAsync(parseInt(id)));

    }, [dispatch, product, id, item])

    function handleInputChange(event: any){
        if (event.target.value >= 0)
        {
            setQuantity(parseInt(event?.target.value));
        }
    }
   
    function handleUpdateCart(){
        if( !item || quantity > item.quantity )
        {
            // if the item does not exist in our basket, just use quantity, otherwise, 
            // calculate the difference.
            const updatedQuantity = item ? quantity - item.quantity : quantity;
            dispatch(addBasketItemAsync({productId: product?.id!, quantity: updatedQuantity}));
        }
        else
        {
            // Subtraction Case.
            const updatedQuantity = item.quantity - quantity;
            dispatch(removeBasketItemAsync({productId: item.product.id, quantity: updatedQuantity}));
        }
    }

    if( productStatus.includes('pending') ) return <LoadingComponent message="Product is currently loading..." />
    if( !product ) return <NotFound />

    return( 
        <Grid container spacing={6}>
            <Grid item xs={6}>
                <img src={product.pictureUrl} alt={product.name} style={{width: '100%'}} />
            </Grid>
            <Grid item xs={6}>
                <Typography variant='h3'>{product.name}</Typography>
                <Typography variant='h4'>${(product.price/100.00).toFixed(2).toString()}</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell>{product.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>{product.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Brand</TableCell>
                                <TableCell>{product.brand}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Quantity In Stock</TableCell>
                                <TableCell>{product.quantityInStock}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Quantity In Cart</TableCell>
                                <TableCell>{}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            variant='outlined'
                            type='number'
                            label='Quantity in Cart'
                            fullWidth
                            value={quantity}
                            onChange={handleInputChange}
                            >

                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <LoadingButton 
                            disabled={(item && item.quantity === quantity) || (!item && quantity === 0)}
                            loading={status.state !== StatusType.Idle && status.productId === item!.productId}
                            onClick={handleUpdateCart}
                            sx={{height: '55px'}}
                            color='primary'
                            size='large'
                            variant='contained'
                            fullWidth
                        >
                            {item ? 'Update Quantity' : 'Add to Cart'}
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}