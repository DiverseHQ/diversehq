import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useEffect, useContext } from 'react'
import { FaRegCopy } from 'react-icons/fa'
import apiEndpoint from '../../api/ApiEndpoint'
import { getUserInfo, getUserPosts } from '../../api/user'
import { useNotify } from '../../components/Common/NotifyContext'
import PostCard from '../../components/Post/PostCard'
import PostsColumn from '../../components/Post/PostsColumn'
import { useSigner  } from 'wagmi'
import {ethers} from "ethers"
import ABI from '../../utils/DiveToken.json'
import { DIVE_CONTRACT_ADDRESS_MUMBAI, POST_LIMIT } from '../../utils/config'

const Profile = () => {
  const { useraddress } = useRouter().query
  const [user, setUser] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(false)
  const { notifyInfo } = useNotify()
  const { data: signer } = useSigner();
  const [dive,setDive] = useState('')
  useEffect(() => {
    if (useraddress) {
      showUserInfo()
      showPosts()
    }
  }, [useraddress])

  useEffect(() =>{
    if(signer){
      const contract = new ethers.Contract(DIVE_CONTRACT_ADDRESS_MUMBAI, ABI, signer)
      showUserDive(contract)
    }
  },[signer])

  const showUserDive = async (contract) => {
    try{

      const userDive = await contract.balanceOf(useraddress)
      console.log("userDive",ethers.utils.formatEther(userDive))
      setDive(ethers.utils.formatEther(userDive.toString()))
    }
    catch(error){
      console.log(error)
    }
  }


  const showUserInfo = async () => {
    try {
      const userInfo = await getUserInfo(useraddress)
      console.log(userInfo)
      setUser(userInfo)
    } catch (error) {
      console.log(error)
    }
  }

  const showPosts = async () => {
    try{
      if(!hasMore) return
      const fetchedPosts = await getUserPosts(useraddress.toLowerCase(),POST_LIMIT, posts.length,"top")
      console.log('fetchedPosts', fetchedPosts)
      if(fetchedPosts.posts.length < POST_LIMIT){
        setHasMore(false)
      }
      setPosts([...posts, ...fetchedPosts.posts])
    } catch (error) {
      console.log(error)
    }
  }
  const handleWalletAddressCopy = () => {
    navigator.clipboard.writeText(useraddress)
    notifyInfo('Copied to clipboard')
  }
  return (
   <div className='pt-6'>
    {user && 
                <div className='relative'>
                <img className="h-28 w-full object-cover sm:rounded-t-3xl" src={user.bannerImageUrl ? user.bannerImageUrl : "/gradient.jpg"} />
                <div className='absolute top-20 left-3 sm:left-5 border-s-bg border-4 rounded-full'>
                  <Image width="70px" height="70px" className="rounded-full bg-s-bg" src={user?.profileImageUrl ? user?.profileImageUrl : "/gradient.jpg"} /> 
                </div>
                <div className='flex flex-col px-3 sm:px-5 mb-5 pb-6 bg-s-bg sm:rounded-b-3xl'>
                  <div className='flex flex-row items-center self-end'>
                  <div className="mr-1">
                  <span className='text-s-text'>$DIVE: </span> 
                  <span className='font-bold'>{dive}</span> 
                  </div>
                  <div className='self-end flex flex-row items-center my-3 px-2 py-1  cursor-pointer'  onClick={handleWalletAddressCopy}>
                    <div className='text-base sm:text-xl'>{user?.walletAddress?.substring(0,6) + "..."}</div>
                   <FaRegCopy className='w-8 h-8 px-2' />
                  </div>
                  </div>
                  <div className='font-bold text-xl sm:text-2xl tracking-wider'>{user.name}</div>
                  <div>{user.bio}</div>
                  <div>
                    <span className='text-s-text'>Joined </span> 
                    <span className='font-bold'>{user?.communities?.length}</span> 
                    <span className='text-s-text'> Communities</span>
                  </div>
                  
                </div>
      {posts && <PostsColumn getMorePost={showPosts} hasMore={hasMore}  posts={posts} />}
    
   </div>
  }
  </div>
  )
}

export default Profile
