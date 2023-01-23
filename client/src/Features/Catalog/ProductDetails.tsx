import { Grid, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material"
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import agent from "../../App/api/agent";
import NotFound from "../../App/errors/NotFound";
import LoadingComponent from "../../App/Layout/LoadingComponent";
import { Product } from "../../App/Models/Product";

export default function ProductDetails() {
    debugger;
    const {id} = useParams<{id: string}>();

    // This data will be to store the product retrieved from the DB.
    // for the type of state returned, it's either a PRoduct, OR, 
    // it hasn't been defined yet, so it's null...
    const [product, setProduct] = useState<Product | null>(null);

    // This will be a boolean used to determine if the page is loading, or has finished loading.
    const [loading, setLoading] = useState<boolean>(true);

    useEffect( () => {
        agent.Catalog.details(parseInt(id))
            .then( response => setProduct(response))
            .catch( error => console.log(error))
            .finally( () => setLoading(false));

    }, [id])

    if( loading ) return <LoadingComponent message="Product is currently loading..." />
    if( !product ) return <NotFound />

    return( 
        <Grid container spacing={6}>
            <Grid item xs={6}>
                <img src={product.pictureUrl} alt={product.name} style={{width: '100%'}} />
            </Grid>
            <Grid item xs={6}>
                <Typography variant='h3'>{product.name}</Typography>
                <Typography variant='h4'>${(product.price/100.00).toFixed(2).toString()}</Typography>
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

                    </TableBody>

                </Table>
            </Grid>
        </Grid>
    )
}