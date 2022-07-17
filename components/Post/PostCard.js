import { Router, useRouter } from 'next/router'
import React, { useState } from 'react'
import Image from 'next/image'

const PostCard = ({ post }) => {
  const createdAt = new Date(post.createdAt)
  const [loaded, setLoaded] = useState(false)
  const router = useRouter()
  console.log('post', post)
  //   const likeThe
  return (
    <div className="w-full border-s-bg py-3 sm:my-11 border-y">
      <div className='px-3'>
        <div className="flex flex-row justify-between items-center mb-1.5">
            <div className="flex flex-row items-center">
              {post.communityLogo && <Image src={post.communityLogo} width={26} height={26} className="rounded-full" />}
              <div className='pl-1.5 font-bold text-xs'>{post.communityName}</div>
            </div>
            <div className='flex flex-row items-center'>
              {post.authorAvatar && <Image src={post.authorAvatar} className="rounded-full" width={26} height={26} />}
              <div className='pl-1.5 font-bold text-xs'>{post.authorName ? post.authorName : post.author.slice(0, 6) + '...'}</div>
            </div>
        </div>
        <div className="mb-2 font-normal text-xs">
          {post.title}
        </div>
        </div>
       <div onClick={() => {
         router.push(`/p/${post._id}`)
       }}>{post.postImageUrl ? (<img src={post.postImageUrl} className="w-full" onLoad={() => { setLoaded(true) }} />) : (<video src={post.postVideoUrl} onLoad={() => { setLoaded(true) }} autoPlay loop controls />)} </div>

        <div className="flex flex-row justify-between items-center px-3 pt-2 ">
            <div className="flex flex-row">

            <div className='mr-3'><Image src="/love.png" width={16} height={16}/></div>
            <div className='mr-3'><Image src="/comment.png" width={16} height={16}/></div>
            <div className='mr-3'><Image src="/share.png" width={16} height={16} /></div>
            </div>
            <div className="flex flex-row items-center text-xs">
            <div className='pr-2'>{post.likes.length} likes</div>
            <div> {post.comments.length} comments</div>
            </div>
        </div>
        </div>
  )
}

export default PostCard
