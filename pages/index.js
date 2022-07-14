import React, { useEffect, useState } from 'react'
import { getAllPosts } from '../api/post'
import PostsColumn from '../components/Post/PostsColumn'

const PerPage = 2
const Home = () => {
  const [posts, setPosts] = useState([])
  // const [selectedSortBy, setSelectedSortBy] = useState('new')
  const [hasMore, setHasMore] = useState(true)

  // const resetVariables = () => {
  //   setPosts([])
  // }

  const showPosts = async (sortBy) => {
    try {
      // if (sortBy !== selectedSortBy) {
      //   resetVariables()
      //   setSelectedSortBy(sortBy)
      // }
      if (!hasMore) return
      console.log('hasMore', hasMore)
      console.log('sortBy', sortBy)
      console.log('posts', posts)
      console.log('posts.length', posts.length)
      const fetchedPosts = await getAllPosts(PerPage, posts.length, sortBy)
      console.log('fetchedPosts', fetchedPosts)
      if (fetchedPosts.posts.length < PerPage) {
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
    <div className='text-p-text'>
      <div className='flex flex-row'>
        {/* <button className={`p-3 rounded-full ${selectedSortBy === 'new' ? 'bg-p-btn' : ''}`} onClick={() => {
          resetVariables()
          setSelectedSortBy('new')
        }}>New</button>
        <button className={`p-3 rounded-full ${selectedSortBy === 'top' ? 'bg-p-btn' : ''}`} onClick={() => {
          resetVariables()
          setSelectedSortBy('top')
        }}>Top</button> */}
      </div>
        <PostsColumn posts={posts} getMorePost={() => {
          showPosts('new')
        }} hasMore={hasMore} />
    </div>
  )
}

export default Home
