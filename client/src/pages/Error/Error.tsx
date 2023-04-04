import { Grid, Typography, Link } from '@mui/material';
import { LinkAnimation } from '../../components/LinkAnimation/LinkAnimation';

interface IErrorProps {
    errorMessage?: string;
}

const Error = ({errorMessage}: IErrorProps) => {
    
    return (
        <Grid container direction='column' justifyContent="center" alignContent="center" className='loading-container'>
            <Grid item>
                <Typography variant='h1' fontSize='4.5rem'>{errorMessage ? `${errorMessage}` : ''}</Typography>
            </Grid>
            <Grid item>                
                <LinkAnimation href="/" content="Revenir à la page d'accueil" height="1.25rem" />
            </Grid>
        </Grid>   
    )
};

export default Error;