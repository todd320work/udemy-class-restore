import { debounce, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../App/store/configureStore";
import { setProductParams } from "./catalogSlice";

export default function ProductSearch() {
    const {productParams} = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();
    const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);

    const debouncedSearch = useMemo(
        () =>
          debounce((event: any) => {
            // Changes to the product search invalidates the paging, for example, on page
            // 3, and once we introduce a new search term, 3 might no longer be valid.
            dispatch(setProductParams({ searchTerm: event.target.value, pageNumber: 0 }));
          }, 1000),
        [dispatch]
      );
    /*
    const debouncedSearch = debounce((event: any) => {
                                      dispatch(setProductParams({searchTerm: event.target.value}))
                                    }, 1000 
                                    );
    */
    return <TextField label='Search Products' variant='outlined' fullWidth 
            value={searchTerm || ''}
            onChange={event => 
                        {
                            setSearchTerm(event.target.value);
                            debouncedSearch(event);
                        }
                    }
            />

}