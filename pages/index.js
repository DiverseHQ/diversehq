import React, { useEffect, useState } from 'react'
import { getAllPosts } from '../api/post'
import FilterNav from '../components/Home/FilterNav'
import PostsColumn from '../components/Post/PostsColumn'

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
    ;(async () => {
      if (posts.length === 0) {
        showPosts('new')
      }
    })()
  }, [])
  return (
    <div>
      <FilterNav />
      <PostsColumn
        posts={posts}
        getMorePost={() => {
          showPosts('new')
        }}
        setPosts={setPosts}
        hasMore={hasMore}
      />
    </div>
  )
}

export default Home
