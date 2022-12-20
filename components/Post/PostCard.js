import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
// import Image from 'next/image'
import { useProfile } from '../Common/WalletContext'
import { useNotify } from '../Common/NotifyContext'
import { putLikeOnPost, deletePost } from '../../api/post'
import { BsShareFill, BsThreeDots } from 'react-icons/bs'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { HiOutlineTrash } from 'react-icons/hi'
import { BiCommentDetail } from 'react-icons/bi'

// import useDevice from '../Common/useDevice'

const PostCard = ({ post }) => {
  const router = useRouter()
  // const createdAt = new Date(post.createdAt)
  // eslint-disable-next-line
  const [loaded, setLoaded] = useState(false)
  const { user, token } = useProfile()
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(post.likes.length)
  const { notifyInfo, notifyError } = useNotify()
  // const { isDesktop } = useDevice()

  // to maintain the current author state
  const [isAuthor, setIsAuthor] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    if (!user) return
    setLiked(post.likes.includes(user.walletAddress))
    if (post.author === user.walletAddress) {
      // if current user is the author then show the delete icon
      setIsAuthor(true)
    }
  }, [user])
  const handleLike = async () => {
    try {
      if (!user || !token) {
        notifyInfo('You might want to connect your wallet first')
        return
      }
      setLiked(true)
      setLikes(likes + 1)
      await putLikeOnPost(post._id, token)
    } catch (error) {
      console.log(error)
      notifyError('Something went wrong')
    }
  }
  const handleUnLike = async () => {
    try {
      if (!user || !token) {
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
      if (!user || !token) {
        notifyInfo('You might want to connect your wallet first')
        return
      }
      await deletePost(post._id, token)
      notifyInfo('Post deleted successfully')
      handleCommunityClicked()
    } catch (error) {
      console.log(error)
      notifyError('Something went wrong')
    }
  }

  const handleCommunityClicked = () => {
    router.push(`/c/${post.communityName}`)
  }

  const handleAuthorClicked = () => {
    router.push(`/u/${post.author}`)
  }

  const routeToPostPage = () => {
    router.push(`/p/${post._id}`)
  }

  //   const likeThe
  return (
    <div className="w-full bg-s-bg pt-3 my-6 sm:rounded-3xl shadow-lg">
      <div className="px-3 sm:px-5">
        <div className="flex flex-row justify-between items-center mb-1.5">
          <div
            className="flex flex-row items-center"
            onClick={handleCommunityClicked}
          >
            <img
              src={post.communityLogo ? post.communityLogo : '/gradient.jpg'}
              className="rounded-full w-[26px] h-[26px] sm:w-[30px] sm:h-[30px]"
            />

            <div className="pl-1.5 font-bold text-xs sm:text-xl hover:cursor-pointer hover:underline">
              {post.communityName}
            </div>
          </div>
          <div className="flex items-center">
            <div
              className="flex flex-row items-center mr-4"
              // onClick={handleDeletePost}
            >
              {isAuthor && (
                <div className="relative">
                  <BsThreeDots
                    className="hover:cursor-pointer mr-1.5 w-4 h-4 sm:w-6 sm:h-6"
                    onClick={() => setShowMenu(!showMenu)}
                    title="More"
                  />
                  {showMenu && (
                    <div className="flex flex-col absolute left-[-100px] md:left-[-160px] w-[120px] md:w-[180px] top-[30px] shadow-lg shadow-white-500/20 bg-[#fff] rounded-[10px] gap-2 z-[100] text-bold text-md sm:text-lg">
                      <div
                        className="flex items-center hover:bg-[#eee] p-2 hover:cursor-pointer hover:text-red-600 rounded-[10px]"
                        onClick={handleDeletePost}
                      >
                        <HiOutlineTrash
                          className="mr-1.5 w-4 h-4 sm:w-6 sm:h-6"
                          title="Delete"
                        />
                        <span>Delete</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div
              className="flex flex-row items-center"
              onClick={handleAuthorClicked}
            >
              <img
                src={post.authorAvatar ? post.authorAvatar : '/gradient.jpg'}
                className="rounded-full w-6 h-6 sm:w-8 sm:h-8"
              />
              <div className="pl-1.5 font-bold text-xs sm:text-xl hover:cursor-pointer hover:underline">
                {post.authorName
                  ? post.authorName
                  : post.author.slice(0, 6) + '...'}
              </div>
            </div>
          </div>
        </div>
        <div className="mb-2 font-normal text-xs sm:text-base">
          {post.title}
        </div>
      </div>
      {(post?.postImageUrl || post.postVideoUrl) && (
        <div onClick={routeToPostPage}>
          {/* eslint-disable-next-line */}
        {post.postImageUrl ? (
            <img
              src={post.postImageUrl}
              className="w-full"
              onLoad={() => {
                console.log('loaded')
                setLoaded(true)
              }}
            />
          ) : (
            <>
              <video
                src={post.postVideoUrl}
                onLoad={() => {
                  setLoaded(true)
                }}
                autoPlay
                loop
                controls
              />
            </>
          )}
        </div>
      )}

      <div className="flex flex-row justify-between items-center px-3 sm:px-5 py-2.5 sm:py-4">
        <div className="flex flex-row items-center">
          {!liked && (
            <AiOutlineHeart
              className="hover:cursor-pointer mr-3 w-5 h-5 sm:w-7 sm:h-7 text-p-btn"
              onClick={handleLike}
            />
          )}
          {liked && (
            <AiFillHeart
              className="hover:cursor-pointer mr-3 w-5 h-5 sm:w-7 sm:h-7 text-p-btn"
              onClick={handleUnLike}
            />
          )}
          <BiCommentDetail
            className="hover:cursor-pointer mr-3 w-5 h-5 sm:w-7 sm:h-7"
            onClick={routeToPostPage}
          />
          <BsShareFill
            onClick={handleShare}
            className="hover:cursor-pointer mr-3 w-4 sm:w-6 sm:h-6"
          />
        </div>
        <div className="flex flex-row items-center text-xs sm:text-xl">
          <div className="pr-2 hover:cursor-pointer hover:underline">
            {likes} likes
          </div>
          <div className="hover:cursor-pointer hover:underline">
            {' '}
            {post.comments.length} comments
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCard
