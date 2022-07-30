import React, { useEffect, useState } from 'react'
import { getAllPosts } from '../api/post'
import PostsColumn from '../components/Post/PostsColumn'

import DiveToken from "../utils/DiveToken.json";


const limit = 3
const Home = () => {
  const [posts, setPosts] = useState([])
  const [hasMore, setHasMore] = useState(true)

  const showPosts = async (sortBy) => {
    try {
      if (!hasMore) return
      const fetchedPosts = await getAllPosts(limit, posts.length, sortBy)
      console.log('fetchedPosts', fetchedPosts)
      if (fetchedPosts.posts.length < limit) {
        setHasMore(false)
      }
      setPosts([...posts, ...fetchedPosts.posts])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    (async () => {
      if (posts.length === 0) {
        showPosts('new')
      }
    })()
  }, [])
  return (
    <div>
        <PostsColumn posts={posts} getMorePost={() => {
          showPosts('new')
        }} hasMore={hasMore} />
    </div>
  )
}


export default Home
