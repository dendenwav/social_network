import { CircularProgress, Grid, Paper } from '@mui/material';
import AuthenticatedPagesContainer from '../../components/AuthenticatedPage/AuthenticatedPage';

interface ILoadingProps {
    IsAuthenticated?: boolean;
}

const Loading = ({IsAuthenticated}: ILoadingProps) => {

    if (IsAuthenticated) {
        return (
            <AuthenticatedPagesContainer>
                <Grid container justifyContent="center" alignContent="center" className='loading-container'>
                    <Grid item>
                        <CircularProgress color="secondary"/>
                    </Grid>
                </Grid>
            </AuthenticatedPagesContainer>
        )
    }
    
    return (
        <Paper variant="outlined" id='auth-container'>
            <Grid container justifyContent="center" alignContent="center" className='loading-container'>
                <Grid item>
                    <CircularProgress color="secondary"/>
                </Grid>
            </Grid>
        </Paper>        
    )
};

export default Loading;