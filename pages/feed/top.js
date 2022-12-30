import React from 'react'
import NavFilterAllPosts from '../../components/Post/NavFilterAllPosts'
import PostsColumn from '../../components/Post/PostsColumn'

const top = () => {
  return (
    <>
      <NavFilterAllPosts />
      <PostsColumn source="all" sortBy="top" data={null} />
    </>
  )
}

export default top
