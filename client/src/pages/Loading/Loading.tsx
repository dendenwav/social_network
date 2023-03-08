import { CircularProgress, Grid } from '@mui/material';
import AuthenticatedPagesContainer from '../_containers/AuthenticatedPages/AuthenticatedPagesContainer';

const Loading = () => {
    return (
        <AuthenticatedPagesContainer>
            <Grid container justifyContent="center" alignContent="center" className='loading-container'>
                <Grid item>
                    <CircularProgress color="secondary"/>
                </Grid>
            </Grid>
        </AuthenticatedPagesContainer>
    )
};

export default Loading;