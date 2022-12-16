import React, { useState, useEffect } from 'react'
import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import { AiOutlineHeart } from 'react-icons/ai'
import { FaHandSparkles } from 'react-icons/fa'
import { BiEdit } from 'react-icons/bi'
import { HiOutlineTrash } from 'react-icons/hi'
import { deleteComment } from '../../api/comment'
// import { getSinglePostInfo } from "../../api/post"
import { useProfile } from '../Common/WalletContext'
import { useNotify } from '../Common/NotifyContext'
import {
  modalType,
  usePopUpModal
} from '../../components/Common/CustomPopUpProvider'
import EditComment from './EditComment'
TimeAgo.addDefaultLocale(en)

const SingleComment = ({ comment, setPostInfo }) => {
  const { notifyInfo, notifyError } = useNotify()
  const { user, token } = useProfile()
  const { showModal } = usePopUpModal()

  const [isAuthor, setIsAuthor] = useState(false)

  useEffect(() => {
    if (comment?.author === user.walletAddress) {
      setIsAuthor(true)
    }
  }, [comment])

  const handleEditComment = () => {
    if (!comment) return
    showModal({
      component: <EditComment comment={comment} />,
      type: modalType.normal,
      onAction: () => {},
      extraaInfo: {}
    })
  }

  // 1. if the comment.author === user.walletAddress (same person who commented) then let them edit and delete the comment
  // 2. also delete the reference of that comment in the corresponding post's comment's array
  const handleDeleteComment = async () => {
    try {
      if (!user || !token) {
        notifyInfo('You might want to connect your wallet first')
        return
      }
      const post = await deleteComment(token, comment?._id)
      setPostInfo(post)
      // const post = await getSinglePostInfo(comment?.postId)
      notifyInfo('Comment deleted successfully')
    } catch (error) {
      console.log(error)
      notifyError('Something went wrong')
    }
  }

  return (
    <>
      {comment && (
        <div className="px-3 sm:px-5 w-full bg-s-bg my-6 sm:rounded-3xl py-3">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center">
              <img
                src={
                  comment.authorDetails.profileImageUrl
                    ? comment.authorDetails.profileImageUrl
                    : '/gradient.jpg'
                }
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mr-2"
              />
              <div className="ml-2 font-bold text-xs sm:text-xl">
                {comment.authorDetails.name
                  ? comment.authorDetails.name
                  : comment.author.substring(0, 6) + '...'}
              </div>
            </div>
            <div className="flex flex-row items-center">
              {isAuthor && (
                <>
                  <HiOutlineTrash
                    className="hover:cursor-pointer mr-1.5 w-5 h-5 sm:w-7 sm:h-7"
                    onClick={handleDeleteComment}
                    title="Delete"
                  />
                  <BiEdit
                    className="hover:cursor-pointer mr-1.5 w-5 h-5 sm:w-7 sm:h-7"
                    onClick={handleEditComment}
                    title="Edit"
                  />
                </>
              )}
              <AiOutlineHeart className="hover:cursor-pointer mr-1.5 w-5 h-5 sm:w-7 sm:h-7 text-p-btn" />
              <div className="mr-3">{comment.likes.length}</div>
              <FaHandSparkles className="w-5 h-5 sm:w-7 sm:h-7 mr-1.5" />
              <div className="mr-3">{comment.appreciateAmount}</div>
              <div className="text-xs sm:text-base">
                <ReactTimeAgo
                  date={new Date(comment.updatedAt || comment.createdAt)}
                  locale="en-US"
                />
              </div>
            </div>
          </div>

          <div className="mt-3">{comment.content}</div>
        </div>
      )}
      {!comment && <></>}
    </>
  )
}

export default SingleComment
