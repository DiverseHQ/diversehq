import React, { useEffect, useState } from 'react'
import { useProfile } from '../Common/WalletContext'
import { useNotify } from '../Common/NotifyContext'
import {
  deletePost,
  putUpvoteOnPost,
  putDownvoteOnPost
} from '../../apiHelper/post'
import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'
import ReactTimeAgo from 'react-time-ago'
import Link from 'next/link'
// import { FaRegComment, FaRegCommentDots } from 'react-icons/fa'
import JoinCommunityButton from '../Community/JoinCommunityButton'
import { ReactionTypes } from '../../graphql/generated'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import { useRouter } from 'next/router'
import { BiEdit } from 'react-icons/bi'
import { HiOutlineTrash } from 'react-icons/hi'
import VideoWithAutoPause from '../Common/UI/VideoWithAutoPause'

import Markup from '../Lexical/Markup'
import { countLinesFromMarkdown, getURLsFromText } from '../../utils/utils'
import { appLink, MAX_CONTENT_LINES_FOR_POST } from '../../utils/config'
import ImageWithFullScreenZoom from '../Common/UI/ImageWithFullScreenZoom'
import ReactEmbedo from './embed/ReactEmbedo'
import MoreOptionsModal from '../Common/UI/MoreOptionsModal'
import PostShareButton from './PostShareButton'
import { RiMore2Fill } from 'react-icons/ri'
import OptionsWrapper from '../Common/OptionsWrapper'
import { Tooltip } from '@mui/material'
import { useDevice } from '../Common/DeviceWrapper'
// import MarkdownPreview from '@uiw/react-markdown-preview'

const PostCard = ({ _post, setPosts }) => {
  // const createdAt = new Date(post.createdAt)
  // eslint-disable-next-line
  const [post, setPost] = useState(_post)
  const { user } = useProfile()
  const [reaction, setReaction] = useState(null) // upvote, downvote, none
  const [upvoteCount, setUpvoteCount] = useState(
    post?.upvotes ? post.upvotes.length : 0
  )
  const [downvoteCount, setDownvoteCount] = useState(
    post?.downvotes ? post.downvotes.length : 0
  )
  const [totalCount, setTotalCount] = useState(upvoteCount - downvoteCount)
  const { notifyInfo, notifyError } = useNotify()
  const { isMobile } = useDevice()

  // to maintain the current author state
  const [isAuthor, setIsAuthor] = useState(false)

  const { showModal, hideModal } = usePopUpModal()

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showOptionsModal, setShowOptionsModal] = useState(false)

  const router = useRouter()
  const [showMore, setShowMore] = useState(
    (countLinesFromMarkdown(post?.content) > MAX_CONTENT_LINES_FOR_POST ||
      post?.content?.length > 400 ||
      countLinesFromMarkdown(post?.titile) > MAX_CONTENT_LINES_FOR_POST ||
      post?.title?.length > 400) &&
      router.pathname !== '/p/[id]'
  )

  useEffect(() => {
    setShowMore(
      (countLinesFromMarkdown(post?.content) > MAX_CONTENT_LINES_FOR_POST ||
        post?.content?.length > 400 ||
        countLinesFromMarkdown(post?.title) > MAX_CONTENT_LINES_FOR_POST ||
        post?.title?.length > 400) &&
        router.pathname !== '/p/[id]'
    )
  }, [post])

  useEffect(() => {
    setTotalCount(upvoteCount - downvoteCount)
  }, [upvoteCount, downvoteCount])

  useEffect(() => {
    if (!user) return
    if (!post?.upvotes || !post?.downvotes) return
    if (post?.upvotes.includes(user.walletAddress.toLowerCase())) {
      setReaction('UPVOTE')
    } else if (post?.downvotes.includes(user.walletAddress.toLowerCase())) {
      setReaction('DOWNVOTE')
    }
    if (post.author === user.walletAddress) {
      // if current user is the author then show the delete icon
      setIsAuthor(true)
    }
  }, [user])

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

      await putUpvoteOnPost(post._id)
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

      await putDownvoteOnPost(post._id)
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeletePost = async () => {
    try {
      if (!user) {
        notifyInfo('You might want to connect your wallet first')
        return
      }
      await deletePost(post._id)
      notifyInfo('Post deleted successfully')
      // handleCommunityClicked()
      // remove the deleted post from the posts state array
      if (setPosts) {
        setPosts((prevPosts) => prevPosts.filter((p) => p?._id !== post?._id))
      }

      if (router.pathname.startsWith('/p/')) {
        router.push('/')
      }
    } catch (error) {
      console.log(error)
      notifyError('Something went wrong')
    } finally {
      hideModal()
    }
  }

  const showEditModal = () => {
    showModal({
      component: <></>,
      type: modalType.fullscreen,
      onAction: () => {},
      extraaInfo: {}
    })
  }

  return (
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
        router.push(`/p/${post._id}`)
      }}
    >
      {/* top row */}
      <div className="px-3 sm:px-0 flex flex-row items-center justify-between mb-1  w-full">
        {!isMobile && (
          <>
            <div className="flex flex-row w-full items-center pb-1">
              <span onClick={(e) => e.stopPropagation()}>
                <Link href={`/c/${post.communityName}`} passHref>
                  <ImageWithPulsingLoader
                    src={post.communityLogo}
                    className="rounded-full lg:w-[40px] lg:h-[40px] h-[30px] w-[30px] object-cover"
                  />
                </Link>
              </span>
              <span onClick={(e) => e.stopPropagation()}>
                <Link href={`/c/${post.communityName}`}>
                  <div className="pl-2 font-bold text-xs sm:text-lg hover:cursor-pointer hover:underline text-p-text">
                    {post.communityName}
                  </div>
                </Link>
              </span>

              <span onClick={(e) => e.stopPropagation()}>
                <Link href={`/u/${post.author}`}>
                  <div className="flex flex-row items-center justify-center text-s-text text-xs sm:text-sm">
                    <p className="pl-1.5"> posted by</p>
                    <div className="pl-1.5 hover:cursor-pointer hover:underline">
                      u/
                      {post.authorName
                        ? post.authorName
                        : post.author?.slice(0, 6) + '...'}
                    </div>
                  </div>
                </Link>
              </span>
              <div>
                {post.createdAt && (
                  <div className="text-xs sm:text-sm text-s-text ml-2">
                    <ReactTimeAgo
                      timeStyle="twitter"
                      date={new Date(post.createdAt)}
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
                <Link href={`/c/${post.communityName}`} passHref>
                  <ImageWithPulsingLoader
                    src={post.communityLogo}
                    className="object-cover rounded-full h-10 w-10"
                  />
                </Link>
              </span>
              <div className="flex flex-col justify-center items-start text-p-text">
                <span onClick={(e) => e.stopPropagation()}>
                  <Link href={`/c/${post.communityName}`} passHref>
                    <div className="pl-2 font-bold text-base sm:text-xl hover:cursor-pointer hover:underline">
                      {post.communityName}
                    </div>
                  </Link>
                </span>
                <div className="flex flex-row items-center justify-start">
                  <span onClick={(e) => e.stopPropagation()}>
                    <Link href={`/u/${post.author}`} passHref>
                      <div className="flex flex-row items-center justify-center text-s-text text-xs sm:text-sm">
                        <p className="pl-1.5"> posted by</p>
                        <div className="pl-1.5 hover:cursor-pointer hover:underline">
                          u/
                          {post.authorName
                            ? post.authorName
                            : post.author?.slice(0, 6) + '...'}
                        </div>
                      </div>
                    </Link>
                  </span>
                  <div>
                    {post.createdAt && (
                      <div className="text-xs sm:text-sm text-s-text ml-2">
                        <ReactTimeAgo
                          timeStyle="twitter"
                          date={new Date(post.createdAt)}
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
            {!router.pathname.startsWith('/p') &&
              !router.pathname.startsWith('/c') && (
                <JoinCommunityButton id={post.communityId} />
              )}
            {isAuthor && (
              <OptionsWrapper
                OptionPopUpModal={() => (
                  <MoreOptionsModal
                    className="z-50"
                    list={[
                      {
                        label: 'Edit Post',
                        onClick: async () => {
                          showEditModal()
                        },
                        icon: () => <BiEdit className="mr-1.5 w-6 h-6" />
                      },
                      {
                        label: 'Delete Post',
                        onClick: async () => {
                          await handleDeletePost()
                        },
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
                <Tooltip enterDelay={1000} leaveDelay={200} title="More" arrow>
                  <div className="hover:bg-p-btn-hover rounded-md p-1 cursor-pointer">
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
                className="hover:bg-p-btn-hover rounded-md p-1 hover:cursor-pointer"
              >
                <img
                  src={
                    reaction === 'UPVOTE'
                      ? '/UpvotedFilled.svg'
                      : '/upvoteGray.svg'
                  }
                  className="w-5 h-5"
                />
              </button>
            </Tooltip>
            <div className="font-bold leading-5">{totalCount}</div>
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
                className="hover:bg-p-btn-hover rounded-md p-1 cursor-pointer"
              >
                <img
                  src={
                    reaction === 'DOWNVOTE'
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
        <div className="flex flex-col justify-between w-full min-h-[76px]">
          <div>
            <div className="mb-2 px-3 sm:pl-3.5">
              {!router.pathname.startsWith('/p') ? (
                <>
                  {post?.title?.length <= 60 && (
                    <div className="font-medium text-base sm:text-lg w-full break-words">
                      {post?.title}
                    </div>
                  )}
                  {(post?.content || post?.title?.length > 60) && (
                    <>
                      <div
                        className={`${
                          showMore ? 'h-[150px]' : ''
                        } sm:max-w-[550px]  overflow-hidden break-words`}
                      >
                        <Markup
                          className={`${
                            showMore ? 'line-clamp-5' : ''
                          } linkify line-clamp-2 whitespace-pre-wrap max-h-[10px] overflow-hide break-words text-sm sm:text-base`}
                        >
                          {post?.content ? post?.content : post?.title}
                        </Markup>
                        {/* todo showmore for clamped text */}
                      </div>
                      {showMore && (
                        <span onClick={(e) => e.stopPropagation()}>
                          <Link href={`/p/${post._id}`}>
                            <div className="text-blue-400 text-sm sm:text-base">
                              Show more
                            </div>
                          </Link>
                        </span>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  {post?.title?.length <= 60 && (
                    <div className="font-medium text-base sm:text-lg w-full break-words">
                      {post?.title}
                    </div>
                  )}
                  {(post?.content || post?.title?.length > 60) && (
                    <>
                      <div
                        className={`${
                          showMore ? 'h-[150px]' : ''
                        } sm:max-w-[550px]  overflow-hidden break-words`}
                      >
                        <Markup
                          className={`${
                            showMore ? 'line-clamp-5' : ''
                          } linkify line-clamp-2 whitespace-pre-wrap max-h-[10px] overflow-hide break-words text-sm sm:text-base`}
                        >
                          {post?.content ? post?.content : post?.title}
                        </Markup>
                        {/* todo showmore for clamped text */}
                      </div>
                      {showMore && (
                        <span onClick={(e) => e.stopPropagation()}>
                          <Link href={`/p/${post._id}`}>
                            <div className="text-blue-400 text-sm sm:text-base">
                              Show more
                            </div>
                          </Link>
                        </span>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
            {post?.postImageUrl &&
              (!router.pathname.startsWith('/p') ? (
                <span onClick={(e) => e.stopPropagation()}>
                  <Link href={`/p/${post?._id}`} passHref>
                    {/* eslint-disable-next-line */}
                    <div className="sm:pl-5  sm:pr-6 sm:pb-1">
                      <ImageWithPulsingLoader
                        src={post.postImageUrl}
                        className={`image-unselectable sm:rounded-lg object-cover w-full ${
                          router.pathname.startsWith('/p')
                            ? ''
                            : 'max-h-[500px]'
                        }`}
                        loaderClassName="sm:rounded-lg w-full h-[300px]"
                      />
                    </div>
                  </Link>
                </span>
              ) : (
                <div className="sm:pl-5  sm:pr-6 sm:pb-1">
                  <ImageWithFullScreenZoom
                    src={post.postImageUrl}
                    className="object-cover w-full"
                  />
                </div>
              ))}
            {post?.postVideoUrl && (
              <div className="sm:pl-5 sm:pr-6 sm:pb-1">
                <VideoWithAutoPause
                  src={post.postVideoUrl}
                  className={`image-unselectable object-contain sm:rounded-lg w-full ${
                    router.pathname.startsWith('/p') ? '' : 'max-h-[500px]'
                  }`}
                  controls
                  muted
                />
              </div>
            )}
            {!post?.postImageUrl &&
              !post?.postVideoUrl &&
              getURLsFromText(post?.title).length > 0 && (
                <ReactEmbedo
                  url={getURLsFromText(post?.title)[0]}
                  className="w-full sm:w-[500px] sm:pl-5 sm:pr-6 sm:pb-1"
                />
              )}
          </div>
          {/* bottom row */}
          {isMobile && router.pathname.startsWith('/p') && (
            <div className="flex flex-row items-center text-p-text px-3 sm:px-4.5 py-2 sm:justify-start sm:space-x-28 border-b-[1px] border-[#eee] dark:border-p-border gap-6">
              <div className="flex flex-row gap-1 text-[#687684]">
                <span className="font-medium">{totalCount}</span>
                <span>upvotes</span>
              </div>
              <div className="flex flex-row gap-1 text-[#687684]">
                <span className="font-medium">{post.comments?.length}</span>
                <span>comments</span>
              </div>
            </div>
          )}
          <div
            className={`text-p-text  flex flex-row items-center justify-between sm:justify-start sm:space-x-28 ${
              isMobile ? 'p-2' : 'px-3 sm:px-3.5 pt-1'
            }`}
          >
            {isMobile && (
              <div className="flex flex-row items-center gap-x-1">
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
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDownvote()
                    }}
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
            )}
            {!router.pathname.startsWith('/p') ? (
              <Tooltip enterDelay={1000} leaveDelay={200} title="Comment" arrow>
                <span onClick={(e) => e.stopPropagation()}>
                  <Link href={`/p/${post._id}`} passHref>
                    <div className="flex flex-row items-center rounded-md p-1 hover:bg-p-btn-hover font-medium">
                      <img
                        src="/comment.svg"
                        alt="Comment"
                        className="w-4 h-4 mr-2"
                      />
                      <span className="text-[#687684]">
                        {post.comments?.length}
                      </span>
                    </div>
                  </Link>
                </span>
              </Tooltip>
            ) : (
              <Tooltip enterDelay={1000} leaveDelay={200} title="Comment" arrow>
                <div className="flex flex-row items-center hover:bg-p-btn-hover font-medium">
                  {/* {post.comments?.length === 0 && (
                  <FaRegComment className="hover:cursor-pointer mr-2 w-4 h-4 " />
                )}
                {post.comments?.length > 0 && (
                  <FaRegCommentDots className="hover:cursor-pointer mr-2 w-4 h-4 " />
                )} */}
                  <img
                    src="/comment.svg"
                    alt="Comment"
                    className="w-4 h-4 mr-2"
                  />
                  <span className="text-[#687684]">
                    {post.comments?.length}
                  </span>
                </div>
              </Tooltip>
            )}
            <span onClick={(e) => e.stopPropagation()}>
              <PostShareButton
                url={`${appLink}/p/${post?._id}`}
                text={post?.title}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCard
