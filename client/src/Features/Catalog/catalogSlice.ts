import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../App/api/agent";
import { Product } from "../../App/Models/Product";
import { RootState } from "../../App/store/configureStore";

const productsAdapter = createEntityAdapter<Product>();

export const fetchProductsAsync = createAsyncThunk<Product[]>(
    'catalog/fetchProductsAsync', 
    async () => {
        try {
             return await agent.Catalog.list();
        }
        catch (error) {
            console.log(error);
        }

    }
)
export const fetchProductByIdAsync = createAsyncThunk<Product, number>(
    'catalog/fetchProductByIdAsync', 
    async (prodId) => {
        try {
             return await agent.Catalog.details(prodId);
        }
        catch (error) {
            console.log(error);
        }

    }
)

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productsAdapter.getInitialState({
        productsLoaded: false,
        status: 'idle', 
    }),
    reducers: {},
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
    })
})

export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);