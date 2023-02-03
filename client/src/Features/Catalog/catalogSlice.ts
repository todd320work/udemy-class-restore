import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";

import agent from "../../App/api/agent";
import { MetaData } from "../../App/Models/Pagination";
import { Product, ProductParams } from "../../App/Models/Product";
import { RootState } from "../../App/store/configureStore";

interface CatalogState {
    productsLoaded: boolean;
    filtersLoaded: boolean;
    status: string;
    brands: string[];
    types: string[];
    productParams: ProductParams;
    metaData: MetaData | null;
}


const productsAdapter = createEntityAdapter<Product>();

function getAxiosParams( prodParams: ProductParams) {
    const params = new URLSearchParams();
    params.append('PageNumber', prodParams.pageNumber.toString());
    params.append('RowCount', prodParams.pageSize.toString());
    params.append('OrderBy', prodParams.orderBy);
    if( prodParams.searchTerm)
        params.append('SearchTerm', prodParams.searchTerm);
    if( prodParams.brands)
    {
        const tempStr = prodParams.brands.toString();
        params.append('Brands', tempStr);
    }
    if( prodParams.types)
        params.append('Types', prodParams.types.toString());
    
    return params;
}
export const fetchProductsAsync = createAsyncThunk<Product[], void, {state: RootState}>(
    'catalog/fetchProductsAsync', 
    async (_, thunkAPI) => {
        const params = getAxiosParams( thunkAPI.getState().catalog.productParams );
        try {
             const response = await agent.Catalog.list(params);
             thunkAPI.dispatch(setMetaData(response.metaData));
             return response.items;
        }
        catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }

    }
)

// Used to get a specific product Id's data.
export const fetchProductByIdAsync = createAsyncThunk<Product, number>(
    'catalog/fetchProductByIdAsync', 
    async (prodId, thunkAPI) => {
        try {
             return await agent.Catalog.details(prodId);
        }
        catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }

    }
)

// Retreive the Brands and Types that we use for filtering the list of products 
// for the customer.
export const fetchFilters = createAsyncThunk(
    'catalog/fetchFilters',
    async(_, thunkAPI) => {
        try {
            return await agent.Catalog.fetchFilters();
        } catch( error: any ) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productsAdapter.getInitialState<CatalogState>({
        productsLoaded: false,
        filtersLoaded: false,
        status: 'idle', 
        brands: [],
        types: [],
        productParams: {
            pageNumber: 0,
            pageSize: 6,
            orderBy: 'price',
        },
        metaData: null,
    }),
    reducers: {
        setProductParams: (state, action) => {
            // This will force the products to be re-loaded when the product params are changed. 
            state.productsLoaded = false;
            state.productParams = {...state.productParams, ...action.payload};
        }, 
        resetProductParams: (state, action) => {
            state.productParams = {
                pageNumber: 0,
                pageSize: 6,
                orderBy: 'price',
            };
        },
        setMetaData: (state, action) => {
            state.metaData = action.payload;
        },
        
    },
    extraReducers: (builder => {
        builder.addCase(fetchProductsAsync.pending, (state) => {
            state.status = 'pendingFetchProducts';
        });
        builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
            // This entity adapter "setAll" method simply takes our current array
            // of projects and replaces it with the products in the database. 
            productsAdapter.setAll(state, action.payload);
            state.status = 'idle'
            state.productsLoaded = true;
        });
        builder.addCase(fetchProductsAsync.rejected, (state) => {
            state.status = 'idle';
        });

        // Fetch Product By Id
        builder.addCase(fetchProductByIdAsync.pending, (state) => {
            state.status = 'pendingFetchProductById';
        });
        builder.addCase(fetchProductByIdAsync.fulfilled, (state, action) => {
            productsAdapter.upsertOne(state, action.payload);
            state.status = 'idle'
            state.productsLoaded = true;
        });
        builder.addCase(fetchProductByIdAsync.rejected, (state) => {
            state.status = 'idle';
        });

        // Pull the Brands and Types from the database
        builder.addCase(fetchFilters.pending, (state) => {
            state.status = 'pendingFetchFilters';
        });
        builder.addCase(fetchFilters.fulfilled, (state, action) => {
            state.brands = action.payload.brands;
            state.types = action.payload.types;
            state.status = 'idle'
            state.filtersLoaded = true;
        });
        builder.addCase(fetchFilters.rejected, (state, action) => {
            console.log(action.payload);
            state.status = 'idle';
        });


    })
})

export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);
export const {setProductParams, resetProductParams, setMetaData} = catalogSlice.actions;