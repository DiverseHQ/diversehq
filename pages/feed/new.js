import React from 'react'
import NavFilterAllPosts from '../../components/Post/NavFilterAllPosts'
import PostsColumn from '../../components/Post/PostsColumn'

const newPage = () => {
  return (
    <>
      <NavFilterAllPosts />
      <PostsColumn source="all" sortBy="new" data={null} />
    </>
  )
}

export default newPage
