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
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import { useRouter } from 'next/router'
// import VideoWithAutoPause from '../Common/UI/VideoWithAutoPause'
import Markup from '../Lexical/Markup'
import { countLinesFromMarkdown } from '../../utils/utils'
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
import { deleteLensPublication } from '../../apiHelper/lensPublication'
import { useDevice } from '../Common/DeviceWrapper'
import useJoinCommunityButton from '../Community/hook/useJoinCommunityButton'
import VerifiedBadge from '../Common/UI/Icon/VerifiedBadge'
import { getContent } from './getContent'
import getIPFSLink from '../User/lib/getIPFSLink'
import WhoReactedPublicationPopup from './whoWasIt/WhoReactedPublicationPopup'
import WhoCollectedPublicationPopUp from './whoWasIt/WhoCollectedPublicationPopUp'
import WhoMirroredPublicatitonPopUp from './whoWasIt/WhoMirroredPublicatitonPopUp'

//sample url https://lens.infura-ipfs.io/ipfs/QmUrfgfcoa7yeHefGCsX9RoxbfpZ1eiASQwp5TnCSsguNA

interface Props {
  post: postWithCommunityInfoType
  isAlone?: boolean
}

// post?.isLensCommunityPost makes sure that the post is a post from a lens community

const LensPostCard = ({ post, isAlone = false }: Props) => {
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
  const { JoinCommunityButton } = useJoinCommunityButton({
    id: postInfo?.communityInfo?._id,
    showJoined: false
  })
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
    } catch (error) {
      console.log(error)
      window.location.reload()
    } finally {
      window.location.reload()
    }
  }

  const isBlur =
    !router.pathname.startsWith('/p') && postInfo?.metadata?.contentWarning

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        url: `${appLink}/p/${postInfo.id}`
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

  const showReactedByPopUp = () => {
    showModal({
      component: <WhoReactedPublicationPopup publicationId={postInfo?.id} />,
      type: modalType.normal
    })
  }

  const showCollectedByPopUp = () => {
    showModal({
      component: <WhoCollectedPublicationPopUp publicationId={postInfo?.id} />,
      type: modalType.normal
    })
  }

  const showMirroredByPopUp = () => {
    showModal({
      component: <WhoMirroredPublicatitonPopUp publicationId={postInfo?.id} />,
      type: modalType.normal
    })
  }

  let content = getContent(postInfo)

  if (postInfo?.originalMirrorPublication?.hidden) {
    return <div>Mirror is hidden</div>
  }

  return (
    <>
      {postInfo && (
        <div
          className={clsx(
            'sm:px-5 noSelect flex flex-col w-full pt-3 bg-s-bg hover:bg-s-bg-hover sm:pb-2 border-b-[1px] border-[#eee] dark:border-p-border cursor-pointer',
            (router.pathname.startsWith('/p') || isAlone) &&
              `${
                isAlone
                  ? 'rounded-2xl border-[1px] border-s-border overflow-hidden mb-1.5'
                  : 'sm:my-3 sm:mb-3'
              } sm:rounded-2xl sm:border-[1px] sm:border-s-border`
          )}
          onClick={() => {
            if (isAlone || !router.pathname.startsWith('/p')) {
              router.push(`/p/${postInfo.id}`)
              return
            }
          }}
        >
          {/* top row */}
          {postInfo?.mirroredBy && (
            <div
              className="flex flex-row w-full space-x-1 items-center pl-4 md:pl-1 mb-1 text-xs text-s-text"
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
            <>
              <div className="flex flex-row w-full items-center">
                <div onClick={(e) => e.stopPropagation()}>
                  <Link
                    href={
                      postInfo?.communityInfo?._id
                        ? postInfo?.isLensCommunityPost
                          ? `/l/${formatHandle(postInfo?.profile?.handle)}`
                          : `/c/${postInfo?.communityInfo?.name}`
                        : `/u/${formatHandle(postInfo?.profile?.handle)}`
                    }
                  >
                    <ImageWithPulsingLoader
                      src={
                        postInfo?.isLensCommunityPost ||
                        !postInfo?.communityInfo
                          ? getAvatar(postInfo?.profile)
                          : getIPFSLink(
                              postInfo?.communityInfo?.logoImageUrl
                            ) ?? '/gradient.jpg'
                      }
                      className={clsx(
                        'h-10 w-10 object-cover',
                        postInfo?.isLensCommunityPost ||
                          postInfo?.communityInfo?.logoImageUrl
                          ? 'rounded-lg'
                          : 'rounded-full'
                      )}
                    />
                  </Link>
                </div>
                <div className="flex flex-col justify-between items-start text-p-text h-full">
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="start-row pb-1"
                  >
                    <Link
                      href={
                        postInfo?.communityInfo?._id
                          ? postInfo?.isLensCommunityPost
                            ? `/l/${formatHandle(postInfo?.profile?.handle)}`
                            : `/c/${postInfo?.communityInfo?.name}`
                          : `/u/${formatHandle(postInfo?.profile?.handle)}`
                      }
                    >
                      <div
                        className="pl-2 font-bold text-sm sm:text-lg hover:cursor-pointer hover:underline truncate"
                        style={{
                          lineHeight: '1rem'
                        }}
                      >
                        {postInfo?.isLensCommunityPost
                          ? `l/${formatHandle(postInfo?.profile?.handle)}`
                          : postInfo?.communityInfo?.name ??
                            postInfo?.profile?.name}
                      </div>
                    </Link>
                    {postInfo?.communityInfo?.verified && (
                      <VerifiedBadge className="w-3 h-3 sm:w-4 sm:h-4  ml-1" />
                    )}
                  </div>
                  <div className="flex flex-row items-center justify-start pl-2">
                    <div onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-row items-center justify-center text-s-text text-xs sm:text-sm">
                        {/* {postInfo?.communityInfo && (
                          <p className="pl-1.5 font-normal">{' posted by '}</p>
                        )} */}
                        {postInfo?.communityInfo &&
                          !postInfo?.isLensCommunityPost && (
                            <div className="pr-1.5">
                              <ImageWithPulsingLoader
                                src={getAvatar(postInfo?.profile)}
                                className="h-4 w-4 rounded-full object-cover"
                              />
                            </div>
                          )}
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
                          passHref
                        >
                          <div className="font-normal hover:cursor-pointer hover:underline">
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
                    </div>
                    <div className="mx-1">
                      <CenteredDot />
                    </div>
                    <div>
                      {postInfo?.createdAt && (
                        <div className="text-xs sm:text-sm text-s-text">
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
            {/* )} */}
            <span onClick={(e) => e.stopPropagation()}>
              <div className="sm:mr-5 flex flex-row items-center">
                {!router.pathname.startsWith('/c/') &&
                  !router.pathname.startsWith('/l/') &&
                  postInfo?.communityInfo?._id && (
                    <>
                      {postInfo?.isLensCommunityPost ? (
                        <FollowButton hideIfFollow={true} />
                      ) : (
                        <JoinCommunityButton />
                      )}
                    </>
                  )}
                <OptionsWrapper
                  OptionPopUpModal={() => (
                    <MoreOptionsModal
                      className="z-50"
                      list={[
                        {
                          label: 'Share Post',
                          onClick: async () => {
                            sharePost()
                            setShowOptionsModal(false)
                            setIsDrawerOpen(false)
                          },
                          icon: () => (
                            <IoIosShareAlt className="mr-1.5 w-6 h-6" />
                          ),
                          hidden: !isMobile
                        },
                        {
                          label: 'Delete Post',
                          onClick: async () => {
                            await handleDeletePost()
                            setShowOptionsModal(false)
                            setIsDrawerOpen(false)
                          },
                          icon: () => (
                            <HiOutlineTrash className="mr-1.5 w-6 h-6" />
                          ),
                          hidden: !isAuthor
                        },
                        {
                          label: 'Report',
                          onClick: async () => {
                            handleReportPost()
                            setShowOptionsModal(false)
                            setIsDrawerOpen(false)
                          },
                          icon: () => <IoIosFlag className="mr-1.5 w-6 h-6" />
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
                    <div className="hover:bg-s-hover rounded-md p-1 cursor-pointer">
                      <RiMore2Fill className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </Tooltip>
                </OptionsWrapper>
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
              <div className="flex flex-col">
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
                            showMore ? 'h-[100px] sm:h-[150px]' : ''
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
                <div
                  className={`w-full sm:px-2.5 sm:pb-1 ${
                    isBlur ? 'blur-xl' : ''
                  }`}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <Attachment
                    publication={postInfo}
                    isAlone={isAlone}
                    attachments={postInfo?.metadata?.media}
                    className={clsx(
                      router.pathname.startsWith('/p')
                        ? 'max-h-screen'
                        : 'max-h-[600px]',
                      'w-full'
                    )}
                  />
                </div>
              </div>

              {/* bottom row */}
              {!isAlone && (
                <>
                  {router.pathname.startsWith('/p') && (
                    <div className="flex flex-row items-center text-p-text px-3 sm:mx-5 sm:px-2 py-2 justify-between sm:justify-start sm:space-x-12 border-t-[1px] border-b-[1px] border-[#eee] sm:mt-2 sm:mb-1 dark:border-p-border">
                      <div
                        className="flex flex-row gap-1 text-s-text cursor-pointer"
                        onClick={showReactedByPopUp}
                      >
                        <span className="font-semibold text-p-text">
                          {voteCount}
                        </span>
                        <span>upvotes</span>
                      </div>
                      <div className="flex flex-row gap-1 text-s-text ">
                        <span className="font-semibold text-p-text">
                          {postInfo?.stats?.totalAmountOfComments}
                        </span>
                        <span>comments</span>
                      </div>
                      <div
                        onClick={showCollectedByPopUp}
                        className="flex flex-row gap-1 text-s-text cursor-pointer"
                      >
                        <span className="font-semibold text-p-text ">
                          {postInfo?.stats?.totalAmountOfCollects}
                        </span>
                        <span>collects</span>
                      </div>
                      <div
                        onClick={showMirroredByPopUp}
                        className="flex flex-row gap-1 text-s-text cursor-pointer"
                      >
                        <span className="font-semibold text-p-text">
                          {postInfo?.stats?.totalAmountOfMirrors}
                        </span>
                        <span>mirrors</span>
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
                            {(!router.pathname.startsWith('/p') || isAlone) && (
                              <span className="text-[#687684]">
                                {postInfo?.stats?.totalAmountOfComments}
                              </span>
                            )}
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
                          isAlone={isAlone}
                        />
                      </span>
                    )}
                    <span onClick={(e) => e.stopPropagation()}>
                      <MirrorButton postInfo={postInfo} isAlone={isAlone} />
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default LensPostCard
