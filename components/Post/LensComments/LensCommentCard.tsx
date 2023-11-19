import { Tooltip } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { memo, useEffect, useState } from 'react'
import { HiOutlineTrash } from 'react-icons/hi'
import { RiMore2Fill } from 'react-icons/ri'
import { TbArrowsDiagonalMinimize } from 'react-icons/tb'
import ReactTimeAgo from 'react-time-ago'
import {
  Comment,
  PublicationReactionType,
  TriStateValue,
  useAddReactionMutation,
  useHidePublicationMutation
} from '../../../graphql/generated'
import { useLensUserContext } from '../../../lib/LensUserContext'
import { pollUntilIndexed } from '../../../lib/indexer/has-transaction-been-indexed'
import { useCommentStore } from '../../../store/comment'
import { commentIdFromIndexedResult } from '../../../utils/utils'
import { useNotify } from '../../Common/NotifyContext'
import OptionsWrapper from '../../Common/OptionsWrapper'
import CenteredDot from '../../Common/UI/CenteredDot'
import ImageWithPulsingLoader from '../../Common/UI/ImageWithPulsingLoader'
import MoreOptionsModal from '../../Common/UI/MoreOptionsModal'
import formatHandle from '../../User/lib/formatHandle'
import LensCreateComment from './LensCreateComment'
import LensRepliedComments from './LensRepliesComments'
// import AttachmentMedia from '../Attachment'
import clsx from 'clsx'
import Markup from '../../Lexical/Markup'
import getAvatar from '../../User/lib/getAvatar'
import Attachment from '../Attachment'
import MirrorButton from '../MirrorButton'
import getPublicationData from '../../../lib/post/getPublicationData'

const LensCommentCard = ({
  comment,
  level = 0,
  hideBottomRow = false
}: {
  comment: Comment
  hideBottomRow?: boolean
  level?: number
}) => {
  const [comments, setComments] = useState([])
  const [hideComments, setHideComments] = useState(false)
  const [hoveringVerticalBar, setHoveringVerticalBar] = useState(false)
  const router = useRouter()
  const { notifyInfo } = useNotify()
  const [reaction, setReaction] = useState(comment?.operations?.hasReacted)
  const [voteCount, setVoteCount] = useState(comment?.stats?.reactions)

  const { mutateAsync: addReaction } = useAddReactionMutation()
  const { isSignedIn, hasProfile, data: lensProfile } = useLensUserContext()
  const [isAuthor, setIsAuthor] = useState(
    lensProfile?.defaultProfile?.id === comment?.by?.id
  )

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showOptionsModal, setShowOptionsModal] = useState(false)
  const currentReplyComment = useCommentStore(
    (state) => state.currentReplyComment
  )
  const setCurrentReplyComment = useCommentStore(
    (state) => state.setCurrentReplyComment
  )

  const { mutateAsync: deleteComment } = useHidePublicationMutation()

  useEffect(() => {
    if (!comment || !lensProfile) return
    setIsAuthor(lensProfile?.defaultProfile?.id === comment?.by?.id)
  }, [comment, lensProfile])

  useEffect(() => {
    setReaction(comment?.operations?.hasReacted)
    setVoteCount(comment?.stats?.reactions)
  }, [comment])

  const handleUpvote = async () => {
    if (reaction) return
    if (!comment?.id) {
      notifyInfo('not indexed yet, try in a moment')
      return
    }
    try {
      if (!isSignedIn || !hasProfile) {
        notifyInfo('How about loging in lens, first?')
        return
      }

      setReaction(true)
      setVoteCount(voteCount + 1)
      await addReaction({
        request: {
          for: comment.id,
          reaction: PublicationReactionType.Upvote
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  // const handleDownvote = async () => {
  //   if (reaction === ReactionTypes.Downvote) return
  //   try {
  //     if (!isSignedIn || !hasProfile) {
  //       notifyInfo('How about loging in lens, first?')
  //       return
  //     }
  //     if (!comment?.id) {
  //       notifyInfo('not indexed yet, try in a moment')
  //       return
  //     }
  //     setReaction(ReactionTypes.Downvote)
  //     if (reaction === ReactionTypes.Upvote) {
  //       setUpvoteCount(upvoteCount - 1)
  //       setDownvoteCount(downvoteCount + 1)
  //     } else {
  //       setDownvoteCount(downvoteCount + 1)
  //     }
  //     await addReaction({
  //       request: {
  //         profileId: lensProfile.defaultProfile.id,
  //         publicationId: comment.id,
  //         reaction: ReactionTypes.Downvote
  //       }
  //     })
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const handleDeleteComment = async () => {
    if (!comment?.id) {
      notifyInfo('not indexed yet, try in a moment')
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
          for: comment.id
        }
      })
      router.reload()
    } catch (error) {
      console.log(error)
    }
  }

  const addComment = async (tx, comment) => {
    setCurrentReplyComment(null)
    if (!tx && comment?.id) {
      await addReaction({
        request: {
          for: comment.id,
          reaction: PublicationReactionType.Upvote
        }
      })
      setComments([comment, ...comments])
      return
    }
    const prevComments = comments
    const newCommentsFirstPhase = [comment, ...prevComments]

    try {
      setComments(newCommentsFirstPhase)
      const indexResult = await pollUntilIndexed(tx)
      const commentId = commentIdFromIndexedResult(
        lensProfile?.defaultProfile?.id,
        indexResult
      )
      await addReaction({
        request: {
          for: commentId,
          reaction: PublicationReactionType.Upvote
        }
      })

      const newCommentsSecondPhase = newCommentsFirstPhase.map((c) =>
        c.tempId === comment.tempId ? { ...c, id: commentId } : c
      )
      // add id to that comment
      setComments(newCommentsSecondPhase)
    } catch (error) {
      console.log(error)
    }
  }

  if (!comment) return null

  const filteredAttachments =
    getPublicationData(comment?.metadata)?.attachments || []

  const filteredAsset = getPublicationData(comment?.metadata)?.asset

  return (
    <>
      <div className="w-full">
        {/* top row */}
        <div
          className={clsx(
            'flex flex-row items-center justify-between w-full',
            hideComments && 'pb-2'
          )}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <div className="flex flex-row items-center gap-2">
            {hideComments && (
              <TbArrowsDiagonalMinimize
                onClick={() => {
                  setHideComments(false)
                }}
                className="text-s-text cursor-pointer hover:text-p-text"
              />
            )}
            <ImageWithPulsingLoader
              src={getAvatar(comment?.by)}
              className="w-7 h-7 rounded-full object-cover"
            />
            {/* {comment?.profile?.name && (
              <Link
                href={`/u/${formatHandle(comment?.profile?.handle)}`}
                passHref
              >
                <div className="hover:underline font-bold text-p-text cursor-pointer">
                  {stringToLength(comment?.profile?.name, 20)}
                </div>
              </Link>
            )} */}
            <Link href={`/u/${formatHandle(comment?.by?.handle)}`} passHref>
              <div className="hover:underline font-medium text-p-text text-sm cursor-pointer">
                {formatHandle(comment?.by?.handle)}
              </div>
            </Link>
            <CenteredDot />
            <ReactTimeAgo
              timeStyle="twitter"
              className="text-xs sm:text-sm text-s-text"
              date={new Date(comment.createdAt)}
              locale="en-US"
            />
          </div>
          {!comment.id && (
            <div className="sm:mr-5 flex flex-row items-center">
              {/* pulsing dot */}
              <Tooltip
                enterDelay={1000}
                leaveDelay={200}
                title="Indexing"
                arrow
              >
                <div className="w-2 h-2 rounded-full bg-p-btn animate-ping" />
              </Tooltip>
            </div>
          )}
          {isAuthor && comment.id && !comment.isHidden && (
            <div>
              <OptionsWrapper
                OptionPopUpModal={() => (
                  <MoreOptionsModal
                    list={[
                      {
                        label: 'Delete',
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
                <Tooltip enterDelay={1000} leaveDelay={200} title="More" arrow>
                  <div className="hover:bg-s-hover rounded-md p-1 cursor-pointer">
                    <RiMore2Fill className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </Tooltip>
              </OptionsWrapper>
            </div>
          )}
        </div>

        {/* padded content with line*/}
        <div
          className={clsx('flex flex-row w-full ', hideComments && 'hidden')}
        >
          {/* vertical line */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setHideComments(true)
              setHoveringVerticalBar(false)
            }}
            onMouseEnter={() => {
              setHoveringVerticalBar(true)
            }}
            onMouseLeave={() => {
              setHoveringVerticalBar(false)
            }}
            className="w-7 shrink-0 flex flex-row items-center justify-center py-2"
          >
            <div
              className={clsx(
                'border-l-2  h-full',
                hoveringVerticalBar ? 'border-s-text' : 'border-s-border'
              )}
            ></div>
          </button>

          <div className={clsx('w-full', hideBottomRow && 'pt-1')}>
            {/* content */}
            <div className="pl-2">
              <Markup className="break-words text-sm sm:text-base">
                {comment?.metadata?.content}
              </Markup>
            </div>

            {/* attachemnt */}
            <div className="px-3">
              <Attachment
                publication={comment}
                className={'max-h-[400px] w-full'}
                attachments={filteredAttachments}
                asset={filteredAsset}
              />
            </div>

            {/* last row */}
            {!hideBottomRow ? (
              <div className="flex flex-row items-center space-x-6 pb-2 pt-1">
                {/* upvote and downvote */}
                <div className="flex flex-row items-center gap-x-2">
                  <Tooltip
                    enterDelay={1000}
                    leaveDelay={200}
                    title="Upvote"
                    arrow
                  >
                    <button
                      onClick={handleUpvote}
                      className="hover:bg-s-hover cursor-pointer rounded-md p-1"
                    >
                      <img
                        src={
                          reaction ? '/UpvotedFilled.svg' : '/upvoteGray.svg'
                        }
                        className="w-4 h-4"
                      />
                    </button>
                  </Tooltip>
                  <div className="font-medium text-[#687684]">{voteCount}</div>
                  {/* <Tooltip
                    enterDelay={1000}
                    leaveDelay={200}
                    title="Downvote"
                    arrow
                  >
                    <button
                      onClick={handleDownvote}
                      className="hover:bg-s-hover rounded-md p-1 cursor-pointer"
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
                  </Tooltip> */}
                </div>

                {/* @ts-ignore */}
                <MirrorButton postInfo={comment} isComment />

                {/* reply button*/}
                <button
                  className={`${
                    currentReplyComment &&
                    comment?.id &&
                    currentReplyComment?.id === comment?.id
                      ? 'bg-p-btn-hover text-p-btn-hover-text'
                      : ''
                  } active:bg-p-btn-hover sm:hover:bg-s-hover px-2 py-0.5 rounded-md`}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (!isSignedIn || !hasProfile) {
                      notifyInfo(
                        'Lens login required, so they can know who you are'
                      )
                      return
                    }
                    if (!comment?.id) {
                      notifyInfo('not indexed yet, try in a moment')
                      return
                    }
                    if (comment?.id === currentReplyComment?.id) {
                      setCurrentReplyComment(null)
                    } else {
                      setCurrentReplyComment(comment)
                    }
                  }}
                >
                  Reply
                </button>
              </div>
            ) : (
              <div className="h-3" />
            )}

            {/* create comment if showCreateComment is true */}
            {currentReplyComment && currentReplyComment?.id === comment?.id && (
              <LensCreateComment
                postId={comment.id}
                addComment={addComment}
                postInfo={comment}
                canCommnet={
                  comment?.operations?.canComment === TriStateValue.Yes
                }
              />
            )}

            {/* replies */}
            {comment?.id && (
              <div className="w-full">
                <LensRepliedComments
                  commentId={comment.id}
                  comments={comments}
                  hideBottomRow={hideBottomRow}
                  setComments={setComments}
                  disableFetch={!comment?.__typename}
                  level={level + 1}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(LensCommentCard)
