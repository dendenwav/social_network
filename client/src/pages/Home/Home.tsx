import AuthenticatedPagesContainer from '../_containers/AuthenticatedPages/AuthenticatedPagesContainer';

const Home = () => {
    return (
        <AuthenticatedPagesContainer>
            <div className='testscss'>Home</div>
        </AuthenticatedPagesContainer>
    )
};

export default Home;