import AuthenticatedPagesContainer from '../../components/AuthenticatedPage/AuthenticatedPage';

interface IHomeProps {
    userId: string;
}

const Home = ({userId}: IHomeProps) => {
    return (
        <AuthenticatedPagesContainer userId={userId}>
            <div className='testscss'>HomeModified</div>
        </AuthenticatedPagesContainer>
    )
};

export default Home;