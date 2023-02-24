import { TextField, Grid, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

type InputProps = {
    name: string,
    half?: boolean,
    label: string,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    autoFocus?: boolean,
    type?: string,
    handleShowPassword?: () => void
}

const Input = ({ name, half, label, handleChange, autoFocus, type, handleShowPassword }: InputProps) => {
    return (
        <Grid item xs={12} sm={half ? 6 : 12}>
            <TextField
                autoComplete='off'
                name={name}
                onChange={handleChange}
                variant='outlined'
                required
                size='small'
                fullWidth
                label={label}
                autoFocus={autoFocus}
                type={type}
                InputProps={name === 'password' ? {
                    endAdornment: (
                        <InputAdornment position='end'>
                            <IconButton size='small' edge="end" onClick={handleShowPassword}>
                                {type !== 'password' ? <Visibility/> : <VisibilityOff/>}
                            </IconButton>
                        </InputAdornment>
                    ),
                }: undefined}
            />
        </Grid>
    )
}

export default Input