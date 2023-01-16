import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { Product } from "../../App/Models/Product";
import ProductList from "./ProductList";




 
export default function Catalog() {

    const [products, setProducts] = useState<Product[]>([]);

    
      // Add an Effect to fetch the products AFTER we render the component.
      // by adding an empty array of dependencies, we ensure this is only called once...
      useEffect( () => {
        fetch('http://localhost:5000/products').then( response => response.json()).then( data => setProducts(data))
      }, []);
    

      return (
        <>
            <ProductList products={products} />
            <Button variant='contained' >Add Product</Button>
        </>
    )
}