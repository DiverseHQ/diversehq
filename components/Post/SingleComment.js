import React from 'react'
import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
TimeAgo.addDefaultLocale(en)

const SingleComment = ({comment}) => {

  return (
    <div className='p-3 w-96 bg-secondary-bg'>
        <div className='flex flex-row items-center justify-between'>
            <div className='flex flex-row items-center'>
                <img src={comment.authorDetails.profileImageUrl ? comment.authorDetails.profileImageUrl : "/person.png"} className='rounded-full h-3 w-3 mr-2' />
                <div>{comment.authorDetails.name ? comment.authorDetails.name : comment.author.substring(0,6) + "..."}</div>
            </div>
            <div><ReactTimeAgo  date={new Date(comment.createdAt)} locale="en-US"/></div>
        </div>
        <div className='flex flex-row items-center justify-between'>
            <div className='flex flex-col items-center'>
                <div className='flex flex-row items-center'>
                    <img src="/love.png" className='w-4 mr-1' />
                    <div>{comment.likes.length}</div>
                </div>
                {comment.appreciateAmount > 0 && 
                <div className="flex flex-row items-center">
                    <img src="/applause.png" className='w-4 mr-1' />
                    <div>{comment.appreciateAmount}</div>
                </div>
                }
            </div>
            <div>
                {comment.content}
            </div>
        </div>
    </div>
  )
}

export default SingleComment