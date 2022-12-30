import React from 'react'
import NavFilterAllPosts from '../components/Post/NavFilterAllPosts'
import FilterNav from '../components/Home/FilterNav'

import PostsColumn from '../components/Post/PostsColumn'

const Home = () => {
  return (
    <>
      <NavFilterAllPosts />
      <PostsColumn source="all" sortBy="new" data={null} />
    </>
  )
}

export default Home
