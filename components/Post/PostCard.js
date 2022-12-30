import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
// import Image from 'next/image'
import { useProfile } from '../Common/WalletContext'
import { useNotify } from '../Common/NotifyContext'
import { putLikeOnPost, deletePost } from '../../api/post'
import { BsShareFill, BsThreeDots } from 'react-icons/bs'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
// import { HiOutlineTrash } from 'react-icons/hi'
import { BiCommentDetail } from 'react-icons/bi'
import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'
import PostDeleteDropdown from './PostDeleteDropdown'
import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import Link from 'next/link'
TimeAgo.addDefaultLocale(en)

// import useDevice from '../Common/useDevice'

const PostCard = ({ post, setPosts, setNotFound }) => {
  const router = useRouter()
  // const createdAt = new Date(post.createdAt)
  // eslint-disable-next-line
  const [loaded, setLoaded] = useState(false)
  const { user } = useProfile()
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(post.likes.length)
  const { notifyInfo, notifyError } = useNotify()
  // const { isDesktop } = useDevice()

  // to maintain the current author state
  const [isAuthor, setIsAuthor] = useState(false)

  const { showModal } = usePopUpModal()

  useEffect(() => {
    if (!user) return
    setLiked(post.likes?.includes(user.walletAddress))
    if (post.author === user.walletAddress) {
      // if current user is the author then show the delete icon
      setIsAuthor(true)
    }
  }, [user])
  const handleLike = async () => {
    try {
      if (!user) {
        notifyInfo('You might want to connect your wallet first')
        return
      }
      setLiked(true)
      setLikes(likes + 1)
      await putLikeOnPost(post._id)
    } catch (error) {
      console.log(error)
      notifyError('Something went wrong')
    }
  }
  const handleUnLike = async () => {
    try {
      if (!user) {
        notifyInfo('You might want to connect your wallet first')
        return
      }
      setLiked(false)
      setLikes(likes - 1)
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
    <div className="px-3 sm:px-5 flex flex-row w-full bg-s-bg pt-3 my-6 sm:rounded-lg shadow-lg">
      <div className="flex flex-col">
        <Link
          href={`/c/${post.communityName}`}
          className="flex flex-row items-center"
        >
          <img
            src={post.communityLogo ? post.communityLogo : '/gradient.jpg'}
            className="rounded-full lg:w-[40px] lg:h-[40px] h-[30px] w-[30px]"
          />
        </Link>
      </div>
      <div className="flex flex-col">
        {/* top row */}
        <div className="flex flex-row items-center mb-1.5">
          <div className="flex flex-row items-end">
            <Link href={`/c/${post.communityName}`}>
              <div className="pl-1.5 font-semibold sm:text-xl hover:cursor-pointer hover:underline">
                {post.communityName}
              </div>
            </Link>

            <Link
              href={`/u/${post.author}`}
              className="flex flex-row items-start justify-center"
            >
              <p className="pl-1.5 font-normal text-xs"> Posted by</p>
              <div className="pl-1.5 font-normal text-xs hover:cursor-pointer hover:underline">
                u/
                {post.authorName
                  ? post.authorName
                  : post.author?.slice(0, 6) + '...'}
              </div>
            </Link>
            <div>
              {post.createdAt && (
                <div className="text-xs text-gray-400 ml-2">
                  <ReactTimeAgo
                    date={new Date(post.createdAt)}
                    locale="en-US"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* main content */}
        <div>
          <div className="mb-2 pl-9 font-medium text-lg sm:text-base">
            {post.title}
          </div>
          {(post?.postImageUrl || post.postVideoUrl) && (
            <Link href={`/p/${post._id}`} className="rounded-lg">
              {/* eslint-disable-next-line */}
              {post.postImageUrl ? (
                <img
                  src={post.postImageUrl}
                  className="object-cover pl-14 pr-6 pb-1  w-full rounded-lg"
                  onLoad={() => {
                    console.log('loaded')
                    setLoaded(true)
                  }}
                />
              ) : (
                <>
                  <video
                    src={post.postVideoUrl}
                    className="object-cover rounded-lg pl-14 pr-6 pb-1 w-full"
                    onLoad={() => {
                      setLoaded(true)
                    }}
                    autoPlay
                    loop
                    controls
                  />
                </>
              )}
            </Link>
          )}
        </div>

        {/* bottom row */}
        <div className="flex flex-row items-center sm:px-12 sm:py-2 space-x-28">
          <div className="flex flex-row items-center">
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
          </div>
          <Link href={`/p/${post._id}`} className="flex flex-row items-center">
            <BiCommentDetail className="hover:cursor-pointer mr-2 w-5 h-5 sm:w-7 sm:h-7" />
            {post.comments?.length}
          </Link>
          <div>
            <BsShareFill
              onClick={handleShare}
              className="hover:cursor-pointer mr-3 w-4 sm:w-6 sm:h-6"
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
  )
}

export default PostCard
