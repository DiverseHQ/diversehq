import React from 'react'

const LensPostCard = ({ post }) => {
  return (
    <div style={{ marginTop: '50px' }}>
      <div>CreatedAt: {post?.createdAt}</div>
      <div>Content : {post?.metadata?.content}</div>
      <div>@{post?.profile?.handle}</div>
      <div>{post?.profile?.ownedBy}</div>
    </div>
  )
}

export default LensPostCard
