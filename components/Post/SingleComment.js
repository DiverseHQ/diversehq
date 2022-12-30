import React, { useState, useEffect, useCallback } from 'react'
import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import { AiOutlineHeart, AiFillHeart, AiOutlineCheck } from 'react-icons/ai'
import { FaHandSparkles } from 'react-icons/fa'
import { BsThreeDots } from 'react-icons/bs'
import {
  deleteComment,
  putLikeComment,
  putEditComment
} from '../../api/comment'
// import { getSinglePostInfo } from "../../api/post"
import { useProfile } from '../Common/WalletContext'
import { useNotify } from '../Common/NotifyContext'
import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'
import CommentDropdown from './CommentDropdown'
// import { usePopUpModal } from '../../components/Common/CustomPopUpProvider'
TimeAgo.addDefaultLocale(en)

const SingleComment = ({ commentInfo, removeCommentIdFromComments }) => {
  const [comment, setComment] = useState(commentInfo)
  const { notifyInfo, notifyError, notifySuccess } = useNotify()
  const { user } = useProfile()
  const { showModal } = usePopUpModal()

  const [isAuthor, setIsAuthor] = useState(false)

  // maintaining comment likes
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(comment.likes.length)

  // edit comment state
  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState(comment?.content)

  useEffect(() => {
    if (comment?.author === user?.walletAddress) {
      setIsAuthor(true)
    }
  }, [comment])

  const handleEditComment = async () => {
    if (!comment) return
    setEditing(true)

    // showModal({
    //   component: <EditComment comment={comment} setComment={setComment} />,
    //   type: modalType.normal,
    //   onAction: () => {},
    //   extraaInfo: {}
    // })
  }

  const submitEdittedComment = async () => {
    try {
      const res = await putEditComment(comment?._id, content)
      const resData = await res.json()
      if (res.status !== 200) {
        notifyError(resData.msg)
        return
      }
      setComment({ ...comment, content })
      setEditing(false)
      notifySuccess('Comment Updated')
    } catch (error) {
      console.log(error)
      notifyError(error.message)
    }
  }

  // 1. if the comment.author === user.walletAddress (same person who commented) then let them edit and delete the comment
  // 2. also delete the reference of that comment in the corresponding post's comment's array
  const handleDeleteComment = async () => {
    try {
      if (!user) {
        notifyInfo('You might want to connect your wallet first')
        return
      }
      const deletedId = await deleteComment(comment?._id)
      console.log('deletedId', deletedId)
      removeCommentIdFromComments(comment?._id)
      // const post = await getSinglePostInfo(comment?.postId)
      notifyInfo('Comment deleted successfully')
    } catch (error) {
      console.log(error)
      notifyError('Something went wrong')
    }
  }

  const handleLike = async () => {
    try {
      if (!user) {
        notifyInfo('You might want to connect your wallet first')
        return
      }
      const res = await putLikeComment(comment?._id)
      const resData = await res.json()
      if (res.status !== 200) {
        notifyError(resData.msg)
        return
      }
      setLiked(true)
      setLikes(resData.likes.length)
    } catch (error) {
      console.log(error)
      notifyError('Something went wrong')
    }
  }

  const handleUnlike = async () => {
    try {
      if (!user) {
        notifyInfo('You might want to connect your wallet first')
        return
      }
      const res = await putLikeComment(comment?._id)
      const resData = await res.json()
      if (res.status !== 200) {
        notifyError(resData.msg)
        return
      }
      setLiked(false)
      setLikes(resData.likes.length)
    } catch (error) {
      console.log(error)
      notifyError('Something went wrong')
    }
  }

  const onCommentChange = useCallback((e) => {
    setContent(e.target.value)
  }, [])

  const showMoreOptions = (e) => {
    // setShowOptions(!showOptions)
    showModal({
      component: (
        <CommentDropdown
          handleEditComment={handleEditComment}
          handleDeleteComment={handleDeleteComment}
        />
      ),
      type: modalType.customposition,
      onAction: () => {},
      extraaInfo: {
        bottom:
          window.innerHeight -
          e.currentTarget.getBoundingClientRect().bottom -
          100 +
          'px',
        left: e.currentTarget.getBoundingClientRect().left + 'px'
      }
    })
  }

  return (
    <>
      {comment && (
        <div className="px-3 sm:px-5 w-full bg-s-bg my-6 sm:rounded-3xl py-3">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center">
              <img
                src={
                  comment.authorAvatar ? comment.authorAvatar : '/gradient.jpg'
                }
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mr-2"
              />
              <div className="ml-2 font-bold text-xs sm:text-xl">
                {comment.authorName
                  ? comment.authorName
                  : comment.author.substring(0, 6) + '...'}
              </div>
            </div>
            <div className="flex flex-row items-center">
              {isAuthor && (
                <div className="relative">
                  <BsThreeDots
                    className="hover:cursor-pointer mr-1.5 w-4 h-4 sm:w-6 sm:h-6"
                    onClick={showMoreOptions}
                    title="More"
                  />
                </div>
              )}
              {liked ? (
                likes !== 0 && (
                  <AiFillHeart
                    className="hover:cursor-pointer mr-1.5 w-5 h-5 sm:w-7 sm:h-7 text-p-btn"
                    onClick={handleUnlike}
                  />
                )
              ) : (
                <AiOutlineHeart
                  className="hover:cursor-pointer mr-1.5 w-5 h-5 sm:w-7 sm:h-7 text-p-btn"
                  onClick={handleLike}
                />
              )}
              <div className="mr-3">{likes}</div>
              <FaHandSparkles className="w-5 h-5 sm:w-7 sm:h-7 mr-1.5" />
              <div className="mr-3">{comment.appreciateAmount}</div>
              <div className="text-xs sm:text-base">
                <ReactTimeAgo
                  date={new Date(comment.updatedAt || comment.createdAt)}
                  locale="en-US"
                />
              </div>
            </div>
          </div>

          {editing ? (
            <div className="flex items-center justify-between">
              <input
                className="mt-3 border-b-2 focus:outline-none text-lg text-semibold w-[80%]"
                type="text"
                placeholder={`${content}`}
                value={`${content}`}
                onChange={onCommentChange}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') submitEdittedComment()
                }}
                required
              />
              <div className="flex items-center">
                <AiOutlineCheck
                  className="text-[24px] hover:cursor-pointer hover:text-[#66CD00]"
                  title="Save"
                  onClick={submitEdittedComment}
                />
              </div>
            </div>
          ) : (
            <div className="mt-3">{comment.content}</div>
          )}
        </div>
      )}
      {!comment && <></>}
    </>
  )
}

export default SingleComment
