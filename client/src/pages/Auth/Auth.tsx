import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Paper, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PasswordStrengthBar from 'react-password-strength-bar';

import { loginUser, registerUser } from '../../actions/authActions';
import Input from '../../components/input/Input';

const initialStateLogin = { userId: '', password: '' }
const initialStateRegister = { pseudo: '', firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }

const Auth = () => {
    const [loginForm, setLoginForm] = useState(initialStateLogin);
    const [registerForm, setRegisterForm] = useState(initialStateRegister);
    const [password, setPassword] = useState('');
    const [ showPassword, setShowPassword ] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmitLogin = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        await loginUser(loginForm, dispatch);
        navigate('/');
    };

    const handleSubmitRegister = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        await registerUser(registerForm, dispatch);
        navigate('/');
    };

    const handleChangeLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    };

    const handleChangeRegister = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === 'password') setPassword(e.target.value);
        setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
    };

    const handleShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword)
    };

    const switchPanel = async () => {
        const container = document.getElementById('auth-container');
        const switchButton = document.getElementById('switch-button');
        const overlayContainerChildrens = document.getElementById('overlay-container')?.children;
        
        if (container && switchButton && overlayContainerChildrens) {
            container.classList.toggle("right-panel-active");

            for (let children of overlayContainerChildrens) {
                if (children.classList.contains('switch-animation')) continue;
                children.classList.add('switch-animation');
            }

            await new Promise(resolve => setTimeout(resolve, 400));
            switchButton.innerHTML = (switchButton?.innerHTML === 'S\'inscrire') ? 'Se Connecter' : 'S\'inscrire';

            for (let children of overlayContainerChildrens) {
                if (!children.classList.contains('switch-animation')) continue;
                children.classList.remove('switch-animation');
            }
        }
    };

    return (
        <Paper elevation={2} id='auth-container'>
            <Grid container className='sign-in-container'>
                <Grid item xs={12} marginTop={15} textAlign='center'>
                    <Typography className='header' variant='h1'>Se Connecter</Typography>
                </Grid>
                <Grid item xs={12} height={400}>
                    <form onSubmit={handleSubmitLogin}>
                        <Grid container spacing={1}>
                            <Input name='userId' label='Email ou Pseudo' handleChange={handleChangeLogin} autoFocus/>                                    
                            <Input name='password' label='Mot de Passe' handleChange={handleChangeLogin} type={ showPassword ? "text" : "password" } handleShowPassword={handleShowPassword}/>
                            <Grid item xs={12} marginTop={3}>
                                <Button type="submit" fullWidth variant='contained' color='primary'>Se Connecter</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
            <Grid container className='sign-up-container'>
                <Grid item xs={12} marginTop={15} textAlign='center'>
                    <Typography className='header' variant='h1'>S'inscrire</Typography>
                </Grid>
                <Grid item xs={12} height={490}>
                    <form onSubmit={handleSubmitRegister}>
                        <Grid container spacing={1}>
                            <Input name='pseudo' label='Pseudo' handleChange={handleChangeRegister} autoFocus/>
                            <Input name='firstName' label='Prénom' handleChange={handleChangeRegister} half/>
                            <Input name='lastName' label='Nom' handleChange={handleChangeRegister} half/>
                            <Input name='email' label='Email' handleChange={handleChangeRegister} type="email"/>
                            <Input name='password' label='Mot de Passe' handleChange={handleChangeRegister} type={ showPassword ? "text" : "password" } handleShowPassword={handleShowPassword}/>
                            <Grid item xs={12}>
                                <PasswordStrengthBar password={password} scoreWords={['Faible', 'Moyen', 'Bon', 'Très bon', 'Parfait']} shortScoreWord="Trop court" />
                            </Grid>
                            <Input name='confirmPassword' label='Confirmation du Mot de Passe' handleChange={handleChangeRegister} type="password"/>
                            <Grid item xs={12} marginTop={3}>
                                <Button color='primary' type="submit" fullWidth variant='contained' className='submit'>S'inscrire</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
            <Grid container id='overlay-container' justifyContent='center' alignItems='center' color='primary'>
                <Button type="button" fullWidth variant="outlined" color='primary' onClick={switchPanel} id="switch-button">Se Connecter</Button>
            </Grid>
        </Paper>
    )
};

export default Auth;