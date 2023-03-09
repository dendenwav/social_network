import AuthenticatedPagesContainer from '../../components/AuthenticatedPage/AuthenticatedPage';

const Home = () => {
    return (
        <AuthenticatedPagesContainer>
            <div className='testscss'>Home</div>
        </AuthenticatedPagesContainer>
    )
};

export default Home;