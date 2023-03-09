import { useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Paper } from '@mui/material';

import AuthenticatedPagesContainer from '../../components/AuthenticatedPage/AuthenticatedPage';

interface IProfileProps {
    userId: string;
}

const Profile = ({userId}: IProfileProps, ) => {
    const { id } = useParams<{ id: string }>();
    
    useEffect(() => {
        console.log(id); // Todo check if this userId exists
    }, [id])
    

    return (
        <AuthenticatedPagesContainer userId={userId}>
            <Paper variant='outlined' className='profile-header'>
                <h1>Profile: {id}</h1>
                <h2>currentUser: {userId}</h2>
                {id === userId ? <h3>this profile is yours</h3> : <h3>this profile is not yours</h3>}
            </Paper>
        </AuthenticatedPagesContainer>
    )
};

export default Profile;