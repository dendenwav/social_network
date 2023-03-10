import { Grid, Typography } from '@mui/material';

interface IErrorProps {
    errorMessage?: string;
}

const Error = ({errorMessage}: IErrorProps) => {
    
    return (
        <Grid container justifyContent="center" alignContent="center" className='loading-container'>
            <Grid item>
                <Typography variant='h1'>Error 404{errorMessage ? `: ${errorMessage}` : ''}</Typography>
            </Grid>
        </Grid>   
    )
};

export default Error;