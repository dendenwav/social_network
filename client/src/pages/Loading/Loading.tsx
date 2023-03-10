import { CircularProgress, Grid } from '@mui/material';

const Loading = () => {
    
    return (
        <Grid container justifyContent="center" alignContent="center" className='loading-container'>
            <Grid item>
                <CircularProgress color="secondary"/>
            </Grid>
        </Grid>   
    )
};

export default Loading;