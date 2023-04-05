import React, { useEffect, useState } from 'react'
import ReactTimeAgo from 'react-time-ago'
import Link from 'next/link'
import {
  ReactionTypes,
  useAddReactionMutation,
  useHidePublicationMutation,
  useRemoveReactionMutation
} from '../../graphql/generated'
// import { FaRegComment, FaRegCommentDots } from 'react-icons/fa'
import { useNotify } from '../Common/NotifyContext'
import {
  appId,
  appLink,
  MAX_CONTENT_LINES_FOR_POST,
  showNameForThisAppIds
} from '../../utils/config'
import { useLensUserContext } from '../../lib/LensUserContext'
import JoinCommunityButton from '../Community/JoinCommunityButton'
import useDevice from '../Common/useDevice'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import { useRouter } from 'next/router'
// import VideoWithAutoPause from '../Common/UI/VideoWithAutoPause'
import Markup from '../Lexical/Markup'
import {
  countLinesFromMarkdown,
  // deleteFirebaseStorageFile,
  stringToLength
  // unpinFromIpfsInfura
} from '../../utils/utils'
import { HiOutlineTrash } from 'react-icons/hi'
import MoreOptionsModal from '../Common/UI/MoreOptionsModal'
import PostShareButton from './PostShareButton'
import { RiMore2Fill } from 'react-icons/ri'
import LensCollectButton from './Collect/LensCollectButton'
import OptionsWrapper from '../Common/OptionsWrapper'
import { Tooltip } from '@mui/material'
import Attachment from './Attachment'
import MirrorButton from './MirrorButton'
import CenteredDot from '../Common/UI/CenteredDot'
import formatHandle from '../User/lib/formatHandle'
import { IoIosFlag, IoIosShareAlt } from 'react-icons/io'
import { AiOutlineRetweet } from 'react-icons/ai'
import { postWithCommunityInfoType } from '../../types/post'
import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'
import ReportPopUp from './Report/ReportPopUp'
import getAvatar from '../User/lib/getAvatar'
import { getAllMentionsHandlFromContent } from './PostPageMentionsColumn'
import useLensFollowButton from '../User/useLensFollowButton'
import clsx from 'clsx'
import { deleteLensPublication } from '../../api/lensPublication'

//sample url https://lens.infura-ipfs.io/ipfs/QmUrfgfcoa7yeHefGCsX9RoxbfpZ1eiASQwp5TnCSsguNA

interface Props {
  post: postWithCommunityInfoType
}

// post?.isLensCommunityPost makes sure that the post is a post from a lens community

const LensPostCard = ({ post }: Props) => {
  const { isMobile } = useDevice()
  const { notifyInfo } = useNotify()
  const { showModal } = usePopUpModal()
  const [reaction, setReaction] = useState(post?.reaction)
  const [upvoteCount, setUpvoteCount] = useState(post?.stats.totalUpvotes)
  const [downvoteCount, setDownvoteCount] = useState(post?.stats.totalDownvotes)
  const [voteCount, setVoteCount] = useState(
    post?.stats?.totalUpvotes - post?.stats?.totalDownvotes
  )
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showOptionsModal, setShowOptionsModal] = useState(false)
  const [postInfo, setPostInfo] = useState<postWithCommunityInfoType>(post)
  useEffect(() => {
    setVoteCount(upvoteCount - downvoteCount)
  }, [upvoteCount, downvoteCount])

  //update stats if post is updated
  useEffect(() => {
    setPostInfo(post)
    setReaction(post?.reaction)
    setUpvoteCount(post?.stats.totalUpvotes)
    setDownvoteCount(post?.stats.totalDownvotes)
  }, [post])

  const { mutateAsync: addReaction } = useAddReactionMutation()
  const { mutateAsync: removeReaction } = useRemoveReactionMutation()
  const { isSignedIn, hasProfile, data: lensProfile } = useLensUserContext()
  const [isAuthor, setIsAuthor] = useState(
    lensProfile?.defaultProfile?.id === post?.profile?.id
  )

  useEffect(() => {
    if (!post || !lensProfile) return
    setIsAuthor(lensProfile?.defaultProfile?.id === post?.profile?.id)
  }, [post, lensProfile])

  const { mutateAsync: removePost } = useHidePublicationMutation()
  const { FollowButton } = useLensFollowButton(
    {
      profileId: post?.profile?.id
    },
    'join'
  )

  const handleUpvote = async () => {
    if (reaction === ReactionTypes.Upvote) {
      try {
        if (!isSignedIn || !hasProfile) {
          notifyInfo('How about loging in lens, first?')
          return
        }

        await removeReaction({
          request: {
            profileId: lensProfile.defaultProfile.id,
            publicationId: post.id,
            reaction: ReactionTypes.Upvote
          }
        })
        setReaction(null)
        setUpvoteCount(upvoteCount - 1)
        return
      } catch (error) {
        console.log(error)
      }
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
          publicationId: post.id,
          reaction: ReactionTypes.Upvote
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleDownvote = async () => {
    if (reaction === ReactionTypes.Downvote) {
      try {
        if (!isSignedIn || !hasProfile) {
          notifyInfo('How about loging in lens, first?')
          return
        }
        await removeReaction({
          request: {
            profileId: lensProfile.defaultProfile.id,
            publicationId: post.id,
            reaction: ReactionTypes.Downvote
          }
        })
        setReaction(null)
        setDownvoteCount(downvoteCount - 1)
        return
      } catch (error) {
        console.log(error)
      }
    }
    try {
      if (!isSignedIn || !hasProfile) {
        notifyInfo('How about loging in lens, first?')
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
          publicationId: post.id,
          reaction: ReactionTypes.Downvote
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
  const router = useRouter()
  const [showMore, setShowMore] = useState(
    (countLinesFromMarkdown(postInfo?.metadata?.content) >
      MAX_CONTENT_LINES_FOR_POST ||
      postInfo?.metadata?.content?.length > 400) &&
      router.pathname !== '/p/[id]'
  )

  useEffect(() => {
    setShowMore(
      (countLinesFromMarkdown(postInfo?.metadata?.content) >
        MAX_CONTENT_LINES_FOR_POST ||
        postInfo?.metadata?.content?.length > 400) &&
        router.pathname !== '/p/[id]'
    )
  }, [postInfo])

  const handleDeletePost = async () => {
    try {
      await removePost({
        request: {
          publicationId: post?.id
        }
      })
      await deleteLensPublication(post?.id)

      // if (post?.metadata?.media?.length > 0) {
      //   const medias = post?.metadata?.media
      //   for (const media of medias) {
      //     if (media?.original?.url?.startsWith('ipfs://')) {
      //       try {
      //         const hash = media?.original?.url?.split('ipfs://')[1]
      //         await unpinFromIpfsInfura(hash)
      //       } catch (error) {
      //         console.log(error)
      //       }
      //     } else if (
      //       media?.original?.url?.startsWith(
      //         'https://firebasestorage.googleapis.com/v0/b/diversehq-21330.appspot.com'
      //       )
      //     ) {
      //       await deleteFirebaseStorageFile(media?.original?.url)
      //     }
      //   }
      // }
    } catch (error) {
      console.log(error)
      console.log('error')
      window.location.reload()
    } finally {
      console.log('finally')
      window.location.reload()
    }
  }

  const isBlur =
    !router.pathname.startsWith('/p') && postInfo?.metadata?.contentWarning

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        url: `${process.env.NEXT_PUBLIC_APP_URL}/p/${postInfo.id}`
      })
    } else {
      notifyInfo('Sharing is not supported on your device')
    }
  }

  const handleReportPost = () => {
    if (!isSignedIn) {
      notifyInfo('How about loging in lens, first?')
      return
    }
    showModal({
      component: (
        <ReportPopUp
          publicationId={postInfo?.id}
          communityId={postInfo?.metadata?.tags[0]}
        />
      ),
      type: modalType.normal
    })
  }

  let content = postInfo?.metadata?.content || ''

  if (content) {
    if (postInfo?.isLensCommunityPost) {
      content = content.split('\n').slice(2).join('\n')
    }
    if (
      content?.startsWith(postInfo?.metadata?.name) &&
      showNameForThisAppIds.includes(postInfo?.appId)
    ) {
      content = content.slice(postInfo?.metadata?.name.length)
    }
  }

  return (
    <>
      {postInfo && (
        <div
          className={`sm:px-5 noSelect flex flex-col w-full bg-s-bg hover:bg-s-bg-hover pt-3 sm:pb-2 border-b-[1px] border-[#eee] dark:border-p-border ${
            router.pathname.startsWith('/p')
              ? 'sm:my-3 sm:rounded-2xl sm:border-[1px] sm:border-s-border'
              : 'cursor-pointer'
          }`}
          onClick={() => {
            if (router.pathname.startsWith('/p')) return
            router.push(`/p/${postInfo.id}`)
          }}
        >
          {/* top row */}
          {postInfo?.mirroredBy && (
            <div
              className="flex flex-row space-x-1 items-center ml-4 md:ml-1 mb-1 text-xs text-s-text"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <AiOutlineRetweet className="w-4 h-4 pr-0.5" />
              <Link href={`/u/${formatHandle(postInfo?.mirroredBy?.handle)}`}>
                <div className="hover:underline">
                  {`u/${formatHandle(postInfo?.mirroredBy?.handle)}`}{' '}
                </div>
              </Link>
              <span className="pl-0.5">{'mirrored'}</span>
            </div>
          )}
          <div className="px-3 sm:px-0 flex flex-row items-center justify-between mb-1  w-full">
            {!isMobile && (
              <>
                <div className="flex flex-row flex-wrap w-full items-center">
                  <span onClick={(e) => e.stopPropagation()}>
                    <div
                      onClick={() => {
                        if (postInfo?.communityInfo?._id) {
                          if (postInfo?.isLensCommunityPost) {
                            router.push(
                              `/l/${formatHandle(postInfo?.profile?.handle)}`
                            )
                          } else {
                            router.push(`/c/${postInfo?.communityInfo?.name}`)
                          }
                        } else {
                          window.open(postInfo?.communityInfo?.link, '_blank')
                        }
                      }}
                    >
                      <ImageWithPulsingLoader
                        src={
                          postInfo?.isLensCommunityPost
                            ? getAvatar(postInfo?.profile)
                            : postInfo?.communityInfo?.logoImageUrl
                            ? postInfo?.communityInfo?.logoImageUrl
                            : '/gradient.jpg'
                        }
                        className="rounded-full lg:w-[40px] lg:h-[40px] h-[30px] w-[30px] object-cover cursor-pointer"
                      />
                    </div>
                  </span>

                  <span onClick={(e) => e.stopPropagation()}>
                    <div
                      onClick={() => {
                        if (postInfo?.communityInfo?._id) {
                          if (postInfo?.isLensCommunityPost) {
                            router.push(
                              `/l/${formatHandle(postInfo?.profile?.handle)}`
                            )
                          } else {
                            router.push(`/c/${postInfo?.communityInfo?.name}`)
                          }
                        } else {
                          window.open(postInfo?.communityInfo?.link, '_blank')
                        }
                      }}
                    >
                      <div className="pl-2 font-bold text-sm sm:text-lg hover:cursor-pointer hover:underline text-p-text">
                        {postInfo?.isLensCommunityPost
                          ? `l/${formatHandle(postInfo?.profile?.handle)}`
                          : `${stringToLength(
                              postInfo?.communityInfo?.name,
                              18
                            )}`}
                      </div>
                    </div>
                  </span>

                  <span onClick={(e) => e.stopPropagation()} className="mr-1">
                    <div className="flex flex-row items-center justify-center text-s-text text-xs sm:text-sm">
                      <p className="pl-1.5 font-normal">{' posted by'}</p>
                      <Link
                        href={
                          postInfo?.isLensCommunityPost
                            ? `/u/${formatHandle(
                                getAllMentionsHandlFromContent(
                                  postInfo?.metadata?.content
                                )[0]
                              )}`
                            : `/u/${formatHandle(postInfo?.profile?.handle)}`
                        }
                      >
                        <div className="pl-1.5 font-normal hover:cursor-pointer hover:underline">
                          {postInfo?.isLensCommunityPost
                            ? `u/${formatHandle(
                                getAllMentionsHandlFromContent(
                                  postInfo?.metadata?.content
                                )[0]
                              )}`
                            : `u/${formatHandle(postInfo?.profile?.handle)}`}
                        </div>
                      </Link>
                    </div>
                  </span>
                  <CenteredDot />
                  <div>
                    {postInfo?.createdAt && (
                      <div className="text-xs sm:text-sm text-s-text ml-1">
                        <ReactTimeAgo
                          timeStyle="twitter"
                          date={new Date(postInfo.createdAt)}
                          locale="en-US"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {isMobile && (
              <>
                <div className="flex flex-row w-full items-center">
                  <span onClick={(e) => e.stopPropagation()}>
                    <div
                      onClick={() => {
                        if (postInfo?.communityInfo?._id) {
                          if (postInfo?.isLensCommunityPost) {
                            router.push(
                              `/l/${formatHandle(postInfo?.profile?.handle)}`
                            )
                          } else {
                            router.push(`/c/${postInfo?.communityInfo?.name}`)
                          }
                        } else {
                          window.open(postInfo?.communityInfo?.link, '_blank')
                        }
                      }}
                    >
                      <ImageWithPulsingLoader
                        src={
                          postInfo?.isLensCommunityPost
                            ? getAvatar(postInfo?.profile)
                            : postInfo?.communityInfo?.logoImageUrl
                            ? postInfo?.communityInfo?.logoImageUrl
                            : '/gradient.jpg'
                        }
                        className="rounded-full h-10 w-10 object-cover"
                      />
                    </div>
                  </span>
                  <div className="flex flex-col justify-center items-start text-p-text">
                    <span onClick={(e) => e.stopPropagation()}>
                      <div
                        onClick={() => {
                          if (postInfo?.communityInfo?._id) {
                            if (postInfo?.isLensCommunityPost) {
                              router.push(
                                `/l/${formatHandle(postInfo?.profile?.handle)}`
                              )
                            } else {
                              router.push(`/c/${postInfo?.communityInfo?.name}`)
                            }
                          } else {
                            window.open(postInfo?.communityInfo?.link, '_blank')
                          }
                        }}
                      >
                        <div className="pl-2 font-bold text-sm sm:text-xl hover:cursor-pointer hover:underline">
                          {postInfo?.isLensCommunityPost
                            ? `l/${formatHandle(postInfo?.profile?.handle)}`
                            : `${stringToLength(
                                postInfo?.communityInfo?.name,
                                18
                              )}`}
                        </div>
                      </div>
                    </span>
                    <div className="flex flex-row items-center justify-start">
                      <span onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-row items-center justify-center text-s-text text-xs sm:text-sm">
                          <p className="pl-1.5 font-normal">{' posted by '}</p>
                          <Link
                            href={
                              postInfo?.isLensCommunityPost
                                ? `/u/${formatHandle(
                                    getAllMentionsHandlFromContent(
                                      postInfo?.metadata?.content
                                    )[0]
                                  )}`
                                : `/u/${formatHandle(
                                    postInfo?.profile?.handle
                                  )}`
                            }
                            passHref
                          >
                            <div className="pl-1.5 font-normal hover:cursor-pointer hover:underline">
                              {postInfo?.isLensCommunityPost
                                ? `u/${formatHandle(
                                    getAllMentionsHandlFromContent(
                                      postInfo?.metadata?.content
                                    )[0]
                                  )}`
                                : `u/${formatHandle(
                                    postInfo?.profile?.handle
                                  )}`}
                            </div>
                          </Link>
                        </div>
                      </span>
                      <div>
                        {postInfo?.createdAt && (
                          <div className="text-xs sm:text-sm text-s-text ml-2">
                            <ReactTimeAgo
                              timeStyle="twitter"
                              date={new Date(postInfo.createdAt)}
                              locale="en-US"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            <span onClick={(e) => e.stopPropagation()}>
              <div className="sm:mr-5 flex flex-row items-center">
                {!router.pathname.startsWith('/c/') &&
                  !router.pathname.startsWith('/l/') &&
                  postInfo?.communityInfo?._id && (
                    <>
                      {postInfo?.isLensCommunityPost ? (
                        <FollowButton hideIfFollow={true} />
                      ) : (
                        <JoinCommunityButton
                          id={postInfo?.communityInfo?._id}
                        />
                      )}
                    </>
                  )}
                {isMobile ? (
                  <OptionsWrapper
                    OptionPopUpModal={() => (
                      <MoreOptionsModal
                        className="z-50"
                        list={
                          isAuthor
                            ? [
                                {
                                  label: 'Share Post',
                                  onClick: sharePost,
                                  icon: () => (
                                    <IoIosShareAlt className="mr-1.5 w-6 h-6" />
                                  )
                                },
                                {
                                  label: 'Delete Post',
                                  onClick: handleDeletePost,
                                  icon: () => (
                                    <HiOutlineTrash className="mr-1.5 w-6 h-6" />
                                  )
                                },
                                {
                                  label: 'Report',
                                  onClick: handleReportPost,
                                  icon: () => (
                                    <IoIosFlag className="mr-1.5 w-6 h-6" />
                                  )
                                }
                              ]
                            : [
                                {
                                  label: 'Share Post',
                                  onClick: sharePost,
                                  icon: () => (
                                    <IoIosShareAlt className="mr-1.5 w-6 h-6" />
                                  )
                                },
                                {
                                  label: 'Report',
                                  onClick: handleReportPost,
                                  icon: () => (
                                    <IoIosFlag className="mr-1.5 w-6 h-6" />
                                  )
                                }
                              ]
                        }
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
                      <div className="hover:bg-s-hover rounded-md p-1 cursor-pointer">
                        <RiMore2Fill className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    </Tooltip>
                  </OptionsWrapper>
                ) : (
                  <OptionsWrapper
                    OptionPopUpModal={() => (
                      <MoreOptionsModal
                        className="z-50"
                        list={
                          isAuthor
                            ? [
                                {
                                  label: 'Report',
                                  onClick: handleReportPost,
                                  icon: () => (
                                    <IoIosFlag className="mr-1.5 w-6 h-6" />
                                  )
                                },
                                {
                                  label: 'Delete Post',
                                  onClick: handleDeletePost,
                                  icon: () => (
                                    <HiOutlineTrash className="mr-1.5 w-6 h-6" />
                                  )
                                }
                              ]
                            : [
                                {
                                  label: 'Report',
                                  onClick: handleReportPost,
                                  icon: () => (
                                    <IoIosFlag className="mr-1.5 w-6 h-6" />
                                  )
                                }
                              ]
                        }
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
                      <div className="hover:bg-s-hover rounded-md p-1 cursor-pointer">
                        <RiMore2Fill className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    </Tooltip>
                  </OptionsWrapper>
                )}
              </div>
            </span>
          </div>

          <div className="flex flex-row w-full">
            {!isMobile && (
              <div className="flex flex-col items-center w-[40px] pt-2 shrink-0">
                <Tooltip
                  enterDelay={1000}
                  leaveDelay={200}
                  title="Upvote"
                  arrow
                  placement="left"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUpvote()
                    }}
                    className="hover:bg-s-hover rounded-md py-1 cursor-pointer"
                  >
                    <img
                      //  onClick={liked ? handleUnLike : handleLike}
                      src={
                        reaction === ReactionTypes.Upvote
                          ? '/UpvotedFilled.svg'
                          : '/upvoteGray.svg'
                      }
                      className="w-5 h-5"
                    />
                  </button>
                </Tooltip>
                <div className="font-bold leading-5 text-sm">{voteCount}</div>
                <Tooltip
                  enterDelay={1000}
                  leaveDelay={200}
                  title="Downvote"
                  arrow
                  placement="left"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDownvote()
                    }}
                    className="hover:bg-s-hover rounded-md py-1 cursor-pointer"
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
            )}

            {/* main content */}
            <div className="flex flex-col w-full justify-between min-h-[76px]">
              <div>
                <div className="mb-2 px-4 sm:pl-2 ">
                  {!router.pathname.startsWith('/p') ? (
                    <>
                      <div className="flex flex-row">
                        {postInfo?.metadata?.name &&
                          showNameForThisAppIds.includes(postInfo?.appId) && (
                            <Markup
                              className={`whitespace-pre-wrap break-words text-base sm:text-lg font-semibold w-full`}
                            >
                              {/* remove title text from content */}

                              {postInfo?.metadata?.name}
                            </Markup>
                          )}
                        {postInfo?.metadata?.contentWarning !== null && (
                          <div
                            className={`border ${
                              postInfo?.metadata?.contentWarning === 'NSFW'
                                ? 'border-red-500 text-red-500'
                                : postInfo?.metadata?.contentWarning ===
                                  'SENSITIVE'
                                ? 'border-yellow-500 text-yellow-500'
                                : 'border-blue-500 text-blue-500'
                            } rounded-full px-2 py-0.5 h-fit text-xs`}
                          >
                            {postInfo?.metadata?.contentWarning}
                          </div>
                        )}
                      </div>
                      {(!!content || postInfo?.appId !== appId) && (
                        <div
                          className={`${
                            showMore ? 'h-[150px]' : ''
                          } sm:max-w-[550px] overflow-hidden break-words`}
                        >
                          <Markup
                            className={`${
                              showMore ? 'line-clamp-5' : ''
                            } linkify whitespace-pre-wrap break-words text-sm sm:text-base`}
                          >
                            {content}
                          </Markup>
                        </div>
                      )}
                      {showMore && (
                        <Link href={`/p/${postInfo?.id}`}>
                          <div className="text-blue-400 text-sm sm:text-base">
                            Show more
                          </div>
                        </Link>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex flex-row">
                        {postInfo?.metadata?.name &&
                          (postInfo?.appId === appId ||
                            (postInfo?.metadata?.name.length > 0 &&
                              content.trim().length === 0)) && (
                            <Markup
                              className={`whitespace-pre-wrap break-words font-semibold text-base sm:text-lg w-full`}
                            >
                              {/* remove title text from content */}

                              {postInfo?.metadata?.name}
                            </Markup>
                          )}
                        {postInfo?.metadata?.contentWarning !== null && (
                          <div
                            className={`border ${
                              postInfo?.metadata?.contentWarning === 'NSFW'
                                ? 'border-red-500 text-red-500'
                                : postInfo?.metadata?.contentWarning ===
                                  'SENSITIVE'
                                ? 'border-yellow-500 text-yellow-500'
                                : 'border-blue-500 text-blue-500'
                            } rounded-full px-2 py-0.5 h-fit text-xs `}
                          >
                            {postInfo?.metadata?.contentWarning}
                          </div>
                        )}
                      </div>
                      {(!!content || postInfo?.appId !== appId) && (
                        <div
                          className={`${
                            showMore ? 'h-[150px]' : ''
                          } sm:max-w-[550px] overflow-hidden break-words`}
                        >
                          <Markup
                            className={`${
                              showMore ? 'line-clamp-5' : ''
                            } linkify whitespace-pre-wrap break-words text sm:text-base`}
                          >
                            {content}
                          </Markup>
                        </div>
                      )}
                      {showMore && (
                        <span onClick={(e) => e.stopPropagation()}>
                          <Link href={`/p/${postInfo?.id}`}>
                            <div className="text-blue-400 text-sm sm:text-base">
                              Show more
                            </div>
                          </Link>
                        </span>
                      )}
                    </>
                  )}
                </div>
                {postInfo?.metadata?.media &&
                  postInfo?.metadata?.media.length > 0 && (
                    <div
                      className={`sm:pl-5  sm:pr-6 sm:pb-1 ${
                        isBlur ? 'blur-xl' : ''
                      }`}
                    >
                      <Attachment
                        publication={postInfo}
                        className={`${
                          router.pathname.startsWith('/p')
                            ? 'max-h-screen'
                            : 'max-h-[450px]'
                        }`}
                      />
                    </div>
                  )}
              </div>

              {/* bottom row */}
              {isMobile && router.pathname.startsWith('/p') && (
                <div className="flex flex-row items-center text-p-text px-3 sm:px-4.5 py-2 sm:justify-start sm:space-x-28 border-t-[1px] border-b-[1px] border-[#eee] dark:border-p-border gap-6">
                  <div className="flex flex-row gap-1 text-[#687684]">
                    <span className="font-medium">{voteCount}</span>
                    <span>upvotes</span>
                  </div>
                  <div className="flex flex-row gap-1 text-[#687684]">
                    <span className="font-medium">
                      {postInfo?.stats?.totalAmountOfComments}
                    </span>
                    <span>comments</span>
                  </div>
                  <div className="flex flex-row gap-1 text-[#687684]">
                    <span className="font-medium">
                      {postInfo?.stats?.totalAmountOfCollects}
                    </span>
                    <span>collects</span>
                  </div>
                </div>
              )}
              <div
                className={clsx(
                  'text-p-text flex flex-row items-center px-3 sm:px-6 py-1',
                  isMobile
                    ? 'pb-1 justify-between'
                    : clsx(
                        postInfo?.collectModule?.__typename ===
                          'FreeCollectModuleSettings' ||
                          postInfo?.collectModule?.__typename ===
                            'FeeCollectModuleSettings'
                          ? 'justify-between'
                          : 'justify-start space-x-24'
                      )
                )}
              >
                {isMobile && (
                  <div className="flex flex-row items-center gap-x-2">
                    <Tooltip
                      enterDelay={1000}
                      leaveDelay={200}
                      title="Upvote"
                      arrow
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleUpvote()
                        }}
                        className="hover:bg-s-hover active:bg-s-hover cursor-pointer rounded-md py-1.5"
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
                    <div className="font-medium text-[#687684]">
                      {voteCount}
                    </div>
                    <Tooltip
                      enterDelay={1000}
                      leaveDelay={200}
                      title="Downvote"
                      arrow
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownvote()
                        }}
                        className="hover:bg-s-hover active:bg-s-hover rounded-md py-1.5 cursor-pointer"
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
                )}
                <Tooltip
                  enterDelay={1000}
                  leaveDelay={200}
                  title="Comment"
                  arrow
                >
                  <span onClick={(e) => e.stopPropagation()}>
                    <Link href={`/p/${postInfo.id}`} passHref>
                      <div className="flex flex-row items-center cursor-pointer hover:bg-s-hover active:bg-s-hover rounded-md px-2 py-1.5 font-medium">
                        <img
                          src="/comment.svg"
                          alt="Comment"
                          className="w-4 h-4 mr-2"
                        />
                        <span className="text-[#687684]">
                          {postInfo?.stats?.totalAmountOfComments}
                        </span>
                      </div>
                    </Link>
                  </span>
                </Tooltip>

                {(postInfo?.collectModule?.__typename ===
                  'FreeCollectModuleSettings' ||
                  postInfo?.collectModule?.__typename ===
                    'FeeCollectModuleSettings') && (
                  <span onClick={(e) => e.stopPropagation()}>
                    <LensCollectButton
                      publication={post}
                      totalCollects={postInfo?.stats?.totalAmountOfCollects}
                      hasCollectedByMe={postInfo?.hasCollectedByMe}
                      author={postInfo?.profile}
                      collectModule={postInfo?.collectModule}
                    />
                  </span>
                )}
                <span onClick={(e) => e.stopPropagation()}>
                  <MirrorButton postInfo={postInfo} />
                </span>
                {!isMobile && (
                  <span onClick={(e) => e.stopPropagation()}>
                    <PostShareButton
                      url={`${appLink}/p/${postInfo?.id}`}
                      text={postInfo?.metadata?.name}
                    />
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default LensPostCard
