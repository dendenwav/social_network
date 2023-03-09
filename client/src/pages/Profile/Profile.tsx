import AuthenticatedPagesContainer from '../../components/AuthenticatedPage/AuthenticatedPage';

const Profile = () => {
    return (
        <AuthenticatedPagesContainer>
            <div className='testscss'>Profile</div>
        </AuthenticatedPagesContainer>
    )
};

export default Profile;