import { useRouter } from 'next/router';
import {useState, useEffect, useContext} from "react"
import apiEndpoint from "../components/Home/ApiEndpoint";
import PostCard from "../components/Post/PostCard";
const Profile = () => {
  const {useraddress} = useRouter().query;
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const[postInfo, setPostInfo] = useState(null)
  const [playing, setPlaying] = useState(false);
   useEffect(() =>{
     
      if(useraddress){
       getUserInfo();
       getUserPost();
       }
     
   },[useraddress])

   const getUserInfo= async () => {
    try{
      const userInfo = await fetch(`https://diversehq.herokuapp.com/apiv1/user/${useraddress}`)
      .then(res => res.json());
      console.log(userInfo);
      setUser(userInfo);
    }catch(error){
      console.log(error);
    }
  }

  const getUserPost = async () =>{
    try{
      const userPost = await fetch(`https://diversehq.herokuapp.com/apiv1/post/getPostsOfUser/${useraddress}`)
      .then(res => res.json());
      console.log(userPost);
      setPostInfo(userPost);
    }catch(error){
      console.log(error);
    }
  }
  return (
   <>
    {user && <div className=" flex flex-col pt-7 items-center justify-center">
    <img src={user.profileImageUrl} alt="PFP" className="h-44 w-44 rounded-full"></img>  
    <h3 className="">{user.name}</h3>
    <h3>{user.walletAddress}</h3>
    <h3>Communities: {user.communities.length}</h3>
    <div>
      {postInfo && postInfo.map(post => <div className="p-2" key={post.id}><PostCard post={post}/> </div>)}
      {!postInfo && <div>Loading...</div>}
    </div>
    </div>}
   </>
  )
}

export default Profile