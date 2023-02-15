import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'

import useStyles from './AuthStyle';
import Input from './Input';
import { loginUser, registerUser } from '../../actions/authActions';
import { useNavigate } from 'react-router-dom';

const initialStateRegister = { pseudo: '', firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }
const initialStateLogin = { userId: '', password: '' }

const Auth = () => {
    const classes = useStyles();
    const [formRegister, setFormRegister] = useState(initialStateRegister);
    const [formLogin, setFormLogin] = useState(initialStateLogin);
    const [ showPassword, setShowPassword ] = useState(false);
    const [ isSignUp, setIsSignUp ] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isSignUp) {
            dispatch(registerUser(formRegister, navigate));
          } else {
            dispatch(loginUser(formLogin, navigate));
          }
    };

    const handleChange = (e) => {
        setFormRegister({ ...formRegister, [e.target.name]: e.target.value });
        setFormLogin({ ...formLogin, [e.target.name]: e.target.value });
    };

    const handleShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword)
    };

    const switchMode = () => {
        setFormRegister(initialStateRegister);
        setFormLogin(initialStateLogin);
        console.log("on passe ici");
        setIsSignUp((prevIsSignUp) => !prevIsSignUp);
        setShowPassword(false);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant='h5'>{isSignUp ? 'S\'inscrire' : 'Se Connecter'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {
                            isSignUp ? (
                                <>
                                    <Input name='pseudo' label='Pseudonyme' handleChange={handleChange}/>
                                    <Input name='firstName' label='Prénom' handleChange={handleChange} autoFocus half/>
                                    <Input name='lastName' label='Nom de Famille' handleChange={handleChange} half/>
                                    <Input name='email' label='Adresse E-Mail' handleChange={handleChange} type="email"/>
                                </>
                            ) : (
                                <>
                                    <Input name='userId' label='Adresse E-Mail ou Pseudonyme' handleChange={handleChange}/>
                                </>
                            )
                        }
                        <Input name='password' label='Mot de Passe' handleChange={handleChange} type={ showPassword ? "text" : "password" } handleShowPassword={handleShowPassword}/>
                        { isSignUp && <Input name='confirmPassword' label='Confirmation du Mot de Passe' handleChange={handleChange} type="password"/> }
                    </Grid>
                    <Button type="submit" fullWidth variant='contained' color='primary' className={classes.submit}>
                        { isSignUp ? 'S\'inscrire' : 'Se Connecter' }
                    </Button>
                    <Grid container justifyContent='flex-end'>
                        <Grid item>
                            <Button onClick={switchMode}>
                                { isSignUp ? `Déjà un compte ? Se Connecter` : 'Pas de compte ? S\'inscrire' }
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}

export default Auth