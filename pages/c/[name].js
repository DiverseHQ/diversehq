import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import PostsColumn from '../../components/Post/PostsColumn'
import { getPostOfCommunity } from '../../api/community'
import CommunityInfoCard from '../../components/Community/CommunityInfoCard'
import { POST_LIMIT } from '../../utils/config.ts'

const CommunityPage = () => {
  const { name } = useRouter().query
  const [posts, setPosts] = useState([])
  const [hasMore, setHasMore] = useState(true)

  const showPosts = async () => {
    try {
      if (!hasMore) return
      const fetchedPosts = await getPostOfCommunity(
        name,
        POST_LIMIT,
        posts.length,
        'new'
      )
      console.log('fetchedPosts', fetchedPosts)
      if (fetchedPosts.posts.length < POST_LIMIT) {
        setHasMore(false)
      }
      setPosts([...posts, ...fetchedPosts.posts])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (name) showPosts()
  }, [name])

  return (
    <div className="pt-6">
      <div className="relative">
        {name && <CommunityInfoCard communityName={name} />}
        {posts && (
          <PostsColumn
            getMorePost={showPosts}
            hasMore={hasMore}
            posts={posts}
          />
        )}
      </div>
    </div>
  )
}

export default CommunityPage
