import { Router, useRouter } from 'next/router'
import React, { useState } from 'react'

const PostCard = ({ post }) => {
  const createdAt = new Date(post.createdAt)
  const [loaded, setLoaded] = useState(false)
  const router = useRouter();

  //   const likeThe
  return (
    <div className="w-[450px] bg-secondary-bg rounded-[20px] p-3.5">
        <div className="flex flex-row justify-between items-center mb-2">
            <div>{post.communityId} by {post.author.slice(0, 5)}...</div>
            <div>{createdAt.toLocaleDateString()}</div>
        </div>
        <div className="flex flex-row justify-start items-center">
            <button><img src="/love.png" className='w-4 mr-2'/></button>
            <div>{post.likes.length} {post.title}</div>
        </div>
       <div onClick={() => {
         router.push(`/p/${post._id}`)
       }}>{post.postImageUrl ? (<img src={post.postImageUrl} className="w-[450px]" onLoad={() => { setLoaded(true) }} />) : (<video src={post.postVideoUrl} onLoad={() => { setLoaded(true) }} autoPlay loop controls />)} </div>

        <div className="flex flex-row justify-between items-center m-2">
            <div className="flex flex-row"><img src="/comment.png" className="w-5 mr-1" /> {post.comments.length}</div>
            <div className="flex flex-row">
                <button><img src="/applause.png" className="w-5 mr-1"/></button>
                <button><img src="/share.png" className="w-5"/></button>
            </div>
        </div>
        </div>
  )
}

export default PostCard
