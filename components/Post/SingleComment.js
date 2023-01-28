import React, { useState, useEffect, useCallback } from 'react'
import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import { AiOutlineCheck } from 'react-icons/ai'

import {
  deleteComment,
  putEditComment,
  putUpvoteComment,
  putDownvoteComment
} from '../../api/comment'
// import { getSinglePostInfo } from "../../api/post"
import { useProfile } from '../Common/WalletContext'
import { useNotify } from '../Common/NotifyContext'
import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'
// import CommentDropdown from './CommentDropdown'
import { ReactionTypes } from '../../graphql/generated'
import Link from 'next/link'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import MoreOptionsModal from '../Common/UI/MoreOptionsModal'
import { BiEdit } from 'react-icons/bi'
import { HiOutlineTrash } from 'react-icons/hi'
import useDevice from '../Common/useDevice'
import BottomDrawerWrapper from '../Common/BottomDrawerWrapper'
import { RiMore2Fill } from 'react-icons/ri'
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
  const { showModal, hideModal } = usePopUpModal()

  const [isAuthor, setIsAuthor] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { isMobile } = useDevice()

  // edit comment state
  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState(comment?.content)

  useEffect(() => {
    setTotalCount(upvoteCount - downvoteCount)
  }, [upvoteCount, downvoteCount])

  const handleEditComment = async () => {
    if (!comment) return
    setEditing(true)
    hideModal()
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
        hideModal()
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
    } finally {
      hideModal()
    }
  }

  const onCommentChange = useCallback((e) => {
    setContent(e.target.value)
  }, [])

  const showMoreOptions = (e) => {
    if (!isAuthor) {
      notifyInfo('It may happen that some buttons are under construction.')
      return
    }
    if (isMobile) {
      // open the bottom drawer
      setIsDrawerOpen(true)
      return
    }
    // setShowOptions(!showOptions)
    showModal({
      component: (
        // <CommentDropdown
        //   handleEditComment={handleEditComment}
        //   handleDeleteComment={handleDeleteComment}
        // />
        <>
          <MoreOptionsModal
            list={[
              {
                label: 'Edit Comment',
                onClick: async () => {
                  handleEditComment()
                  setIsDrawerOpen(false)
                },
                icon: () => <BiEdit className="mr-1.5 w-4 h-4 sm:w-6 sm:h-6" />
              },
              {
                label: 'Delete Comment',
                onClick: async () => {
                  await handleDeleteComment
                  setIsDrawerOpen(false)
                },
                icon: () => (
                  <HiOutlineTrash className="mr-1.5 w-4 h-4 sm:w-6 sm:h-6" />
                )
              }
            ]}
          />
        </>
      ),
      type: modalType.customposition,
      onAction: () => {},
      extraaInfo: {
        top: e.currentTarget.getBoundingClientRect().bottom + 'px',
        right:
          window.innerWidth -
          e.currentTarget.getBoundingClientRect().right +
          'px'
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
    }
  }

  return (
    <>
      {comment && (
        <div className="px-3 sm:px-5 w-full bg-s-bg my-3 sm:rounded-2xl py-2">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center">
              <ImageWithPulsingLoader
                src={
                  comment.authorAvatar ? comment.authorAvatar : '/gradient.jpg'
                }
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
              />
              <Link
                href={`/u/${comment.author}`}
                className="hover:underline ml-2 font-bold text-base "
              >
                u/
                {comment.authorName
                  ? comment.authorName
                  : comment.author.substring(0, 6) + '...'}
              </Link>
              <div className="text-xs sm:text-sm text-s-text ml-2">
                <ReactTimeAgo
                  date={new Date(comment.updatedAt || comment.createdAt)}
                  locale="en-US"
                />
              </div>
            </div>
            {isAuthor && (
              <>
                <div className="relative">
                  <RiMore2Fill
                    className="hover:cursor-pointer w-4 h-4 sm:w-5 sm:h-5"
                    onClick={showMoreOptions}
                    title="More"
                  />
                </div>

                <BottomDrawerWrapper
                  isDrawerOpen={isDrawerOpen}
                  setIsDrawerOpen={setIsDrawerOpen}
                >
                  <MoreOptionsModal
                    list={[
                      {
                        label: 'Edit Comment',
                        onClick: handleEditComment,
                        icon: () => (
                          <BiEdit className="mr-1.5 w-4 h-4 sm:w-6 sm:h-6" />
                        )
                      },
                      {
                        label: 'Delete Comment',
                        onClick: handleDeleteComment,
                        icon: () => (
                          <HiOutlineTrash className="mr-1.5 w-4 h-4 sm:w-6 sm:h-6" />
                        )
                      }
                    ]}
                  />
                </BottomDrawerWrapper>
              </>
            )}
          </div>

          <div className="pl-8 sm:pl-10">
            {editing ? (
              <div className="flex items-center justify-between">
                <input
                  className="mt-1 border-b-2 focus:outline-none text-base sm:text-lg sm:text-semibold w-[80%] bg-transparent"
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
                    className="text-base sm:text-[24px] hover:cursor-pointer hover:text-[#66CD00]"
                    title="Save"
                    onClick={submitEdittedComment}
                  />
                </div>
              </div>
            ) : (
              <div className="mt-1">{comment.content}</div>
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
            </div>
          </div>
        </div>
      )}
      {!comment && <></>}
    </>
  )
}

export default SingleComment
