import { Avatar, Button, Grid, Paper, Typography, Container } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';

type AuthContainerProps = {
    isSignUp: boolean,
    children: ReactJSXElement
}

const AuthContainer = ({ isSignUp, children }: AuthContainerProps) => {
    const navigate = useNavigate();

    const switchMode = () => {
        if (isSignUp) {
            navigate('/login');
        }
        else {
            navigate('/register');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper className='paper' elevation={3}>
                <Grid container className='header' justifyContent='flex-start' alignItems='center'>
                    <Avatar className='avatar'>
                        <LockOutlined />
                    </Avatar>
                    <Typography className='title' variant='h5'>{isSignUp ? 'S\'inscrire' : 'Se Connecter'}</Typography>
                </Grid>

                {children}
                
                <Grid container justifyContent='flex-end'>
                    <Grid item>
                        <Button onClick={switchMode}>
                            { isSignUp ? `Déjà un compte ? Se Connecter` : 'Pas de compte ? S\'inscrire' }
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    )
};

export default AuthContainer;