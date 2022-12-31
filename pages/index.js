import React from 'react'
import NavFilterAllPosts from '../components/Post/NavFilterAllPosts'

import PostsColumn from '../components/Post/PostsColumn'

const Home = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="sm:max-w-[650px]">
        <NavFilterAllPosts />
        <PostsColumn source="all" sortBy="new" data={null} />
      </div>
    </div>
  )
}

export default Home
