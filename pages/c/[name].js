import React, {  useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import PostsColumn from '../../components/Post/PostsColumn'
import { useProfile } from '../../components/Common/WalletContext'
import { getPostOfCommunity} from '../../api/community'
import CommunityInfoCard from '../../components/Community/CommunityInfoCard'
import { POST_LIMIT } from '../../utils/config'

const CommunityPage = () => {
  const { name } = useRouter().query
  const { user} = useProfile()
  const [posts, setPosts] = useState([])
  const [hasMore, setHasMore] = useState(true)

  const showPosts = async () => {
    try{
      if(!hasMore) return
      const fetchedPosts = await getPostOfCommunity(name, POST_LIMIT, posts.length, "new")
       console.log('fetchedPosts', fetchedPosts)
      if(fetchedPosts.posts.length < POST_LIMIT){
        setHasMore(false)
      }
      setPosts([...posts, ...fetchedPosts.posts])
    }catch(error){
      console.log(error)
    }
  }

  useEffect(() => {
    if (name) showPosts()
  }, [name])

  return (
      <div className='pt-6'>
        {user &&
            <div className='relative'>
                <CommunityInfoCard communityName={name} />
                {posts && <PostsColumn getMorePost={showPosts} hasMore={hasMore}  posts={posts} />}
            </div>
        }

      </div>
  )
}

export default CommunityPage
