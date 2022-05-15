import { useRouter } from 'next/router'
import React from 'react'
import apiEndpoint from '../../components/Home/ApiEndpoint';
import PostCard from '../../components/Post/PostCard';

const PostPage = () => {
    const {id} = useRouter().query;
    const [postInfo,setPostInfo] = React.useState(null);

    React.useEffect(() => {
        if(id) fetchPostInformation();
    },[id])

    const fetchPostInformation = async() => {
        try{
            const post = await fetch(`${apiEndpoint}/post/${id}`).then(res => res.json());
            console.log(post);
            setPostInfo(post);
        }catch(error){
            console.log(error);
        }
    }
  return (
      <>
      {postInfo && <PostCard post={postInfo} />}
      {!postInfo && <div>Loading...</div>}
    </>
  )
}

export default PostPage