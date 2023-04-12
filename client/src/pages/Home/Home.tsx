import { useCallback, useEffect, useState } from 'react';

import AuthenticatedPagesContainer from '../../components/AuthenticatedPage/AuthenticatedPage';
import { getFriendsPosts } from '../../actions/postsActions';
import { IPost } from '../../../../server/src/models/_interfaces/PostsInterfaces';
import Share from '../../components/Share/Share';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface IHomeProps {
    userId: string;
}

const Home = ({userId}: IHomeProps) => {
    const [open, setOpen] = useState(false);
    const [posts, setPosts] = useState<IPost[]>([]);
    
    const getFriendsPostsFunc = useCallback( async () => {
        const result = await getFriendsPosts(userId);
        setPosts(result);
    }, [userId]);

    useEffect(() => {
        getFriendsPostsFunc();
    }, [getFriendsPostsFunc]);
    
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        console.log(posts);
    };

    return (
        <AuthenticatedPagesContainer userId={userId}>
            <div>
                <Button variant="outlined" color='secondary' onClick={handleClickOpen} startIcon={<AddIcon/>}>
                    Share
                </Button>
                <Share
                    open={open}
                    onClose={handleClose}
                />
                <div className='testscss'>HomeModified</div>
                <div className='testscss'>HomeModified</div>
            </div>
        </AuthenticatedPagesContainer>
    )
};

export default Home;