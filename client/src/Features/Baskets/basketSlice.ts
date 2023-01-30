import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../App/api/agent";
import { Basket } from "../../App/Models/Basket";

export enum StatusType {
    Idle, 
    PendingAdd,
    PendingRemove,
    PendingDelete,
}
interface BasketState {
    basket: Basket | null,
    status: {state: StatusType, productId: number},
}

const initialState: BasketState = {
    basket: null,
    status: {state:StatusType.Idle, productId: 0},
}

export const addBasketItemAsync = createAsyncThunk<Basket, {productId:number, quantity?: number}>(
    'basket/addBasketItemAsync',
    async ({productId, quantity = 1}, thunkAPI) => {
        try {
            return await agent.Basket.addItem(productId, quantity);
        } catch(error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

export const removeBasketItemAsync = createAsyncThunk<void, {productId: number, quantity?: number, type?: StatusType}>(
    'basket/removeBasketItemAsync',
    async ({productId, quantity = 1, type = StatusType.PendingRemove}, thunkAPI) => {
        try {
            await agent.Basket.removeItem(productId, quantity);
        }
        catch (error: any){
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)
export const basketSlice = createSlice({
    name: 'basket',
    initialState, 
    reducers: {
        setBasket: (state, action) => {
            state.basket = action.payload;
        },
    },
    extraReducers:  (builder => {
        builder.addCase(addBasketItemAsync.pending, (state, action) => {
            // append the product ID so we know EXACTLY which product triggered this.
            // pretty hacky, I must say...
            state.status = {state: StatusType.PendingAdd, productId: action.meta.arg.productId};
            console.log(action);
        });
        builder.addCase(addBasketItemAsync.fulfilled, (state,action) => {
            state.basket = action.payload;
            state.status = {state: StatusType.Idle, productId: 0};
        });
        builder.addCase(addBasketItemAsync.rejected, (state,action) => {
            state.status = {state: StatusType.Idle, productId: 0};
            console.log(action.payload);
        });
        builder.addCase(removeBasketItemAsync.pending, (state, action) => {
            // append the product ID so we know EXACTLY which product triggered this.
            // pretty hacky, I must say...
            state.status = {state: action.meta.arg.type!, productId: action.meta.arg.productId}
            console.log(action);
        });
        builder.addCase(removeBasketItemAsync.fulfilled, (state,action) => {
            const {productId, quantity} = action.meta.arg;
            const itemIndex = state.basket?.items.findIndex(i => i.productId === productId);
            // check index to verify it's valid
            if( itemIndex === undefined || itemIndex === -1) return;

            // at this point, we know quantity MUST be defined, so use it.
            state.basket!.items[itemIndex].quantity -= quantity!;
            if( state.basket?.items[itemIndex].quantity === 0 )
            {
                // remove the item (splice: remove 1 items at index = itemIndex)
                state.basket.items.splice(itemIndex, 1);
            }
            state.status = {state: StatusType.Idle, productId: 0};

        });
        builder.addCase(removeBasketItemAsync.rejected, (state,action) => {
            state.status = {state: StatusType.Idle, productId: 0};
            console.log(action.payload);
        });
    })
})

export const {setBasket} = basketSlice.actions;