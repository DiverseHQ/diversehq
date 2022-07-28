import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import apiEndpoint from '../../api/ApiEndpoint'
import Image from 'next/image'
import PostsColumn from '../../components/Post/PostsColumn'
import { useNotify } from '../../components/Common/NotifyContext'
import { useProfile } from '../../components/Common/WalletContext'
import { getCommunityInfo, getPostOfCommunity, putJoinCommunity, putLeaveCommunity } from '../../api/community'
const Limit = 2
const CommunityPage = () => {
  const { name } = useRouter().query
  const { user, token, refreshUserInfo } = useProfile()
  const { notifyInfo } = useNotify()
  const [community, setCommunity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isJoined, setIsJoined] = useState(false)

  const [posts, setPosts] = useState([])
  const [hasMore, setHasMore] = useState(true)

  const showPosts = async (sortBy) => {
    try{
      if(!hasMore) return
      const fetchedPosts = await getPostOfCommunity(community._id, Limit, posts.length, "new")
       console.log('fetchedPosts', fetchedPosts)
      if(fetchedPosts.posts.length < Limit){
        setHasMore(false)
      }
      setPosts([...posts, ...fetchedPosts.posts])
    }catch(error){
      console.log(error)
    }
  }

  useEffect(() => {
    if (name) fetchCommunitInformation()
  }, [name])

  useEffect(() => {
    if (community) showPosts()
  }, [community])

  useEffect(() => {
    if(!user || !community) return
     setIsJoined(!!user?.communities?.includes(community._id))
  },[user,community])

  const fetchCommunitInformation = async () => {
    try {
      const community = await getCommunityInfo(name)
      console.log(community)
      setCommunity(community)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const joinCommunity = async () => {
    try {
      await putJoinCommunity(community._id, token)
      notifyInfo('Joined 😍')
      await refreshUserInfo()
      await fetchCommunitInformation()
    } catch (error) {
      console.log(error)
    }
  }

  const leaveCommunity = async () => {
    try {
      await putLeaveCommunity(community._id, token)
      notifyInfo('Left 😢')
      await refreshUserInfo()
      await fetchCommunitInformation()
    } catch (error) {
      console.log(error)
    }
  }


  return (
      <>
        {(!community || !user || loading) && <div>Loading...</div>}
        {!loading && community && user &&
            <div className='relative'>
                <img className="h-28 w-full object-cover" src={community.bannerImageUrl} />
                <div className='absolute top-20 left-3 sm:left-5 border-p-bg border-4 rounded-full'><Image width="70px" height="70px" className="rounded-full bg-p-bg" src={community.logoImageUrl} /> </div>
                <div className='flex flex-col px-3 sm:px-5 mb-5'>
                <button className='bg-p-btn rounded-full text-base sm:text-xl py-1 px-2 self-end my-3' onClick={isJoined ? leaveCommunity: joinCommunity }>{isJoined ? "Leave" : "Join"}</button>
                <div className='font-bold text-xl sm:text-2xl tracking-wider'>{community.name}</div>
                <div>{community.description}</div>
                <div><span className='font-bold'>{community.members.length}</span> <span className='text-s-text'> members</span></div>
                </div>
                {posts && <PostsColumn getMorePost={showPosts} hasMore={hasMore}  posts={posts} />}
            </div>
        }

      </>
  )
}

export default CommunityPage
