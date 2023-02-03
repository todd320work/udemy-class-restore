import { Pagination, Typography } from "@mui/material";
import Box from "@mui/system/Box/Box";

import { MetaData } from "../Models/Pagination";

interface Props {
    metaData: MetaData;
    handlePageChange: (event: any, page: number) => void;
}
export default function PaginationCombo({metaData, handlePageChange} : Props) {

    const tempCount = metaData ? metaData.totalPages : 0;
    const tempPage = metaData ? metaData.currentPage + 1 : 0;
    const startIndex = metaData ? (metaData.currentPage)*metaData.pageSize + 1 : 0;
    const total = metaData ? (metaData.totalCount) : 0;
    var endIndex = metaData ? (metaData.currentPage+1)*metaData.pageSize : 0;
    // Make sure endIndex does not reference past the ennd of the list!
    if( endIndex > total ) endIndex = total;

    return (
        <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography>Displaying {startIndex} - {endIndex} of {total}</Typography>
            <Pagination color='secondary' size='large' 
                        onChange={handlePageChange} 
                        count={tempCount} 
                        page={tempPage} />
        </Box>
    )

}