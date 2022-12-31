import React from 'react'
import NavFilterAllPosts from '../../components/Post/NavFilterAllPosts'
import PostsColumn from '../../components/Post/PostsColumn'

const newPage = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="max-w-[650px] shrink-0">
        <NavFilterAllPosts />
        <PostsColumn source="all" sortBy="new" data={null} />
      </div>
    </div>
  )
}

export default newPage
