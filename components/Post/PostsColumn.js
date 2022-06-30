import React from 'react'
import PostCard from './PostCard'

const PostsColumn = ({ posts, handleScroll }) => {
  return (
    <div className='flex flex-col h-1/2' onScroll={handleScroll}>
        {posts.map((post) => {
          return <div className='my-3' key={post._id}><PostCard key={post._id} post={post} /></div>
        })}
    </div>
  )
}

export default PostsColumn
