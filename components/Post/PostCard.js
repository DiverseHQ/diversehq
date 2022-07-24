import { Router, useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useProfile } from '../Common/WalletContext'
import { useNotify } from '../Common/NotifyContext'
import { putLikeOnPost } from '../../api/post'
import { BsShare, BsShareFill } from 'react-icons/bs'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { BiCommentDetail } from 'react-icons/bi'

const PostCard = ({ post }) => {
  const router = useRouter()
  const createdAt = new Date(post.createdAt)
  const [loaded, setLoaded] = useState(false)
  const { user, token } = useProfile()
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(post.likes.length)
  const { notifyInfo, notifyError } = useNotify()

  useEffect(() => {
    if (!user) return
    setLiked(post.likes.includes(user.walletAddress))
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
    <div className="w-full border-p-border bg-p-bg py-3 sm:my-11 border-y">
      <div className='px-3'>
        <div className="flex flex-row justify-between items-center mb-1.5">
            <div className="flex flex-row items-center" onClick={handleCommunityClicked}>
              {post.communityLogo && <Image src={post.communityLogo} width={26} height={26} className="rounded-full" />}
              <div className='pl-1.5 font-bold text-xs hover:cursor-pointer hover:underline'>{post.communityName}</div>
            </div>
            <div className='flex flex-row items-center' onClick={handleAuthorClicked}>
              {post.authorAvatar && <Image src={post.authorAvatar} className="rounded-full" width={26} height={26} />}
              <div className='pl-1.5 font-bold text-xs hover:cursor-pointer hover:underline'>{post.authorName ? post.authorName : post.author.slice(0, 6) + '...'}</div>
            </div>
        </div>
        <div className="mb-2 font-normal text-xs">
          {post.title}
        </div>
        </div>
       <div onClick={routeToPostPage}>
        {post.postImageUrl ? (<img src={post.postImageUrl} className="w-full" onLoad={() => { setLoaded(true) }} />) : (<video src={post.postVideoUrl} onLoad={() => { setLoaded(true) }} autoPlay loop controls />)} 
       </div>

        <div className="flex flex-row justify-between items-center px-3 pt-2.5 ">
            <div className="flex flex-row items-center">
{!liked && <AiOutlineHeart className='mr-3 w-5 h-5  text-p-btn' onClick={handleLike} />}
           {liked && <AiFillHeart className='mr-3 w-5 h-5 text-p-btn' onClick={handleUnLike} />}
            <BiCommentDetail className='mr-3 w-5 h-5' onClick={routeToPostPage} />
            <BsShareFill onClick={handleShare} className='mr-3 w-4' />
            </div>
            <div className="flex flex-row items-center text-xs">
            <div className='pr-2 hover:cursor-pointer hover:underline'>{likes} likes</div>
            <div className='hover:cursor-pointer hover:underline'> {post.comments.length} comments</div>
            </div>
        </div>
        </div>
  )
}

export default PostCard
