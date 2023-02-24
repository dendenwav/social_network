import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Grid } from '@mui/material';
import PasswordStrengthBar from 'react-password-strength-bar';
import { useNavigate } from 'react-router-dom';

import AuthContainer from '../_containers/Auth/AuthContainer';
import Input from '../../components/input/Input';
import { registerUser } from '../../actions/authActions';

const initialState = { pseudo: '', firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }

const Register = () => {
    const [password, setPassword] = useState('');
    const [form, setForm] = useState(initialState);
    const [ showPassword, setShowPassword ] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        await registerUser(form, dispatch);
        navigate('/');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === 'password') setPassword(e.target.value);
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword)
    };

    return (
        <AuthContainer isSignUp={true}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Input name='pseudo' label='Pseudo' handleChange={handleChange} autoFocus/>
                    <Input name='firstName' label='Prénom' handleChange={handleChange} half/>
                    <Input name='lastName' label='Nom' handleChange={handleChange} half/>
                    <Input name='email' label='Email' handleChange={handleChange} type="email"/>
                    <Input name='password' label='Mot de Passe' handleChange={handleChange} type={ showPassword ? "text" : "password" } handleShowPassword={handleShowPassword}/>
                    <PasswordStrengthBar password={password} scoreWords={['Faible', 'Moyen', 'Bon', 'Très bon', 'Parfait']} shortScoreWord="Trop court" />
                    <Input name='confirmPassword' label='Confirmation du Mot de Passe' handleChange={handleChange} type="password"/>
                </Grid>
                <Button type="submit" fullWidth variant='contained' color='primary' className='submit'>S'inscrire</Button>
            </form>
        </AuthContainer>
    )
}

export default Register;