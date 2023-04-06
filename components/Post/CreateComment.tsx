import React, { useRef, useState } from 'react'
import { useProfile } from '../Common/WalletContext'
import { postComment } from '../../api/comment'
import { FiSend } from 'react-icons/fi'
import getStampFyiURL from '../User/lib/getStampFyiURL'
import { useDevice } from '../Common/DeviceWrapper'

/* eslint-disable */

const CreateComment = ({
  postId,
  setComments,
  authorAddress
}: {
  postId: string
  setComments: (comments: any) => void
  authorAddress: string
}) => {
  const { user } = useProfile()
  const commentRef = useRef()
  const [loading, setLoading] = useState(false)
  console.log('authorAddress', authorAddress)
  const { isMobile } = useDevice()

  const createComment = async () => {
    if (!commentRef?.current) return
    // @ts-ignore
    const comment = commentRef?.current?.value
    if (!comment || comment === '') return
    const content = comment
    try {
      setLoading(true)
      const comment = await postComment(content, postId, 0)
      setComments((comments) => [comment, ...comments])

      // clear the comment input field after submit
      // @ts-ignore
      commentRef.current.value = ''
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      {user &&
        (!isMobile ? (
          <div className="px-5 items-center w-full bg-s-bg py-2 sm:rounded-2xl">
            <div className="flex flex-row justify-between items-center w-full">
              <div className="flex flex-row items-center">
                <img
                  src={
                    user.profileImageUrl
                      ? user.profileImageUrl
                      : getStampFyiURL(user?.walletAddress)
                  }
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                />
                <div className="ml-2 font-bold text-base">
                  {user.name
                    ? user.name
                    : user.walletAddress.substring(0, 6) + '...'}
                </div>
              </div>
            </div>
            <div className="px-10">
              <textarea
                ref={commentRef}
                className="border-none outline-none w-full mt-1 text-base bg-s-bg"
                placeholder="Say it.."
                disabled={loading}
                rows={1}
                style={{ resize: 'none' }}
                onInput={(e) => {
                  // @ts-ignore
                  e.target.style.height = 'auto'
                  // @ts-ignore
                  e.target.style.height = e.target.scrollHeight + 'px'
                }}
              />
            </div>
            <div className="w-full flex flex-row justify-end">
              <button
                disabled={loading}
                onClick={createComment}
                className="text-p-btn-text font-bold bg-p-btn px-3 py-0.5 rounded-full text-sm mr-2"
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        ) : (
          <div className="px-3 sm:px-5 w-full bg-s-bg py-3 fixed z-30 bottom-0">
            <div className="flex flex-row justify-between items-center w-full gap-2 sm:gap-4">
              <div className="flex flex-row gap-2 sm:gap-4 items-center w-full">
                <div className="flex flex-row self-end mb-1.5">
                  <img
                    src={
                      user.profileImageUrl
                        ? user.profileImageUrl
                        : getStampFyiURL(user?.walletAddress)
                    }
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <textarea
                    ref={commentRef}
                    className="border-none outline-none w-full text-base sm:text-[18px] py-1 px-4 sm:py-2 rounded-xl bg-p-bg font-medium"
                    placeholder="Comment..."
                    onInput={(e) => {
                      // @ts-ignore
                      e.target.style.height = 'auto'
                      // @ts-ignore
                      e.target.style.height = e.target.scrollHeight + 'px'
                    }}
                    disabled={loading}
                    rows={1}
                    style={{ resize: 'none' }}
                  ></textarea>
                </div>
              </div>
              <div className="flex flex-row items-center justify-center self-end mb-3">
                {!loading && (
                  <FiSend
                    onClick={createComment}
                    className="w-5 h-5 sm:w-6 sm:h-6 text-p-text cursor-pointer"
                  />
                )}
                {loading && (
                  <img
                    src="/loading.svg"
                    alt="loading"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
    </>
  )
}

export default CreateComment
