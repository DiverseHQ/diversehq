import React, { useEffect, useState } from 'react'
import ReactTimeAgo from 'react-time-ago'
import Link from 'next/link'
import {
  PublicationMainFocus,
  ReactionTypes,
  useAddReactionMutation,
  useHidePublicationMutation
} from '../../graphql/generated'
// import { FaRegComment, FaRegCommentDots } from 'react-icons/fa'
import { useNotify } from '../Common/NotifyContext'
import {
  LensInfuraEndpoint,
  MAX_CONTENT_LINES_FOR_POST
} from '../../utils/config'
import { useLensUserContext } from '../../lib/LensUserContext'
import JoinCommunityButton from '../Community/JoinCommunityButton'
import useDevice from '../Common/useDevice'
import { getCommunityInfoUsingId } from '../../api/community'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import { useRouter } from 'next/router'
// import VideoWithAutoPause from '../Common/UI/VideoWithAutoPause'
import Markup from '../Lexical/Markup'
import {
  countLinesFromMarkdown,
  deleteFirebaseStorageFile,
  getURLsFromText,
  unpinFromIpfsInfura
} from '../../utils/utils'
import ImageWithFullScreenZoom from '../Common/UI/ImageWithFullScreenZoom'
import { HiOutlineTrash } from 'react-icons/hi'
import MoreOptionsModal from '../Common/UI/MoreOptionsModal'
import ReactEmbedo from './embed/ReactEmbedo'
import PostShareButton from './PostShareButton'
import { RiMore2Fill } from 'react-icons/ri'
import LensCollectButton from './Collect/LensCollectButton'
import OptionsWrapper from '../Common/OptionsWrapper'
import { Tooltip } from '@mui/material'
import Attachment from './Attachment'

//sample url https://lens.infura-ipfs.io/ipfs/QmUrfgfcoa7yeHefGCsX9RoxbfpZ1eiASQwp5TnCSsguNA

const LensPostCard = ({ post, loading }) => {
  const { isMobile } = useDevice()
  const { notifyInfo } = useNotify()
  const [reaction, setReaction] = useState(post?.reaction)
  const [upvoteCount, setUpvoteCount] = useState(post?.stats.totalUpvotes)
  const [downvoteCount, setDownvoteCount] = useState(post?.stats.totalDownvotes)
  const [voteCount, setVoteCount] = useState(
    post?.stats?.totalUpvotes - post?.stats?.totalDownvotes
  )
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showOptionsModal, setShowOptionsModal] = useState(false)
  const [postInfo, setPostInfo] = useState(post)
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
  const { isSignedIn, hasProfile, data: lensProfile } = useLensUserContext()
  const [isAuthor, setIsAuthor] = useState(
    lensProfile?.defaultProfile?.id === post?.profile?.id
  )

  useEffect(() => {
    if (!post || !lensProfile) return
    setIsAuthor(lensProfile?.defaultProfile?.id === post?.profile?.id)
  }, [post, lensProfile])

  const { mutateAsync: removePost } = useHidePublicationMutation()

  const handleUpvote = async () => {
    if (reaction === ReactionTypes.Upvote) return
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
    if (reaction === ReactionTypes.Downvote) return
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
      if (post?.metadata?.media?.length > 0) {
        const medias = post?.metadata?.media
        for (const media of medias) {
          if (media?.original?.url?.startsWith('ipfs://')) {
            try {
              const hash = media?.original?.url?.split('ipfs://')[1]
              await unpinFromIpfsInfura(hash)
            } catch (error) {
              console.log(error)
            }
          } else if (
            media?.original?.url?.startsWith(
              'https://firebasestorage.googleapis.com/v0/b/diversehq-21330.appspot.com'
            )
          ) {
            await deleteFirebaseStorageFile(media?.original?.url)
          }
        }
      }

      await removePost({
        request: {
          publicationId: post?.id
        }
      })
    } catch (error) {
      console.log(error)
    } finally {
      router.reload()
    }
  }

  const isBlur =
    !router.pathname.startsWith('/p') && postInfo?.metadata?.contentWarning

  return (
    <>
      {postInfo && (
        <div
          className={`sm:px-5 noSelect flex flex-col w-full bg-s-bg pt-3 sm:my-3 sm:rounded-2xl shadow-sm ${
            isMobile
              ? `border-b-[1px] border-[#eee] dark:border-p-border ${
                  router.pathname.startsWith('/p') ? 'mb-2' : ''
                }`
              : 'pb-2'
          } ${router.pathname.startsWith('/p') ? '' : 'cursor-pointer'}`}
          onClick={() => {
            if (router.pathname.startsWith('/p')) return
            router.push(`/p/${postInfo.id}`)
          }}
        >
          {/* top row */}
          <div className="px-3 sm:px-0 flex flex-row items-center justify-between mb-1  w-full">
            {!isMobile && (
              <>
                <div className="flex flex-row w-full items-center">
                  {loading ? (
                    <div className="animate-pulse rounded-full bg-p-bg lg:w-[40px] lg:h-[40px] h-[30px] w-[30px]" />
                  ) : (
                    <span onClick={(e) => e.stopPropagation()}>
                      <Link
                        href={`/c/${postInfo?.communityInfo?.name}`}
                        passHref
                      >
                        <ImageWithPulsingLoader
                          src={
                            postInfo?.communityInfo?.logoImageUrl
                              ? postInfo?.communityInfo?.logoImageUrl
                              : '/gradient.jpg'
                          }
                          className="rounded-full lg:w-[40px] lg:h-[40px] h-[30px] w-[30px] object-cover"
                        />
                      </Link>
                    </span>
                  )}
                  {loading ? (
                    <div className="animate-pulse rounded-full bg-p-bg w-32 h-4 ml-4" />
                  ) : (
                    <span onClick={(e) => e.stopPropagation()}>
                      <Link href={`/c/${postInfo?.communityInfo?.name}`}>
                        <div className="pl-2 font-bold text-sm sm:text-lg hover:cursor-pointer hover:underline text-p-text">
                          {postInfo?.communityInfo?.name}
                        </div>
                      </Link>
                    </span>
                  )}

                  <span onClick={(e) => e.stopPropagation()}>
                    <Link
                      href={`/u/${postInfo?.profile?.handle}`}
                      className="flex flex-row items-center justify-center text-s-text text-xs sm:text-sm"
                    >
                      <p className="pl-1.5 font-normal"> posted by</p>
                      <div className="pl-1.5 font-normal hover:cursor-pointer hover:underline">
                        u/{postInfo?.profile?.handle}
                      </div>
                    </Link>
                  </span>
                  <div>
                    {postInfo?.createdAt && (
                      <div className="text-xs sm:text-sm text-s-text ml-2">
                        <ReactTimeAgo
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
                    <Link href={`/c/${postInfo?.communityInfo?.name}`} passHref>
                      <ImageWithPulsingLoader
                        src={
                          postInfo?.communityInfo?.logoImageUrl
                            ? postInfo?.communityInfo?.logoImageUrl
                            : '/gradient.jpg'
                        }
                        className="rounded-full h-10 w-10 object-cover"
                      />
                    </Link>
                  </span>
                  <div className="flex flex-col justify-center items-start text-p-text">
                    <span onClick={(e) => e.stopPropagation()}>
                      <Link href={`/c/${postInfo?.communityInfo?.name}`}>
                        <div className="pl-2 font-bold text-sm sm:text-xl hover:cursor-pointer hover:underline">
                          {postInfo?.communityInfo?.name}
                        </div>
                      </Link>
                    </span>
                    <div className="flex flex-row items-center justify-start">
                      <span onClick={(e) => e.stopPropagation()}>
                        <Link
                          href={`/u/${postInfo?.profile?.handle}`}
                          className="flex flex-row items-center justify-center text-s-text text-xs sm:text-sm"
                          passHref
                        >
                          <p className="pl-1.5 font-normal"> posted by</p>
                          <div className="pl-1.5 font-normal hover:cursor-pointer hover:underline">
                            u/{postInfo?.profile?.handle}
                          </div>
                        </Link>
                      </span>
                      <div>
                        {postInfo?.createdAt && (
                          <div className="text-xs sm:text-sm text-s-text ml-2">
                            <ReactTimeAgo
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
                {!router.pathname.startsWith('/p/') && (
                  <JoinCommunityButton id={postInfo?.communityInfo?._id} />
                )}
                {isAuthor && (
                  <OptionsWrapper
                    OptionPopUpModal={() => (
                      <MoreOptionsModal
                        className="z-50"
                        list={[
                          {
                            label: 'Delete Post',
                            onClick: handleDeletePost,
                            icon: () => (
                              <HiOutlineTrash className="mr-1.5 w-6 h-6" />
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
              <div className="flex flex-col items-center ml-1.5 mt-1">
                <Tooltip title="Upvote" arrow placement="left">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUpvote()
                    }}
                    className="hover:bg-s-hover rounded-md p-1 cursor-pointer"
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
                <div className="font-bold leading-5">{voteCount}</div>
                <Tooltip title="Downvote" arrow placement="left">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDownvote()
                    }}
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
                </Tooltip>
              </div>
            )}

            {/* main content */}
            <div className="flex flex-col w-full justify-between min-h-[76px]">
              <div>
                <div className="mb-2 px-3 sm:pl-3.5 ">
                  {!router.pathname.startsWith('/p') ? (
                    <>
                      <div className="flex flex-row">
                        {postInfo?.metadata?.name && (
                          <Markup
                            className={`whitespace-pre-wrap break-words font-medium text-base sm:text-lg w-full`}
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
                      {postInfo?.metadata?.name !==
                        postInfo?.metadata?.content && (
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
                            {postInfo?.metadata?.content?.startsWith(
                              postInfo?.metadata?.name
                            )
                              ? postInfo?.metadata?.content?.slice(
                                  postInfo?.metadata?.name.length
                                )
                              : postInfo?.metadata?.content}
                          </Markup>
                        </div>
                      )}
                      {showMore && (
                        <Link
                          href={`/p/${postInfo?.id}`}
                          className="text-blue-400 text-sm sm:text-base"
                        >
                          Show more
                        </Link>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex flex-row">
                        {postInfo?.metadata?.name && (
                          <Markup
                            className={`whitespace-pre-wrap break-words font-medium text-base sm:text-lg w-full`}
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
                      {postInfo?.metadata?.name !==
                        postInfo?.metadata?.content && (
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
                            {postInfo?.metadata?.content?.startsWith(
                              postInfo?.metadata?.name
                            )
                              ? postInfo?.metadata?.content?.slice(
                                  postInfo?.metadata?.name.length
                                )
                              : postInfo?.metadata?.content}
                          </Markup>
                        </div>
                      )}
                      {showMore && (
                        <span onClick={(e) => e.stopPropagation()}>
                          <Link
                            href={`/p/${postInfo?.id}`}
                            className="text-blue-400 text-sm sm:text-base"
                          >
                            Show more
                          </Link>
                        </span>
                      )}
                    </>
                  )}
                </div>
                {postInfo?.metadata?.media.length > 0 ? (
                  <div
                    className={`sm:pl-5  sm:pr-6 sm:pb-1 ${
                      isBlur ? 'blur-xl' : ''
                    }`}
                  >
                    <Attachment
                      publication={postInfo}
                      className={`${
                        router.pathname.startsWith('/p') ? '' : 'max-h-[450px]'
                      }`}
                    />
                  </div>
                ) : (
                  getURLsFromText(postInfo?.metadata?.content).length > 0 && (
                    <ReactEmbedo
                      url={getURLsFromText(postInfo?.metadata?.content)[0]}
                      className="w-full sm:w-[500px] sm:pl-5 sm:pr-6 sm:pb-1"
                    />
                  )
                )}
              </div>

              {/* bottom row */}
              {isMobile && router.pathname.startsWith('/p') && (
                <div className="flex flex-row items-center text-p-text px-3 sm:px-4.5 py-2 sm:justify-start sm:space-x-28 border-b-[1px] border-[#eee] dark:border-p-border gap-6">
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
                className={`text-p-text flex flex-row items-center px-3 sm:px-4.5 py-1 justify-between sm:justify-start sm:space-x-28  ${
                  isMobile ? 'pb-1' : ''
                }`}
              >
                {isMobile && (
                  <div className="flex flex-row items-center gap-x-1">
                    <Tooltip title="Upvote" arrow>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleUpvote()
                        }}
                        className="hover:bg-s-hover cursor-pointer rounded-md p-1"
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
                    <Tooltip title="Downvote" arrow>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownvote()
                        }}
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
                    </Tooltip>
                  </div>
                )}
                {!router.pathname.startsWith('/p') ? (
                  <Tooltip title="Comment" arrow>
                    <span onClick={(e) => e.stopPropagation()}>
                      <Link
                        href={`/p/${postInfo.id}`}
                        className="flex flex-row items-center cursor-pointer hover:bg-s-hover rounded-md p-1 font-medium"
                        passHref
                      >
                        {/* {postInfo?.stats?.totalAmountOfComments === 0 && (
                      <FaRegComment className="hover:cursor-pointer mr-2 w-5 h-5 sm:w-5 sm:h-5" />
                    )}
                    {postInfo?.stats?.totalAmountOfComments > 0 && (
                      <FaRegCommentDots className="hover:cursor-pointer mr-2 w-5 h-5 sm:w-5 sm:h-5" />
                    )} */}
                        <img
                          src="/comment.svg"
                          alt="Comment"
                          className="w-4 h-4 mr-2"
                        />
                        <span className="text-[#687684]">
                          {postInfo?.stats?.totalAmountOfComments}
                        </span>
                      </Link>
                    </span>
                  </Tooltip>
                ) : (
                  <Tooltip title="Comment" arrow>
                    <div className="flex flex-row items-center cursor-pointer  hover:bg-s-hover rounded-md p-1 font-medium">
                      {/* {postInfo?.stats?.totalAmountOfComments === 0 && (
                      <FaRegComment className="hover:cursor-pointer mr-2 w-5 h-5 sm:w-5 sm:h-5" />
                    )}
                    {postInfo?.stats?.totalAmountOfComments > 0 && (
                      <FaRegCommentDots className="hover:cursor-pointer mr-2 w-5 h-5 sm:w-5 sm:h-5" />
                    )} */}
                      <img
                        src="/comment.svg"
                        alt="Comment"
                        className="w-4 h-4 mr-2"
                      />
                      <span className="text-[#687684]">
                        {postInfo?.stats?.totalAmountOfComments}
                      </span>
                    </div>
                  </Tooltip>
                )}
                <span onClick={(e) => e.stopPropagation()}>
                  <LensCollectButton
                    publication={post}
                    totalCollects={postInfo?.stats?.totalAmountOfCollects}
                    hasCollectedByMe={postInfo?.hasCollectedByMe}
                    author={postInfo?.profile}
                    collectModule={postInfo?.collectModule}
                  />
                </span>
                <span onClick={(e) => e.stopPropagation()}>
                  <PostShareButton
                    url={`https://app.diversehq.xyz/p/${postInfo?.id}`}
                    text={postInfo?.metadata?.name}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default LensPostCard
