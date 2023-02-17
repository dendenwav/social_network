import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Grid } from '@material-ui/core';

import useStyles from './AuthStyle';
import Input from './Input';
import { loginUser } from '../../actions/authActions';
import { useNavigate } from 'react-router-dom';
import AuthContainer from './AuthContainer';

const initialState = { userId: '', password: '' }

const Login = () => {
    const classes = useStyles();
    const [form, setForm] = useState(initialState);
    const [ showPassword, setShowPassword ] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        dispatch(loginUser(form, navigate));
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword)
    };

    return (
        <AuthContainer isSignUp={false}>
            <form className={classes.form} onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Input name='userId' label='Email ou Pseudo' handleChange={handleChange} autoFocus/>                                    
                    <Input name='password' label='Mot de Passe' handleChange={handleChange} type={ showPassword ? "text" : "password" } handleShowPassword={handleShowPassword}/>
                </Grid>
                <Button type="submit" fullWidth variant='contained' color='primary' className={classes.submit}>Se Connecter</Button>
            </form>
        </AuthContainer>
    )
}

export default Login;