import { LoadingButton } from "@mui/lab";
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import { Product } from "../../App/Models/Product";
import { useAppDispatch, useAppSelector } from "../../App/store/configureStore";
import { addBasketItemAsync, StatusType } from "../Baskets/basketSlice";

   
interface Props {
    product: Product,
}

export default function ProductCard({product}: Props){
    const {status} = useAppSelector( state => state.basket);
    const dispatch = useAppDispatch();
        
    return (
        
        <Card>
            <CardHeader avatar={
                    <Avatar sx={{bgcolor: 'secondary.main'}}>
                        {product.name.charAt(0).toUpperCase()}
                    </Avatar>
                }
                title={product.name}
                titleTypographyProps={{
                    sx: {fontWeight: 'bold', color: 'secondary.main'}
                    }}
            />
            <CardMedia
                sx={{ height: 140 ,backgroundSize: 'contain', backgroundColor: 'primary.main' }}
                image={product.pictureUrl}
                title={product.name}
            />
            <CardContent>
                <Typography gutterBottom color="text.secondary" variant="h5" component="div">
                    ${(product.price / 100.0).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.brand} / {product.type}
                </Typography>
            </CardContent>
            <CardActions>
                {/* use pendingAddItem = ProductID so we ONLY affect one loading button, not all*/}
                <LoadingButton loading={status.state === StatusType.PendingAdd && status.productId === product.id} 
                    onClick={() => dispatch(addBasketItemAsync({productId: product.id}))}  
                    size="small">Add to Cart</LoadingButton>
                <Button component={Link} to={`/catalog/${product.id}`} size="small">View</Button>
            </CardActions>
      </Card>)
}