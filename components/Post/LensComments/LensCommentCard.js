import React, { useEffect, useState } from 'react'
import ReactTimeAgo from 'react-time-ago'
import Link from 'next/link'
import {
  ReactionTypes,
  useAddReactionMutation,
  useHidePublicationMutation
} from '../../../graphql/generated'
import { useLensUserContext } from '../../../lib/LensUserContext'
import { useNotify } from '../../Common/NotifyContext'
import ImageWithPulsingLoader from '../../Common/UI/ImageWithPulsingLoader'
import { LensInfuraEndpoint } from '../../../utils/config'
import LensRepliedComments from './LensRepliesComments'
import LensCreateComment from './LensCreateComment'
import { modalType, usePopUpModal } from '../../Common/CustomPopUpProvider'
import MoreOptionsModal from '../../Common/UI/MoreOptionsModal'
import { useRouter } from 'next/router'
import { HiOutlineTrash } from 'react-icons/hi'
import useDevice from '../../Common/useDevice'
import PopUpWrapper from '../../Common/PopUpWrapper'
import { pollUntilIndexed } from '../../../lib/indexer/has-transaction-been-indexed'
import { commentIdFromIndexedResult } from '../../../utils/utils'
import { RiMore2Fill } from 'react-icons/ri'
import OptionsWrapper from '../../Common/OptionsWrapper'
import getStampFyiURL from '../../User/lib/getStampFyiURL'
import { Tooltip } from '@mui/material'

const LensCommentCard = ({ comment }) => {
  const router = useRouter()
  const [showCreateComment, setShowCreateComment] = useState(false)
  const { notifyInfo } = useNotify()
  const [reaction, setReaction] = useState(comment?.reaction)
  const [upvoteCount, setUpvoteCount] = useState(
    comment?.stats?.totalUpvotes ? comment?.stats?.totalUpvotes : 0
  )
  const [downvoteCount, setDownvoteCount] = useState(
    comment?.stats?.totalDownvotes ? comment?.stats?.totalDownvotes : 0
  )

  useEffect(() => {
    if (!comment?.stats) return
    setUpvoteCount(comment?.stats?.totalUpvotes)
    setDownvoteCount(comment?.stats?.totalDownvotes)
  }, [comment.stats])

  const [voteCount, setVoteCount] = useState(upvoteCount - downvoteCount)
  const { mutateAsync: addReaction } = useAddReactionMutation()
  const { isSignedIn, hasProfile, data: lensProfile } = useLensUserContext()
  const [isAuthor, setIsAuthor] = useState(
    lensProfile?.defaultProfile?.id === comment?.profile?.id
  )
  const { isMobile } = useDevice()

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showOptionsModal, setShowOptionsModal] = useState(false)

  const { showModal, hideModal } = usePopUpModal()

  const { mutateAsync: deleteComment } = useHidePublicationMutation()

  useEffect(() => {
    if (!comment || !lensProfile) return
    setIsAuthor(lensProfile?.defaultProfile?.id === comment?.profile?.id)
  }, [comment, lensProfile])

  const [comments, setComments] = useState([])

  useEffect(() => {
    setComments([])
  }, [comment?.id])

  useEffect(() => {
    setVoteCount(upvoteCount - downvoteCount)
  }, [upvoteCount, downvoteCount])

  const handleUpvote = async () => {
    if (reaction === ReactionTypes.Upvote) return
    if (!comment?.id) {
      notifyInfo('not indexed yet, try again later')
      return
    }
    try {
      if (!isSignedIn || !hasProfile) {
        notifyInfo('How about loging in lens, first?')
        return
      }

      setReaction(ReactionTypes.Upvote)
      if (reaction === ReactionTypes.Downvote) {
        setDownvoteCount(downvoteCount - 1)
        setUpvoteCount(upvoteCount + 1)
      } else {
        setUpvoteCount(upvoteCount + 1)
      }
      await addReaction({
        request: {
          profileId: lensProfile.defaultProfile.id,
          publicationId: comment.id,
          reaction: ReactionTypes.Upvote
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleDownvote = async () => {
    if (reaction === ReactionTypes.Downvote) return
    try {
      if (!isSignedIn || !hasProfile) {
        notifyInfo('How about loging in lens, first?')
        return
      }
      if (!comment?.id) {
        notifyInfo('not indexed yet, try again later')
        return
      }
      setReaction(ReactionTypes.Downvote)
      if (reaction === ReactionTypes.Upvote) {
        setUpvoteCount(upvoteCount - 1)
        setDownvoteCount(downvoteCount + 1)
      } else {
        setDownvoteCount(downvoteCount + 1)
      }
      await addReaction({
        request: {
          profileId: lensProfile.defaultProfile.id,
          publicationId: comment.id,
          reaction: ReactionTypes.Downvote
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteComment = async () => {
    if (!comment?.id) {
      notifyInfo('not indexed yet, try again later')
      return
    }
    try {
      if (!isSignedIn || !hasProfile) {
        notifyInfo('How about loging in lens, first?')
        return
      }
      if (!isAuthor) {
        notifyInfo('You are not the author of this comment')
        return
      }
      await deleteComment({
        request: {
          publicationId: comment.id
        }
      })
      router.reload()
      hideModal()
    } catch (error) {
      console.log(error)
    }
  }

  const addComment = async (tx, comment) => {
    const prevComments = comments
    const newCommentsFirstPhase = [comment, ...prevComments]
    setComments(newCommentsFirstPhase)
    setShowCreateComment(false)
    hideModal()
    const indexResult = await pollUntilIndexed(tx)
    const commentId = commentIdFromIndexedResult(
      lensProfile?.defaultProfile?.id,
      indexResult
    )

    await addReaction({
      request: {
        profileId: lensProfile.defaultProfile.id,
        publicationId: commentId,
        reaction: ReactionTypes.Upvote
      }
    })

    const newCommentsSecondPhase = newCommentsFirstPhase.map((c) =>
      c.tempId === comment.tempId ? { ...c, id: commentId } : c
    )
    // add id to that comment
    setComments(newCommentsSecondPhase)
  }

  const openReplyModal = async () => {
    if (!isSignedIn || !hasProfile) {
      notifyInfo('How about loging in lens, first?')
      return
    }

    // showModal({
    //   component: (
    //     <PopUpWrapper title={'Reply'} label={'Reply'} loading={false}>
    //       <LensCreateComment
    //         postId={comment.id}
    //         addComment={addComment}
    //         isReply={true}
    //         replyCommentData={comment}
    //       />
    //     </PopUpWrapper>
    //   ),
    //   type: modalType.fullscreen,
    //   onAction: () => {},
    //   extraaInfo: {}
    // })
  }
  const [isMobileReply, setIsMobileReply] = useState(false)

  const handleMobileReply = async () => {
    if (!isSignedIn || !hasProfile) {
      notifyInfo('How about loging in lens, first?')
      return
    }

    setIsMobileReply((prev) => !prev)
  }

  return (
    <>
      {comment && (
        <div className="w-full">
          {/* top row */}
          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex flex-row items-center gap-2">
              {/* commenting for now */}
              {/* todo : ability to set lens profile image and fetch here */}

              <ImageWithPulsingLoader
                src={
                  comment?.profile?.picture?.original?.url?.startsWith('ipfs')
                    ? `${LensInfuraEndpoint}${
                        comment?.profile?.picture?.original?.url.split('//')[1]
                      }`
                    : getStampFyiURL(comment?.profile?.ownedBy)
                }
                className="w-6 h-6 rounded-full mr-1"
              />

              <Link href={`/u/${comment?.profile?.handle}`} passHref>
                <div className="hover:underline font-bold text-base">
                  u/{comment?.profile?.handle}
                </div>
              </Link>
              <ReactTimeAgo
                className="text-xs sm:text-sm text-s-text"
                date={new Date(comment.createdAt)}
                locale="en-US"
              />
            </div>
            {!comment.id && (
              <div className="sm:mr-5 flex flex-row items-center">
                {/* pulsing dot */}
                <Tooltip title="Indexing" arrow>
                  <div className="w-2 h-2 rounded-full bg-p-btn animate-ping" />
                </Tooltip>
              </div>
            )}
            {isAuthor && comment.id && (
              <div>
                <OptionsWrapper
                  OptionPopUpModal={() => (
                    <MoreOptionsModal
                      list={[
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
                  <Tooltip title="More" arrow>
                    <div className="hover:bg-p-btn-hover rounded-md p-1 cursor-pointer">
                      <RiMore2Fill className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </Tooltip>
                </OptionsWrapper>
              </div>
            )}
          </div>

          {/* padded content with line*/}
          <div className="flex flex-row w-full">
            {/* vertical line */}
            <div className="w-7 flex flex-row items-center justify-center py-2">
              <div className="border-l-2 border-gray-300 h-full"></div>
            </div>
            <div className="w-full">
              {/* content */}
              <div className="mt-1">{comment?.metadata?.content}</div>

              {/* last row */}
              <div className="flex flex-row items-center space-x-6 pb-2 pt-1">
                {/* upvote and downvote */}
                <div className="flex flex-row items-center gap-x-2">
                  <Tooltip title="Upvote" arrow>
                    <button
                      onClick={handleUpvote}
                      className="hover:bg-p-btn-hover cursor-pointer rounded-md p-1"
                    >
                      <img
                        src={
                          reaction === ReactionTypes.Upvote
                            ? '/UpvotedFilled.svg'
                            : '/upvoteGray.svg'
                        }
                        className="w-4 h-4"
                      />
                    </button>
                  </Tooltip>
                  <div className="font-medium text-[#687684]">{voteCount}</div>
                  <Tooltip title="Downvote" arrow>
                    <button
                      onClick={handleDownvote}
                      className="hover:bg-p-btn-hover rounded-md p-1 cursor-pointer"
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
                <button
                  className={`${
                    showCreateComment
                      ? 'bg-p-btn-hover text-p-btn-hover-text'
                      : ''
                  } hover:bg-p-btn-hover px-2 py-0.5 rounded-md`}
                  onClick={() => {
                    if (!comment?.id) {
                      notifyInfo('not indexed yet, try again later')
                      return
                    }
                    if (isMobile) {
                      handleMobileReply()
                    } else {
                      setShowCreateComment(!showCreateComment)
                    }
                  }}
                >
                  Reply
                </button>
              </div>

              {/* create comment if showCreateComment is true */}
              {showCreateComment && !isMobile && (
                <LensCreateComment
                  postId={comment.id}
                  addComment={addComment}
                />
              )}

              {/* create comment if isMobileReply is true */}
              {isMobileReply && isMobile && (
                <LensCreateComment
                  postId={comment.id}
                  addComment={addComment}
                  isMobileReply={isMobileReply}
                  replyCommentData={comment}
                />
              )}

              {/* replies */}
              {comment?.id && (
                <div className="w-full">
                  <LensRepliedComments
                    commentId={comment.id}
                    comments={comments}
                    setComments={setComments}
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

export default LensCommentCard
