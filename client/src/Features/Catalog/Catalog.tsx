import { Grid, Paper } from "@mui/material";
import ProductList from "./ProductList";
import { useAppDispatch, useAppSelector } from "../../App/store/configureStore";
import { fetchFilters, fetchProductsAsync, productSelectors, setProductParams } from "./catalogSlice";
import { useEffect } from "react";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../App/Component/RadioButtonGroup";
import CheckBoxList from "../../App/Component/CheckBoxList";
import PaginationCombo from "../../App/Component/PaginationCombo";

const sortOptions = [
  {value: 'name', label: 'Alphabetical'},
  {value: 'price Desc', label: 'Price - High to Low'},
  {value: 'price', label: 'Price - Low to High'},
  {value: 'type', label: 'Type - Ascending'},
  {value: 'type desc', label: 'Type - Descending'},
  {value: 'brand', label: 'Brand - Ascending'},
  {value: 'brand desc', label: 'Brand - Descending'},

]


export default function Catalog() {
      const products = useAppSelector(productSelectors.selectAll);
      const dispatch = useAppDispatch();
      const {productsLoaded, filtersLoaded, brands, types, productParams, metaData} = useAppSelector(state => state.catalog);  
  
      // Need to convert types and brands into something generic?
      const typeArray = types.map( (item: any) => item.Type );
      const brandArray = brands.map( (item: any) => item.Brand );

      const handleBrandChange = ( itemsSelected: string[] ) => 
      {
        // when changing brands, we should now reset the pagination to page 0.  
        dispatch(setProductParams({brands: itemsSelected, pageNumber: 0}))
      }
      
      const handleTypeChange = ( itemsSelected: string[] ) => 
      {
        // When changing types, we should reset the page to 0, otherwise, 
        // the new filter affects the number of records returned, so we should reset page to 0
        dispatch(setProductParams({types: itemsSelected, pageNumber: 0}))
      }

      // Add an Effect to fetch the products AFTER we render the component.
      // by adding an empty array of dependencies, we ensure this is only called once...
      useEffect( () => {
        if( !productsLoaded) dispatch(fetchProductsAsync());
      }, [productsLoaded, dispatch]);

      // Split the useEffects to ensusre we don't duplicate calls.
      useEffect( () => {
        if( !filtersLoaded) dispatch(fetchFilters())

      }, [dispatch, filtersLoaded]);
    
      const handlePageChange = (event: any, page: number) => {
        dispatch(setProductParams({pageNumber: page-1}));
      }

      return (
        <Grid container columnSpacing={4} >

            <Grid item xs={3} /> {/* The first 3 are for the search/sorting/filtering options, the other 9 are for our components */}
            <Grid item xs={9} sx={{marginBottom: 2}} > {/*I would like this to be flexible bassed upon mobile or not, so that's something to research */}
              { metaData && /* only display pagination if we have metadata */
               <PaginationCombo handlePageChange={handlePageChange} metaData={metaData} />
              }
            </Grid>

            <Grid item xs={3} sx={{paddingLeft: 0, paddingTop: 0}}>
                <Paper sx={{mb: 2}}>
                   <ProductSearch ></ProductSearch>
                </Paper>
                <Paper sx={{mb: 2, padding: 2}}>
                  <RadioButtonGroup options={sortOptions} onChange={(e) => dispatch(setProductParams({orderBy: e.target.value}))} selectedValue={productParams.orderBy}/>
                </Paper>
                <Paper sx={{mb: 2, padding: 2}}>
                  <CheckBoxList items={brandArray} itemsSelected={productParams.brands} onChange={handleBrandChange}></CheckBoxList>
                </Paper>
                <Paper sx={{mb: 2, padding: 2}}>
                  <CheckBoxList items={typeArray} itemsSelected={productParams.types} onChange={handleTypeChange}></CheckBoxList>
                </Paper>
            </Grid>
            <Grid item xs={9} sx={{paddingLeft: 0, paddingTop: 0}}>
              <ProductList products={products} />
            </Grid>

        </Grid>
      )
}