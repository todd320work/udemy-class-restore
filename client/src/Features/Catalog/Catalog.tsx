import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { Product } from "../../App/Models/Product";
import ProductList from "./ProductList";
import agent from "../../App/api/agent"
import LoadingComponent from "../../App/Layout/LoadingComponent";



 
export default function Catalog() {

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    
      // Add an Effect to fetch the products AFTER we render the component.
      // by adding an empty array of dependencies, we ensure this is only called once...
      useEffect( () => {
        agent.Catalog.list()
        .then(products => setProducts(products))
        .catch(error => console.log(error))
        .finally(() => setLoading(false))
      }, []);
    
      if( loading ) return <LoadingComponent message="Loading the catalog..."></LoadingComponent>

      return (
        <>
            <ProductList products={products} />
            <Button variant='contained' >Add Product</Button>
        </>
    )
}