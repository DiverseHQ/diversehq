import React from 'react'
import NavFilterAllPosts from '../../components/Post/NavFilterAllPosts'
import PostsColumn from '../../components/Post/PostsColumn'

const top = () => {
  return (
    <div className="w-full flex justify-center shrink-0">
      <div className="max-w-[650px] shrink-0">
        <NavFilterAllPosts />
        <PostsColumn source="all" sortBy="top" data={null} />
      </div>
    </div>
  )
}

export default top
