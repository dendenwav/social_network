import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import AuthContainer from '../_containers/Auth/AuthContainer';
import Input from '../../components/input/Input';
import { loginUser } from '../../actions/authActions';

const initialState = { userId: '', password: '' }

const Login = () => {
    const [form, setForm] = useState(initialState);
    const [ showPassword, setShowPassword ] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();        
        await loginUser(form, dispatch);
        navigate('/');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword)
    };

    return (
        <AuthContainer isSignUp={false}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Input name='userId' label='Email ou Pseudo' handleChange={handleChange} autoFocus/>                                    
                    <Input name='password' label='Mot de Passe' handleChange={handleChange} type={ showPassword ? "text" : "password" } handleShowPassword={handleShowPassword}/>
                </Grid>
                <Button type="submit" fullWidth variant='contained' color='primary'>Se Connecter</Button>
            </form>
        </AuthContainer>
    )
}

export default Login;