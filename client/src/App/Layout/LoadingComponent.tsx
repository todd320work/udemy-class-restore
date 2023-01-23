import { Backdrop, CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";

interface Props {
    message?: string;
}

export default function LoadingComponent(props: Props){

    return( 
        <Backdrop open={true} invisible={true}>
            <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
                <CircularProgress size={100} color='secondary'/>
                <Typography variant='h4' sx={{justifyContent: 'center', position: 'fixed', top: '60%'}}>{props.message}</Typography>
                
            </Box>

        </Backdrop>
    )
}