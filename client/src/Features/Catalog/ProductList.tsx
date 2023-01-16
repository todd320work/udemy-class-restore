import { Grid } from "@mui/material";
import { Product } from "../../App/Models/Product";
import ProductCard from "./ProductCard";

interface Props {
    products: Product[];
    
}
export default function ProdutList(props: Props){
    return (
    <Grid container spacing={3}>
        {props.products.map((prod) => (
            <Grid item xs={4} key={prod.id}>
                <ProductCard product={prod} />
            </Grid>
            ))}
    </Grid>)
}