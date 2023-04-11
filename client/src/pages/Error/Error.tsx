import { Grid, Typography } from '@mui/material';
import { LinkAnimation } from '../../components/LinkAnimation/LinkAnimation';

interface IErrorProps {
    errorMessage?: string;
}

const Error = ({errorMessage}: IErrorProps) => {
    
    return (
        <Grid container direction='column' justifyContent="center" alignContent="center" className='loading-container'>
            <Grid item marginBottom={2}>
                <Typography variant='h1' fontSize='4.5rem'>{errorMessage ? `${errorMessage}` : ''}</Typography>
            </Grid>
            <Grid item>                
                <LinkAnimation href="/" content="Revenir à la page d'accueil"/>
            </Grid>
        </Grid>   
    )
};

export default Error;