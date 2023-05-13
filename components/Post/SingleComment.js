import React, { useState, useEffect, useCallback } from 'react'
import ReactTimeAgo from 'react-time-ago'
import { AiOutlineCheck } from 'react-icons/ai'

import {
  deleteComment,
  putEditComment,
  putUpvoteComment,
  putDownvoteComment
} from '../../apiHelper/comment'
import { useProfile } from '../Common/WalletContext'
import { useNotify } from '../Common/NotifyContext'
import { ReactionTypes } from '../../graphql/generated'
import Link from 'next/link'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import MoreOptionsModal from '../Common/UI/MoreOptionsModal'
import { BiEdit } from 'react-icons/bi'
import { HiOutlineTrash } from 'react-icons/hi'
import { RiMore2Fill } from 'react-icons/ri'
import OptionsWrapper from '../Common/OptionsWrapper'
import getStampFyiURL from '../User/lib/getStampFyiURL'
import { Tooltip } from '@mui/material'

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

  const [isAuthor, setIsAuthor] = useState(false)

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showOptionsModal, setShowOptionsModal] = useState(false)

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
      await deleteComment(comment?._id)
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
                  comment.authorAvatar
                    ? comment.authorAvatar
                    : getStampFyiURL(comment?.author)
                }
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
              />
              <Link href={`/u/${comment.author}`}>
                <div className="hover:underline ml-2 font-bold text-base ">
                  u/
                  {comment.authorName
                    ? comment.authorName
                    : comment.author.substring(0, 6) + '...'}
                </div>
              </Link>
              <div className="text-xs sm:text-sm text-s-text ml-2">
                <ReactTimeAgo
                  timeStyle="twitter"
                  date={new Date(comment.updatedAt || comment.createdAt)}
                  locale="en-US"
                />
              </div>
            </div>
            <div>
              {isAuthor && (
                <OptionsWrapper
                  OptionPopUpModal={() => (
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
                  )}
                  position="left"
                  showOptionsModal={showOptionsModal}
                  setShowOptionsModal={setShowOptionsModal}
                  isDrawerOpen={isDrawerOpen}
                  setIsDrawerOpen={setIsDrawerOpen}
                >
                  <Tooltip
                    enterDelay={1000}
                    leaveDelay={200}
                    title="More"
                    arrow
                  >
                    <div className="hover:bg-p-btn-hover rounded-md p-1 cursor-pointer">
                      <RiMore2Fill className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </Tooltip>
                </OptionsWrapper>
              )}
            </div>
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
                <Tooltip enterDelay={1000} leaveDelay={200} title="Save" arrow>
                  <div className="flex items-center hover:bg-p-btn-hover hover:text-[#66CD00] rounded-md p-1">
                    <AiOutlineCheck
                      className="text-base sm:text-[24px] cursor-pointer"
                      onClick={submitEdittedComment}
                    />
                  </div>
                </Tooltip>
              </div>
            ) : (
              <div className="mt-1">{comment.content}</div>
            )}

            <div className="flex flex-row items-end space-x-14">
              {/* upvote and downvote */}
              <div className="flex flex-row items-center gap-x-2 pt-2">
                <Tooltip
                  enterDelay={1000}
                  leaveDelay={200}
                  title="Upvote"
                  arrow
                >
                  <button
                    onClick={handleUpvote}
                    className="flex flex-row items-center rounded-md p-1 hover:bg-p-btn-hover cursor-pointer"
                  >
                    <img
                      //  onClick={liked ? handleUnLike : handleLike}
                      src={
                        reaction === ReactionTypes.Upvote
                          ? '/UpvotedFilled.svg'
                          : '/upvoteGray.svg'
                      }
                      className="w-4 h-4"
                    />
                  </button>
                </Tooltip>
                <div className="font-medium text-[#687684]">{totalCount}</div>
                <Tooltip
                  enterDelay={1000}
                  leaveDelay={200}
                  title="Downvote"
                  arrow
                >
                  <button
                    onClick={handleDownvote}
                    className="flex flex-row items-center rounded-md p-1 hover:bg-p-btn-hover cursor-pointer"
                  >
                    <img
                      src={
                        reaction === ReactionTypes.Downvote
                          ? '/DownvotedFilled.svg'
                          : '/downvoteGray.svg'
                      }
                      className="w-4 h-4"
                    />
                  </button>
                </Tooltip>
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
