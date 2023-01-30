import { Button } from "@mui/material";
import ProductList from "./ProductList";
import LoadingComponent from "../../App/Layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../App/store/configureStore";
import { fetchProductsAsync, productSelectors } from "./catalogSlice";
import { useEffect } from "react";

export default function Catalog() {
  const products = useAppSelector(productSelectors.selectAll);
  const dispatch = useAppDispatch();
  const {productsLoaded, status} = useAppSelector(state => state.catalog);  
  
    
      // Add an Effect to fetch the products AFTER we render the component.
      // by adding an empty array of dependencies, we ensure this is only called once...
      useEffect( () => {
        if( !productsLoaded) dispatch(fetchProductsAsync());

      }, [productsLoaded, dispatch]);
    
      if( status.includes('pending')) return <LoadingComponent message="Loading the catalog..."></LoadingComponent>

      return (
        <>
            <ProductList products={products} />
            <Button variant='contained' >Add Product</Button>
        </>
    )
}