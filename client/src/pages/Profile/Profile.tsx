import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Paper } from '@mui/material';

import AuthenticatedPagesContainer from '../../components/AuthenticatedPage/AuthenticatedPage';
import { getUser } from "../../actions/usersActions";
import Error from "../Error/Error";
import { USER_NOT_FOUND } from "../../constants/errorMessages";

interface IProfileProps {
    userId: string;
}

const Profile = ({userId}: IProfileProps, ) => {
    const { id } = useParams<{ id: string }>();
    const [userExists, setUserExists] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>('THERE WAS AN ERROR');
    
    useEffect(() => {
        let result;
        async function GetUserFunc(id: string | undefined) {
            if (id !== userId && id !== undefined) {
                result = await getUser(id);
                console.log(result);
                if (result === USER_NOT_FOUND) {
                    setUserExists(false);
                    setErrorMessage(USER_NOT_FOUND);
                }
            }
        }
        GetUserFunc(id);
    }, [id, userId])

    if (!userExists) {
        return (
            <Error errorMessage={errorMessage}/>
        );
    }    

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