import React from 'react'

const PostCard = ({post}) => {
    console.log("post",post);
  return (
    <div className="w-[450px] bg-secondary-bg rounded-[20px] p-3.5">
        <div className="flex flex-row justify-between items-center">
            <div>{post.communityId} by {post.author.slice(0,5)}...</div>
            <div>{post.createdAt}</div>
        </div>
        <div className="flex flex-row justify-between items-center">
            <div>{post.likes.length} {post.title}</div>
            <div></div>
        </div>
        <img src={post.postImageUrl} width="400px" alt="post" className="rounded-[16px]"/>
        <div className="flex flex-row justify-between items-center m-2  ">
            <div className="flex flex-row"><img src="/comment.png" className="w-5 mr-1" /> {post.comments.length}</div>
            <div className="flex flex-row">
                <button><img src="/applause.png" className="w-5 mr-1" /></button> 
                <button ><img src="/share.png" className="w-5"/></button>
            </div>
        </div>
        </div>
  )
}

export default PostCard