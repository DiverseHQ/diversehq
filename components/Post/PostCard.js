import React, { useEffect, useState } from 'react'
// import Image from 'next/image'
import { useProfile } from '../Common/WalletContext'
import { useNotify } from '../Common/NotifyContext'
import { deletePost, putUpvoteOnPost, putDownvoteOnPost } from '../../api/post'
import { BsThreeDots } from 'react-icons/bs'
// import { HiOutlineTrash } from 'react-icons/hi'
import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'
import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import Link from 'next/link'
import { FaRegComment, FaRegCommentDots } from 'react-icons/fa'
import { FiSend } from 'react-icons/fi'
import JoinCommunityButton from '../Community/JoinCommunityButton'
import useDevice from '../Common/useDevice'
import { ReactionTypes } from '../../graphql/generated'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import { useRouter } from 'next/router'
import { BiEdit } from 'react-icons/bi'
import { HiOutlineTrash } from 'react-icons/hi'
import EditPostPopup from './EditPostPopup'
import VideoWithAutoPause from '../Common/UI/VideoWithAutoPause'
TimeAgo.addDefaultLocale(en)

import Markup from '../Lexical/Markup'
import { countLinesFromMarkdown, getURLsFromText } from '../../utils/utils'
import { MAX_CONTENT_LINES } from '../../utils/config'
import ReactEmbedo from './embed/ReactEmbedo'
// import MarkdownPreview from '@uiw/react-markdown-preview'
// import useDevice from '../Common/useDevice'

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
  // const { isDesktop } = useDevice()

  // to maintain the current author state
  const [isAuthor, setIsAuthor] = useState(false)

  const { showModal, hideModal } = usePopUpModal()

  const router = useRouter()
  const [showMore, setShowMore] = useState(
    countLinesFromMarkdown(post?.title) > MAX_CONTENT_LINES &&
      router.pathname !== '/p/[id]'
  )

  useEffect(() => {
    setShowMore(
      countLinesFromMarkdown(post?.title) > MAX_CONTENT_LINES &&
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

  const handleShare = async () => {
    try {
      const url = window.location.href
      const title = 'Share this post'
      navigator.share({
        title,
        url
      })
    } catch (error) {
      console.log(error)
      notifyError('Something went wrong')
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
      component: <EditPostPopup post={post} setPost={setPost} />
    })
    hideModal()
  }

  const showMoreOptions = (e) => {
    if (!isAuthor) {
      notifyInfo('It may happen that some buttons are under construction.')
      return
    }
    // setShowOptions(!showOptions)
    showModal({
      component: (
        <>
          <div className="cursor-pointer">
            <div
              className="flex items-center px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow hover:bg-[#eee] hover:cursor-pointer "
              onClick={showEditModal}
            >
              <BiEdit className="mr-1.5 w-4 h-4 sm:w-6 sm:h-6" title="Edit" />
              <span>Edit</span>
            </div>
            <div
              className="flex items-center px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow hover:bg-[#eee] hover:cursor-pointer hover:text-red-600"
              onClick={handleDeletePost}
            >
              <HiOutlineTrash
                className="mr-1.5 w-4 h-4 sm:w-6 sm:h-6"
                title="Delete"
              />
              <span>Delete</span>
            </div>
          </div>
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

  const { isMobile } = useDevice()

  return (
    <div className="sm:px-5 flex flex-col w-full bg-s-bg pt-3 pb-1 my-2 sm:my-3 sm:rounded-2xl shadow-sm">
      {/* top row */}
      <div className="px-3 sm:px-0 flex flex-row items-center justify-between mb-1  w-full">
        {!isMobile && (
          <>
            <div className="flex flex-row w-full items-center pb-1">
              <Link href={`/c/${post.communityName}`} passHref>
                <ImageWithPulsingLoader
                  src={
                    post.communityLogo ? post.communityLogo : '/gradient.jpg'
                  }
                  className="rounded-full lg:w-[40px] lg:h-[40px] h-[30px] w-[30px] object-cover"
                />
              </Link>
              <Link href={`/c/${post.communityName}`}>
                <div className="pl-2 font-bold text-xs sm:text-xl hover:cursor-pointer hover:underline">
                  {post.communityName}
                </div>
              </Link>

              <Link
                href={`/u/${post.author}`}
                className="flex flex-row items-center justify-center text-s-text text-xs sm:text-sm"
              >
                <p className="pl-1.5"> posted by</p>
                <div className="pl-1.5 hover:cursor-pointer hover:underline">
                  u/
                  {post.authorName
                    ? post.authorName
                    : post.author?.slice(0, 6) + '...'}
                </div>
              </Link>
              <div>
                {post.createdAt && (
                  <div className="text-xs sm:text-sm text-s-text ml-2">
                    <ReactTimeAgo
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
              <Link href={`/c/${post.communityName}`} passHref>
                <ImageWithPulsingLoader
                  src={
                    post.communityLogo ? post.communityLogo : '/gradient.jpg'
                  }
                  className="object-cover rounded-full lg:w-[40px] lg:h-[40px] h-[30px] w-[30px]"
                />
              </Link>
              <div className="flex flex-col justify-center items-start">
                <Link href={`/c/${post.communityName}`} passHref>
                  <div className="pl-2 font-bold text-base sm:text-xl hover:cursor-pointer hover:underline">
                    {post.communityName}
                  </div>
                </Link>
                <div className="flex flex-row items-center justify-start">
                  <Link
                    href={`/u/${post.author}`}
                    className="flex flex-row items-center justify-center text-s-text text-xs sm:text-sm"
                    passHref
                  >
                    <p className="pl-1.5"> posted by</p>
                    <div className="pl-1.5 hover:cursor-pointer hover:underline">
                      u/
                      {post.authorName
                        ? post.authorName
                        : post.author?.slice(0, 6) + '...'}
                    </div>
                  </Link>
                  <div>
                    {post.createdAt && (
                      <div className="text-xs sm:text-sm text-s-text ml-2">
                        <ReactTimeAgo
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
        <div className="sm:mr-5">
          <JoinCommunityButton id={post.communityId} />
        </div>
      </div>

      <div className="flex flex-row w-full">
        {!isMobile && (
          <div className="flex flex-col items-center ml-[9px] my-2">
            <img
              onClick={handleUpvote}
              src={reaction === 'UPVOTE' ? '/UpvoteFilled.svg' : '/Upvote.svg'}
              className="w-6 h-6 cursor-pointer"
            />
            <div>{totalCount}</div>
            <img
              onClick={handleDownvote}
              src={
                reaction === 'DOWNVOTE'
                  ? '/DownvoteFilled.svg'
                  : '/Downvote.svg'
              }
              className="w-5 h-5 cursor-pointer"
            />
          </div>
        )}

        {/* main content */}
        <div className="flex flex-col w-full">
          <div>
            <div className="mb-2 px-3 sm:pl-5 ">
              <div
                className={`${
                  showMore ? 'h-[150px]' : ''
                } overflow-hidden break-words`}
              >
                <Markup
                  className={`${
                    showMore ? 'line-clamp-5' : ''
                  } linkify line-clamp-2 whitespace-pre-wrap max-h-[10px] overflow-hide break-words font-medium text-base sm:text-lg`}
                >
                  {post?.title}
                </Markup>
                {/* todo showmore for clamped text */}
              </div>
              {showMore && (
                <Link href={`/p/${post._id}`} className="text-blue-400">
                  Show more
                </Link>
              )}
            </div>
            {post?.postImageUrl && (
              <Link href={`/p/${post?._id}`} passHref>
                {/* eslint-disable-next-line */}
                <div className="sm:pl-5  sm:pr-6 sm:pb-1">
                  <ImageWithPulsingLoader
                    src={post.postImageUrl}
                    className={`image-unselectable sm:rounded-xl object-contain w-full ${
                      router.pathname.startsWith('/p') ? '' : 'max-h-[500px]'
                    }`}
                    loaderClassName="sm:rounded-xl w-full h-[300px]"
                  />
                </div>
              </Link>
            )}
            {post?.postVideoUrl && (
              <div className="sm:pl-5 sm:pr-6 sm:pb-1">
                <VideoWithAutoPause
                  src={post.postVideoUrl}
                  className={`image-unselectable object-contain sm:rounded-xl w-full ${
                    router.pathname.startsWith('/p') ? '' : 'max-h-[500px]'
                  }`}
                  loop
                  controls
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
          <div className="text-s-text sm:text-p-text flex flex-row items-center px-3 sm:px-6 py-2 justify-between sm:justify-start sm:space-x-28">
            {isMobile && (
              <div className="flex flex-row items-center gap-x-2">
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
            )}

            <Link
              href={`/p/${post._id}`}
              className="flex flex-row items-center"
              passHref
            >
              {post.comments?.length === 0 && (
                <FaRegComment className="hover:cursor-pointer mr-2 w-5 h-5 " />
              )}
              {post.comments?.length > 0 && (
                <FaRegCommentDots className="hover:cursor-pointer mr-2 w-5 h-5 " />
              )}
              {post.comments?.length}
            </Link>
            <div>
              <FiSend
                onClick={handleShare}
                className="hover:cursor-pointer mr-3 w-5 h-5"
              />
            </div>
            {isAuthor && (
              <div className="relative">
                <BsThreeDots
                  className="hover:cursor-pointer mr-1.5 w-4 h-4 sm:w-5 sm:h-5"
                  onClick={showMoreOptions}
                  title="More"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCard
