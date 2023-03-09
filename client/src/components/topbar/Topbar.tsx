import { useState } from 'react';
import { CardMedia, Grid, Typography, Link, Button } from '@mui/material'; // , InputBase, alpha, styled
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// import { Search as SearchIcon } from '@mui/icons-material';

import { LogoutUser } from '../../actions/authActions';
import { useAppDispatch } from '../../hooks';
import ConfirmDialog from '../Dialog/ConfirmDialog';

// const Search = styled('div')(({ theme }) => ({
//     position: 'relative',
//     borderRadius: theme.shape.borderRadius,
//     backgroundColor: alpha(theme.palette.common.white, 0.15),
//     '&:hover': {
//         backgroundColor: alpha(theme.palette.common.white, 0.25),
//     },
//     marginRight: theme.spacing(2),
//     marginLeft: 0,
//     width: '100%',
//     [theme.breakpoints.up('sm')]: {
//         marginLeft: theme.spacing(3),
//         width: 'auto',
//     },
// }));

// const SearchIconWrapper = styled('div')(({ theme }) => ({
//     padding: theme.spacing(0, 2),
//     height: '100%',
//     position: 'absolute',
//     pointerEvents: 'none',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
// }));

// const StyledInputBase = styled(InputBase)(({ theme }) => ({
//     color: 'inherit',
//     '& .MuiInputBase-input': {
//       padding: theme.spacing(1, 1, 1, 0),
//       // vertical padding + font size from searchIcon
//       paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//       transition: theme.transitions.create('width'),
//       width: '100%',
//       [theme.breakpoints.up('md')]: {
//         width: '20ch',
//       },
//     },
//   }));

interface ITopbarProps {
    userId?: string;
}

const Topbar = ({userId}: ITopbarProps) => {
    const [open, setOpen] = useState(false);
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const openConfirmDialog = async () => {        
        setOpen(true);
    };
    
    const disconnectUser = async () => {        
        await LogoutUser(dispatch, enqueueSnackbar);
        navigate('/auth');
    };

    if (!userId) {
        return (
            <>
                <div className='topbar-placeholder'/>
                <Grid container className='topbar-container' justifyContent='space-between' alignContent='center' alignItems='center'>
                    <Grid item>
                        <Grid container>
                            <Grid item marginRight={1}>
                                <Link href='/' underline="none" color='secondary'>
                                    <Grid container className='link'>
                                        <Grid item marginRight={1}>
                                            <CardMedia className='logo' component='img' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAADa0lEQVR4nL2XyYtdRRTGnwY1idGASlREJQ44IS7iRv+CDoISpbivvl/dvtiLFwXjLCoReuFGQRxQnKIuXIgIblyJE4gEMYoDutBANCHGCWeJGqO2fJ3q0Gnfu4N23oHLvdStc75z6ozV67WkEMLKGCOSNgHvAN8AM8BeSZ9KegV4GLgkhHB4b7EIOEvSk5J+A/4GPpD0oKRbJV0lqfQ38JikN/Oe77MyJ/5n4BDCMuAeSX9I+lzStVVVndDEVxTFycCNwHbgF0l3TExMHNEJvCiK04GPgB+BDVVVLe1qgHmA2yT9LGlzSmlVK8aU0gWSvrafJZ3aWwQXAlvziZxbuznGeKbBJb0aQljRWyQKIRwDvGElRp7EYDBYLulDSW/XgZdleeEwn3rN/xqU2Gp3DI0J9gXcD03HDuyRdNnCda/5Xx1vjPFsxwSwcZif9kq6uU5A3jsjKQxRIPhfE7+k250dB2SUpKeAz9pE+/9VIKe3A/KhuYWVwK8ppWuamBdDgbz3JuC7wWBwmP2Cq9fk5ORJ41KgLMtTjClprQU+IWlLE1NK6WIHWa7/dc+eGONFLQx5a9YNTrv9/qihOQv9rntGndAQeZskveSPb/+VFjUKtLCslQIu08C22bxOKV05bgXcRWfrhqTfgdSCYa2FT01NHTVqT86omZTSRJO8GOPVxrbgL9qkoHt77vXrRu1JKV0h6a82bTsXpK8s+HXggSaGrMTzkj52XR9V64Hn2siSdL8zwR+PukG0YbJlefzamWPiaD+2PINv6/f7x7dUYDPwiK1aB/zZthBZCeBZ88zLffeRZ9qCl2V5bOYpZtsosEvSfb0OlGeH3c7nGONxXXiB61z+9wc0sN4audp1EPK0a0jrUevAZrTLQ+z89UOAFzxqS1pTJ8ANxL7LLri0C3hW/Hrnv+fOhYKXAy/6aCRNL4z06enpQyVd7r6RR/TYFbzf75/nWQC4e+iGEMIS4BZJP+XJZ4vTyjPivIvIy5LO7wruIiXpE0nvN47pKaUjbSFwrxUAHpd0Q1mW53QFzuArgNdceFJKq3vjpJTSauBdSV965B8bcFVVS/OVzZeb9ySdNhbgYt/VbIOkHb7WAXc59Q4aWIwRN7Nc231r9qi125NWSumMgwI8R8CdeUxzhnjE8g25qGvZC+kfyQEXg8k9LfUAAAAASUVORK5CYII='/>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="h5" className='comfortaa'>Plugger</Typography>
                                        </Grid>
                                    </Grid>
                                </Link>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                {/* <Grid container className='search-container' justifyContent='center'>
                    <Search className='search-bar'>
                        <SearchIconWrapper>
                            <SearchIcon/>
                        </SearchIconWrapper>
                        <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }}/>
                    </Search>
                </Grid> */}
                <ConfirmDialog
                    open={open}
                    setOpen={setOpen}
                    title='Se Déconnecter'
                    children='Voulez vous vraiment vous deconnecter ?'
                    onConfirm={disconnectUser}/>
            </>
        )
    }


    return (
        <>
            <div className='topbar-placeholder'/>
            <Grid container className='topbar-container' justifyContent='space-between' alignContent='center' alignItems='center'>
                <Grid item>
                    <Grid container>
                        <Grid item marginRight={1}>
                            <Link href='/' underline="none" color='secondary'>
                                <Grid container className='link'>
                                    <Grid item marginRight={1}>
                                        <CardMedia className='logo' component='img' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAADa0lEQVR4nL2XyYtdRRTGnwY1idGASlREJQ44IS7iRv+CDoISpbivvl/dvtiLFwXjLCoReuFGQRxQnKIuXIgIblyJE4gEMYoDutBANCHGCWeJGqO2fJ3q0Gnfu4N23oHLvdStc75z6ozV67WkEMLKGCOSNgHvAN8AM8BeSZ9KegV4GLgkhHB4b7EIOEvSk5J+A/4GPpD0oKRbJV0lqfQ38JikN/Oe77MyJ/5n4BDCMuAeSX9I+lzStVVVndDEVxTFycCNwHbgF0l3TExMHNEJvCiK04GPgB+BDVVVLe1qgHmA2yT9LGlzSmlVK8aU0gWSvrafJZ3aWwQXAlvziZxbuznGeKbBJb0aQljRWyQKIRwDvGElRp7EYDBYLulDSW/XgZdleeEwn3rN/xqU2Gp3DI0J9gXcD03HDuyRdNnCda/5Xx1vjPFsxwSwcZif9kq6uU5A3jsjKQxRIPhfE7+k250dB2SUpKeAz9pE+/9VIKe3A/KhuYWVwK8ppWuamBdDgbz3JuC7wWBwmP2Cq9fk5ORJ41KgLMtTjClprQU+IWlLE1NK6WIHWa7/dc+eGONFLQx5a9YNTrv9/qihOQv9rntGndAQeZskveSPb/+VFjUKtLCslQIu08C22bxOKV05bgXcRWfrhqTfgdSCYa2FT01NHTVqT86omZTSRJO8GOPVxrbgL9qkoHt77vXrRu1JKV0h6a82bTsXpK8s+HXggSaGrMTzkj52XR9V64Hn2siSdL8zwR+PukG0YbJlefzamWPiaD+2PINv6/f7x7dUYDPwiK1aB/zZthBZCeBZ88zLffeRZ9qCl2V5bOYpZtsosEvSfb0OlGeH3c7nGONxXXiB61z+9wc0sN4audp1EPK0a0jrUevAZrTLQ+z89UOAFzxqS1pTJ8ANxL7LLri0C3hW/Hrnv+fOhYKXAy/6aCRNL4z06enpQyVd7r6RR/TYFbzf75/nWQC4e+iGEMIS4BZJP+XJZ4vTyjPivIvIy5LO7wruIiXpE0nvN47pKaUjbSFwrxUAHpd0Q1mW53QFzuArgNdceFJKq3vjpJTSauBdSV965B8bcFVVS/OVzZeb9ySdNhbgYt/VbIOkHb7WAXc59Q4aWIwRN7Nc231r9qi125NWSumMgwI8R8CdeUxzhnjE8g25qGvZC+kfyQEXg8k9LfUAAAAASUVORK5CYII='/>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h5" className='comfortaa'>Plugger</Typography>
                                    </Grid>
                                </Grid>
                            </Link>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container alignItems='center'>
                        <Grid item marginRight={1}>
                            <Link href={`/profile/${userId}`} underline="none" color='secondary'>
                                <Grid container className='link'>
                                    <Grid item>
                                        <Typography variant="h6">Profile</Typography>
                                    </Grid>
                                </Grid>
                            </Link>
                        </Grid>
                        <Grid item>                            
                            <Button type='button' fullWidth variant='outlined' color='secondary' onClick={openConfirmDialog}>Se Deconnecter</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {/* <Grid container className='search-container' justifyContent='center'>
                <Search className='search-bar'>
                    <SearchIconWrapper>
                        <SearchIcon/>
                    </SearchIconWrapper>
                    <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }}/>
                </Search>
            </Grid> */}
            <ConfirmDialog
                open={open}
                setOpen={setOpen}
                title='Se Déconnecter'
                children='Voulez vous vraiment vous deconnecter ?'
                onConfirm={disconnectUser}/>
        </>
    )
}

export default Topbar