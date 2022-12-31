import React, { useEffect, useState } from 'react'
// import Image from 'next/image'
import { useProfile } from '../Common/WalletContext'
import { useNotify } from '../Common/NotifyContext'
import { deletePost, putUpvoteOnPost, putDownvoteOnPost } from '../../api/post'
import { BsThreeDots } from 'react-icons/bs'
// import { HiOutlineTrash } from 'react-icons/hi'
import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'
import PostDeleteDropdown from './PostDeleteDropdown'
import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import Link from 'next/link'
import { FaRegComment, FaRegCommentDots } from 'react-icons/fa'
import { FiSend } from 'react-icons/fi'
import JoinCommunityButton from '../Community/JoinCommunityButton'
TimeAgo.addDefaultLocale(en)

// import useDevice from '../Common/useDevice'

const PostCard = ({ post, setPosts, setNotFound }) => {
  // const createdAt = new Date(post.createdAt)
  // eslint-disable-next-line
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

  const { showModal } = usePopUpModal()

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

      await putDownvoteOnPost(post._id)
    } catch (error) {
      console.log(error)
      notifyError('Something went wrong')
    }
  }

  const handleShare = async () => {
    try {
      const url = `${window.origin}/p/${post._id}`
      const text = `${post.title} ${url}`
      const title = 'Share this post'
      navigator.share({
        title,
        text,
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

      if (setNotFound) {
        setNotFound(true)
      }
    } catch (error) {
      console.log(error)
      notifyError('Something went wrong')
    }
  }

  const showMoreOptions = (e) => {
    // setShowOptions(!showOptions)
    showModal({
      component: <PostDeleteDropdown handleDeletePost={handleDeletePost} />,
      type: modalType.customposition,
      onAction: () => {},
      extraaInfo: {
        bottom:
          window.innerHeight -
          e.currentTarget.getBoundingClientRect().bottom -
          50 +
          'px',
        left: e.currentTarget.getBoundingClientRect().left + 'px'
      }
    })
  }

  //   const likeThe
  return (
    <div className="px-3 sm:px-5 flex flex-col w-full lg:min-w-[650px] bg-s-bg pt-3 my-6 sm:rounded-2xl shadow-sm">
      {/* top row */}
      <div className="flex flex-row items-center justify-between w-full">
        <div className="flex flex-row w-full items-center mb-3">
          <Link href={`/c/${post.communityName}`}>
            <img
              src={post.communityLogo ? post.communityLogo : '/gradient.jpg'}
              className="rounded-full lg:w-[40px] lg:h-[40px] h-[30px] w-[30px]"
            />
          </Link>
          <Link href={`/c/${post.communityName}`}>
            <div className="pl-2 font-semibold sm:text-xl hover:cursor-pointer hover:underline">
              {post.communityName}
            </div>
          </Link>

          <Link
            href={`/u/${post.author}`}
            className="flex flex-row items-center justify-center text-s-text text-sm"
          >
            <p className="pl-1.5 font-normal"> posted by</p>
            <div className="pl-1.5 font-normal hover:cursor-pointer hover:underline">
              u/
              {post.authorName
                ? post.authorName
                : post.author?.slice(0, 6) + '...'}
            </div>
          </Link>
          <div>
            {post.createdAt && (
              <div className="text-sm text-s-text ml-2">
                <ReactTimeAgo date={new Date(post.createdAt)} locale="en-US" />
              </div>
            )}
          </div>
        </div>
        <div className="mr-5">
          <JoinCommunityButton id={post.communityId} />
        </div>
      </div>

      <div className="flex flex-row w-full">
        <div className="flex flex-col items-center ml-[9px]">
          <img
            onClick={handleUpvote}
            src={reaction === 'UPVOTE' ? '/UpvoteFilled.svg' : '/Upvote.svg'}
            className="w-6 h-6 cursor-pointer"
          />
          <div>{totalCount}</div>
          <img
            onClick={handleDownvote}
            src={
              reaction === 'DOWNVOTE' ? '/DownvoteFilled.svg' : '/Downvote.svg'
            }
            className="w-5 h-5 cursor-pointer"
          />
        </div>

        {/* main content */}
        <div className="flex flex-col w-full">
          <div>
            <div className="mb-2 pl-5 font-medium text-lg sm:text-base">
              {post.title}
            </div>
            {(post?.postImageUrl || post.postVideoUrl) && (
              <Link href={`/p/${post._id}`} className="rounded-lg">
                {/* eslint-disable-next-line */}
                {post.postImageUrl ? (
                  <img
                    src={post.postImageUrl}
                    className="object-cover pl-5 pr-6 pb-1  w-full rounded-xl"
                  />
                ) : (
                  <>
                    <video
                      src={post.postVideoUrl}
                      className="object-cover rounded-xl pl-5 pr-6 pb-1 w-full"
                      autoPlay
                      loop
                      controls
                      muted
                    />
                  </>
                )}
              </Link>
            )}
          </div>

          {/* bottom row */}
          <div className="flex flex-row items-center sm:px-6 sm:py-2 space-x-28">
            {/* <div className="flex flex-row items-center">
              {!liked && (
                <AiOutlineHeart
                  className="hover:cursor-pointer mr-2 w-5 h-5 sm:w-7 sm:h-7 text-p-btn"
                  onClick={handleLike}
                />
              )}
              {liked && (
                <AiFillHeart
                  className="hover:cursor-pointer mr-2 w-5 h-5 sm:w-7 sm:h-7 text-p-btn"
                  onClick={handleUnLike}
                />
              )}
              {likes}
            </div> */}
            <Link
              href={`/p/${post._id}`}
              className="flex flex-row items-center"
            >
              {post.comments?.length === 0 && (
                <FaRegComment className="hover:cursor-pointer mr-2 w-5 h-5 sm:w-6 sm:h-6" />
              )}
              {post.comments?.length > 0 && (
                <FaRegCommentDots className="hover:cursor-pointer mr-2 w-5 h-5 sm:w-6 sm:h-6" />
              )}
              {post.comments?.length}
            </Link>
            <div>
              <FiSend
                onClick={handleShare}
                className="hover:cursor-pointer mr-3 w-4 sm:w-7 sm:h-7"
              />
            </div>
            <div>
              {isAuthor && (
                <div className="relative">
                  <BsThreeDots
                    className="hover:cursor-pointer mr-1.5 w-4 h-4 sm:w-6 sm:h-6"
                    onClick={showMoreOptions}
                    title="More"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCard
