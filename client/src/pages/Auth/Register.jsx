import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Grid } from '@material-ui/core';
import PasswordStrengthBar from 'react-password-strength-bar';

import useStyles from './AuthStyle';
import Input from './Input';
import { registerUser } from '../../actions/authActions';
import { useNavigate } from 'react-router-dom';
import AuthContainer from './AuthContainer';

const initialState = { pseudo: '', firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }

const Register = () => {
    const classes = useStyles();
    const [password, setPassword] = useState('');
    const [form, setForm] = useState(initialState);
    const [ showPassword, setShowPassword ] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser(form, navigate));
    };

    const handleChange = (e) => {
        if (e.target.name === 'password') setPassword(e.target.value);
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword)
    };

    return (
        <AuthContainer isSignUp={true}>
            <form className={classes.form} onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Input name='pseudo' label='Pseudo' handleChange={handleChange}/>
                    <Input name='firstName' label='Prénom' handleChange={handleChange} autoFocus half/>
                    <Input name='lastName' label='Nom' handleChange={handleChange} half/>
                    <Input name='email' label='Email' handleChange={handleChange} type="email"/>
                    <Input name='password' label='Mot de Passe' handleChange={handleChange} type={ showPassword ? "text" : "password" } handleShowPassword={handleShowPassword}/>
                    <PasswordStrengthBar className={classes.passwordStrengthBar} password={password} scoreWords={['Faible', 'Moyen', 'Bon', 'Très bon', 'Parfait']} shortScoreWord="Trop court" />
                    <Input name='confirmPassword' label='Confirmation du Mot de Passe' handleChange={handleChange} type="password"/>
                </Grid>
                <Button type="submit" fullWidth variant='contained' color='primary' className={classes.submit}>S'inscrire</Button>
            </form>
        </AuthContainer>
    )
}

export default Register;