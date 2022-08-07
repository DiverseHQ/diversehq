import React from 'react'
import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import { AiOutlineHeart } from 'react-icons/ai'
import { FaHandSparkles } from 'react-icons/fa'
TimeAgo.addDefaultLocale(en)

const SingleComment = ({ comment }) => {
  return (
    <>
    {comment &&
    <div className='px-3 sm:px-5 w-full bg-s-bg my-6 sm:rounded-3xl py-3'>
        <div className='flex flex-row items-center justify-between'>
            <div className='flex flex-row items-center'>
                <img src={comment.authorDetails.profileImageUrl ? comment.authorDetails.profileImageUrl : '/gradient.jpg'} className='w-6 h-6 sm:w-8 sm:h-8 rounded-full mr-2' />
                <div className='ml-2 font-bold text-xs sm:text-xl'>{comment.authorDetails.name ? comment.authorDetails.name : comment.author.substring(0, 6) + '...'}</div>
            </div>
            <div className='flex flex-row'>
            <AiOutlineHeart className='hover:cursor-pointer mr-1.5 w-5 h-5 sm:w-7 sm:h-7 text-p-btn' />
            <div className='mr-3'>{comment.likes.length}</div>
            <FaHandSparkles className='w-5 h-5 sm:w-7 sm:h-7 mr-1.5' />
            <div className='mr-3'>{comment.appreciateAmount}</div>
            <div className='text-xs sm:text-base'><ReactTimeAgo date={new Date(comment.createdAt)} locale="en-US"/></div>
            </div>
        </div>

           <div className='mt-3'>
                {comment.content}
                </div>
    </div>}
    {!comment && <></>}
    </>
  )
}

export default SingleComment
