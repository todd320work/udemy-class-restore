import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
// When it comes from index, it will just be ../.., or whatever gets us to root.
import { history } from "../..";

// All of the axios calls below will use this as the base URL...
// axios.defaults.baseURL = 'http://tamdev1fl619.ad.reyrey.com:3002/api/'
axios.defaults.baseURL = 'http://localhost:3002/api/'

// This allows for cookies to be passed back and forth
axios.defaults.withCredentials = true;

// Helper method to allow us to easily extract data
const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.response.use( response => {
    return response;
}, (error: AxiosError) => {
    // forcing error.response to be "any", causes TS to stop 
    // killing our compiles due to the fact that data is NOT 
    // part of error.response.
    const {data, status} = error.response as any;// Override type script with !
    switch(status){
        case 400:
            if( data.errors){
                const modelStateErrors: string[] = [];
                for( const key in data.errors){
                    if( data.errors[key] ){
                        modelStateErrors.push(data.errors[key]);
                    }
                }
                throw modelStateErrors.flat();
            }
            toast.error(data.title);
            break;
        case 401:
            toast.error(data.title);
            break;
        case 500:
            history.push( '/server-error',
                {error: data}
                );
            break;
        default:
            break;
    }
    return Promise.reject(error.response);
})

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
    
}

const Catalog = {
    list: () => requests.get('productD'),
    details: (id: number) => requests.get('productD/'+id.toString())
}

const Basket = {
    get: () => requests.get('basket'),
    addItem: (productId: number, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: number, quantity = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`),
}

const TestErrors = {
    get400Error: () => requests.get('buggy/bad-request'),
    get401Error: () => requests.get('buggy/unauthorized'),
    get404Error: () => requests.get('buggy/notfound'),
    get500Error: () => requests.get('buggy/server-error'),
    getValidationError: () => requests.get('buggy/validation-err'),

}
const agent = {
    Catalog, 
    TestErrors,
    Basket
}
export default agent; 