import AuthenticatedPagesContainer from '../_containers/AuthenticatedPages/AuthenticatedPagesContainer';

const Profile = () => {
    return (
        <AuthenticatedPagesContainer>
            <div className='testscss'>Profile</div>
        </AuthenticatedPagesContainer>
    )
};

export default Profile;