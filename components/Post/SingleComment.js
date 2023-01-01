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
  putEditComment,
  putUpvoteComment,
  putDownvoteComment
} from '../../api/comment'
// import { getSinglePostInfo } from "../../api/post"
import { useProfile } from '../Common/WalletContext'
import { useNotify } from '../Common/NotifyContext'
import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'
import CommentDropdown from './CommentDropdown'
import { ReactionTypes } from '../../graphql/generated'
// import { usePopUpModal } from '../../components/Common/CustomPopUpProvider'
TimeAgo.addDefaultLocale(en)

const SingleComment = ({ commentInfo, removeCommentIdFromComments }) => {
  const [comment, setComment] = useState(commentInfo)
  const [reaction, setReaction] = useState(null)
  const [upvoteCount, setUpvoteCount] = useState(
    comment?.upvotes ? comment?.upvotes.length : 0
  )
  const [downvoteCount, setDownvoteCount] = useState(
    comment?.downvotes ? comment?.downvotes.length : 0
  )
  const [totalCount, setTotalCount] = useState(upvoteCount - downvoteCount)

  const { notifyInfo, notifyError, notifySuccess } = useNotify()
  const { user } = useProfile()
  const { showModal } = usePopUpModal()

  const [isAuthor, setIsAuthor] = useState(false)

  // edit comment state
  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState(comment?.content)

  useEffect(() => {
    setTotalCount(upvoteCount - downvoteCount)
  }, [upvoteCount, downvoteCount])

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
  useEffect(() => {
    if (!user) return
    if (!comment?.upvotes || !comment?.downvotes) return
    if (comment?.upvotes.includes(user.walletAddress.toLowerCase())) {
      setReaction('UPVOTE')
    } else if (comment?.downvotes.includes(user.walletAddress.toLowerCase())) {
      setReaction('DOWNVOTE')
    }
    if (comment.author === user.walletAddress) {
      // if current user is the author then show the delete icon
      setIsAuthor(true)
    }
  }, [user, comment])

  const handleUpvote = async () => {
    try {
      if (!user) {
        notifyInfo('You might want to connect your wallet first')
        return
      }
      if (reaction === 'UPVOTE') {
        return // already upvoted
      }
      if (reaction === 'DOWNVOTE') {
        setDownvoteCount(downvoteCount - 1)
      }
      setUpvoteCount(upvoteCount + 1)
      setReaction('UPVOTE')

      await putUpvoteComment(comment?._id)
    } catch (error) {
      console.log(error)
      notifyError('Something went wrong')
    }
  }

  const handleDownvote = async () => {
    try {
      if (!user) {
        notifyInfo('You might want to connect your wallet first')
        return
      }
      if (reaction === 'DOWNVOTE') {
        return // already downvoted
      }
      if (reaction === 'UPVOTE') {
        setUpvoteCount(upvoteCount - 1)
      }
      setDownvoteCount(downvoteCount + 1)
      setReaction('DOWNVOTE')

      await putDownvoteComment(comment?._id)
    } catch (error) {
      console.log(error)
      notifyError('Something went wrong')
    }
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
            <div className="text-xs sm:text-base">
              <ReactTimeAgo
                date={new Date(comment.updatedAt || comment.createdAt)}
                locale="en-US"
              />
            </div>
          </div>

          <div className="pl-12">
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

            <div className="flex flex-row items-end space-x-14">
              {/* upvote and downvote */}
              <div className="flex flex-row items-center gap-x-2 pt-2">
                <img
                  //  onClick={liked ? handleUnLike : handleLike}
                  src={
                    reaction === ReactionTypes.Upvote
                      ? '/UpvoteFilled.svg'
                      : '/Upvote.svg'
                  }
                  onClick={handleUpvote}
                  className="w-5 h-5 cursor-pointer"
                />
                <div className="font-bold">{totalCount}</div>
                <img
                  src={
                    reaction === ReactionTypes.Downvote
                      ? '/DownvoteFilled.svg'
                      : '/Downvote.svg'
                  }
                  className="w-5 h-5 cursor-pointer"
                  onClick={handleDownvote}
                />
              </div>

              {isAuthor && (
                <div className="relative">
                  <BsThreeDots
                    className="hover:cursor-pointer w-4 h-4 sm:w-6 sm:h-6"
                    onClick={showMoreOptions}
                    title="More"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {!comment && <></>}
    </>
  )
}

export default SingleComment
