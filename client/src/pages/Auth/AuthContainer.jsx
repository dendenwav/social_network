import React from 'react';
import { Avatar, Button, Grid, Paper, Typography, Container } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useNavigate } from 'react-router-dom';

import useStyles from './AuthStyle';

const AuthContainer = ({ isSignUp, children }) => {
    const classes = useStyles();
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
            <Paper className={classes.paper} elevation={3}>
                <Grid container className={classes.header} justifyContent='flex-start' alignItems='center'>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography className={classes.title} variant='h5'>{isSignUp ? 'S\'inscrire' : 'Se Connecter'}</Typography>
                </Grid>

                {children}
                
                <Grid container justifyContent='flex-end'>
                    <Grid item>
                        <Button onClick={switchMode}>Déjà un compte ? Se Connecter</Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    )
};

export default AuthContainer;