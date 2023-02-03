import { Grid } from "@mui/material";
import { Product } from "../../App/Models/Product";
import { useAppSelector } from "../../App/store/configureStore";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

interface Props {
    products: Product[];
    
}
export default function ProdutList(props: Props){
    const {productsLoaded} = useAppSelector(state => state.catalog); 
    
    return (
    <Grid container spacing={4}>
        {props.products.map((prod) => (
            
            <Grid item xs={4} key={prod.id}>
                {!productsLoaded ? (<ProductCardSkeleton />) : (<ProductCard product={prod}/>) }
            </Grid>
            ))}
    </Grid>)
}