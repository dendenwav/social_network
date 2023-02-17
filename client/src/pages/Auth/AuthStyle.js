import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(2),
    },
    avatar: {
        marginRight: theme.spacing(0.5),
    },
    header: {
        margin: theme.spacing(1.5, 0, 4),
    },
    title: {
        padding: theme.spacing(0, 1),
    },
    form: {
        width: '100%', // Fix IE 11 issue.
    },
    submit: {
        margin: theme.spacing(3, 0, 1.5),
    },
    passwordStrengthBar: {
        width: '100%',
        margin: theme.spacing(0, 1),
    },
}));