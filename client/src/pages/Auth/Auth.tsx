import { useState } from 'react';
import { Paper, Button, Grid, Typography } from '@mui/material';
import { Login, PersonAdd } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PasswordStrengthBar from 'react-password-strength-bar';
import { useSnackbar } from 'notistack';

import { LoginUser, RegisterUser } from '../../actions/authActions';
import Input from '../../components/Input/Input';
import { useAppDispatch } from '../../hooks';

const initialStateLogin = { userId: '', password: '' };
const initialStateRegister = { pseudo: '', firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const LoginOverlayHeader = 'Bonjour !';
const LoginOverlayText = 'Renseignez vos identifiants pour vous connecter à votre compte Plugger.';
const LoginOverlayQuestionText = 'Vous n\'avez pas de compte ?';
const LoginOverlayButtonContent = 'Inscrivez-vous';
const LoginOverlayContent = [ LoginOverlayHeader, LoginOverlayText, LoginOverlayQuestionText, LoginOverlayButtonContent ];

const RegisterOverlayHeader = 'Bienvenue !';
const RegisterOverlayText = 'Renseignez vos informations pour créer votre compte Plugger.';
const RegisterOverlayQuestionText = 'Vous avez déjà un compte ?';
const RegisterOverlayButtonContent = 'Connectez-vous';
const RegisterOverlayContent = [ RegisterOverlayHeader, RegisterOverlayText, RegisterOverlayQuestionText, RegisterOverlayButtonContent ];

const Auth = () => {
    const [loginForm, setLoginForm] = useState(initialStateLogin);
    const [registerForm, setRegisterForm] = useState(initialStateRegister);
    const [password, setPassword] = useState('');
    const [ showPassword, setShowPassword ] = useState(false);
    const [ showLoginOverlay, setshowloginOverlay ] = useState(false);

    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const handleSubmitLogin = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        await LoginUser(loginForm, dispatch, enqueueSnackbar);
        navigate('/');
    };

    const handleSubmitRegister = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        await RegisterUser(registerForm,  dispatch, enqueueSnackbar);
        navigate('/'); // to do: redirect to creation of profile ?
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
        const overlayContainerChildrens = document.getElementById('overlay-container')?.children;
        
        if (container && overlayContainerChildrens) {
            container.classList.toggle("right-panel-active");

            for (let children of overlayContainerChildrens) {
                if (children.classList.contains('switch-animation')) continue;
                children.classList.add('switch-animation');
            }

            await new Promise(resolve => setTimeout(resolve, 400));
            setshowloginOverlay(!showLoginOverlay);

            for (let children of overlayContainerChildrens) {
                if (!children.classList.contains('switch-animation')) continue;
                children.classList.remove('switch-animation');
            }
        } else {
            console.log('container or overlayContainerChildrens is undefined');
        }
    };

    return (
        <Paper variant="outlined" id='auth-container'>
            <Grid container className='sign-in-container' alignContent='center'>
                <Grid item xs={1}>
                    <Login className='header'/>
                </Grid>
                <Grid item xs={11} paddingLeft={2} marginBottom={3}>
                    <Typography className='header' variant='h1'>Se Connecter</Typography>
                </Grid>
                <Grid item xs={12}>
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
            <Grid container className='sign-up-container' alignContent='center'>
                <Grid item xs={1}>
                    <PersonAdd className='header'/>
                </Grid>
                <Grid item xs={11} paddingLeft={2} marginBottom={3}>
                    <Typography className='header' variant='h1'>S'inscrire</Typography>
                </Grid>
                <Grid item xs={12}>
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
            <Grid container id='overlay-container' alignContent='center' justifyContent='center' paddingX={3}>
                <Grid item>
                    <Grid container maxWidth={350}>
                        <Grid item xs={12} marginBottom={3} textAlign='center'>
                            <Typography variant='h4' id='overlay-title'>{showLoginOverlay ? LoginOverlayContent[0] : RegisterOverlayContent[0]}</Typography>
                        </Grid>
                        <Grid item xs={12} alignSelf='center' textAlign='justify'>
                            <Typography variant='body1' id='overlay-text'>{showLoginOverlay ? LoginOverlayContent[1] : RegisterOverlayContent[1]}</Typography>
                        </Grid> 
                        <Grid item xs={12} textAlign='justify' marginTop={3} marginBottom={1}>
                            <Typography variant='body2'id="overlay-question">{showLoginOverlay ? LoginOverlayContent[2] : RegisterOverlayContent[2]}</Typography>
                        </Grid> 
                        <Grid item xs={12}>
                            <Button type="button" fullWidth variant="outlined" color='secondary' onClick={switchPanel} id="switch-button">{showLoginOverlay ? LoginOverlayContent[3] : RegisterOverlayContent[3]}</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
};

export default Auth;