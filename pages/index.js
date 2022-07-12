import React, { useEffect, useState } from 'react'
import { getAllPosts } from '../api/post'
import PostsColumn from '../components/Post/PostsColumn'

const PerPage = 1
const Home = () => {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedSortBy, setSelectedSortBy] = useState('new')

  const resetVariables = () => {
    setPosts([])
    setLoading(true)
    setPage(0)
    setTotalPages(0)
  }

  const showPosts = async (sortBy) => {
    try {
      if (sortBy !== selectedSortBy) {
        resetVariables()
        setSelectedSortBy(sortBy)
      }
      console.log('showPosts')
      console.log('page: ' + page)
      console.log('totalPages: ' + totalPages)
      if (page > totalPages) return
      const fetchedPosts = await getAllPosts(PerPage, page, sortBy)
      console.log('fetchedPosts', fetchedPosts)
      setPosts([...posts, ...fetchedPosts.posts])
      setTotalPages(fetchedPosts.pages)
      setPage(page + 1)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    (async () => {
      if (posts.length === 0) {
        showPosts(selectedSortBy)
      }
    })()
  }, [selectedSortBy, posts])
  return (
    <div className='text-p-text'>
      <div className='flex flex-row'>
        <button className={`p-3 rounded-full ${selectedSortBy === 'new' ? 'bg-p-btn' : ''}`} onClick={() => {
          resetVariables()
          setSelectedSortBy('new')
        }}>New</button> <button className={`p-3 rounded-full ${selectedSortBy === 'top' ? 'bg-p-btn' : ''}`} onClick={() => {
          resetVariables()
          setSelectedSortBy('top')
        }}>Top</button>
      </div>
        <PostsColumn posts={posts} getMorePost={() => {
          showPosts(selectedSortBy)
        }} hasMore={true} />
    </div>
  )
}

export default Home
