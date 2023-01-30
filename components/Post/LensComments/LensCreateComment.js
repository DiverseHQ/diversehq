import { uuidv4 } from '@firebase/util'
import React, { useEffect, useRef, useState } from 'react'
import {
  PublicationMainFocus,
  ReactionTypes,
  useCreateCommentTypedDataMutation,
  useCreateCommentViaDispatcherMutation
} from '../../../graphql/generated'
import { useLensUserContext } from '../../../lib/LensUserContext'
import useSignTypedDataAndBroadcast from '../../../lib/useSignTypedDataAndBroadcast'
import { LensInfuraEndpoint } from '../../../utils/config'
import { uploadToIpfsInfuraAndGetPath } from '../../../utils/utils'
import { useNotify } from '../../Common/NotifyContext'
import { useProfile } from '../../Common/WalletContext'
import useDevice from '../../Common/useDevice'
import Link from 'next/link'
import { FiSend } from 'react-icons/fi'

const LensCreateComment = ({
  postId,
  addComment,
  replyCommentData,
  isReply = false
}) => {
  const { error, result, type, signTypedDataAndBroadcast } =
    useSignTypedDataAndBroadcast(false)

  const { mutateAsync: createCommentWithSign } =
    useCreateCommentTypedDataMutation()
  const { mutateAsync: createCommentViaDispatcher } =
    useCreateCommentViaDispatcherMutation()
  const [tempId, setTempId] = useState('')

  const { notifyError } = useNotify()

  const commentRef = useRef()
  const [loading, setLoading] = useState(false)

  // todo: add appreciate amoount using contract

  const { hasProfile, isSignedIn, data: lensProfile } = useLensUserContext()
  const { user } = useProfile()
  const { isMobile } = useDevice()
  const [showAtBottom, setShowAtBottom] = useState(isMobile && !isReply)

  useEffect(() => {
    setShowAtBottom(isMobile && !isReply)
  }, [isMobile, isReply])

  const onSuccessCreateComment = async (tx, tempId) => {
    const comment = {
      tempId: tempId,
      profile: {
        picture: {
          original: {
            url: lensProfile?.defaultProfile?.picture?.original?.url
          }
        },
        id: lensProfile?.defaultProfile?.id,
        handle: lensProfile?.defaultProfile?.handle
      },
      createdAt: new Date().toISOString(),
      metadata: {
        content: commentRef.current.value
      },
      stats: {
        totalUpvotes: 1,
        totalDownvotes: 0
      },
      reaction: ReactionTypes.Upvote
    }
    setLoading(false)
    addComment(tx, comment)
    commentRef.current.value = ''
    commentRef.current.style.height = 'auto'
    commentRef.current.style.height = commentRef.current.scrollHeight + 'px'
  }

  const createComment = async () => {
    if (!lensProfile?.defaultProfile?.id) return
    const content = commentRef.current.value
    if (!content || content === '') return
    setLoading(true)
    try {
      const metadata_id = uuidv4()
      setTempId(tempId)
      const ipfsHash = await uploadToIpfsInfuraAndGetPath({
        version: '2.0.0',
        mainContentFocus: PublicationMainFocus.TextOnly,
        metadata_id: metadata_id,
        description: content,
        locale: 'en-US',
        content: content,
        external_url: 'https://diversehq.xyz',
        image: null,
        imageMimeType: null,
        name: 'Create with DiverseHQ',
        attributes: [],
        tags: [],
        appId: 'DiverseHQ'
      })

      console.log('ipfsHash', ipfsHash)

      const createCommentRequest = {
        profileId: lensProfile?.defaultProfile?.id,
        publicationId: postId,
        contentURI: `ipfs://${ipfsHash}`,
        collectModule: { revertCollectModule: true },
        referenceModule: {
          followerOnlyReferenceModule: false
        }
      }

      // await comment(createCommentRequest)
      try {
        if (lensProfile?.defaultProfile?.dispatcher?.canUseRelay) {
          const dispatcherResult = (
            await createCommentViaDispatcher({
              request: createCommentRequest
            })
          ).createCommentViaDispatcher
          onSuccessCreateComment({ txId: dispatcherResult.txId }, metadata_id)
        } else {
          const commentTypedResult = (
            await createCommentWithSign({
              request: createCommentRequest
            })
          ).createCommentTypedData
          console.log('commentTypedResult', commentTypedResult)
          signTypedDataAndBroadcast(commentTypedResult.typedData, {
            id: commentTypedResult.id,
            type: 'createComment'
          })
        }
      } catch (error) {
        console.log(error)
      }
    } catch (error) {
      console.log('error', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (result && type === 'createComment') {
      onSuccessCreateComment({ txHash: result.txHash }, tempId)
    }
  }, [result, type])

  useEffect(() => {
    if (error) {
      setLoading(false)
      notifyError(error)
    }
  }, [error])

  return (
    <div>
      {hasProfile &&
        isSignedIn &&
        lensProfile?.defaultProfile?.id &&
        (!showAtBottom ? (
          <>
            {isMobile && (
              <div className="px-3 sm:px-5  w-full pt-2 sm:rounded-2xl flex flex-row gap-4">
                <div className="flex flex-col items-start">
                  <div>
                    <img
                      src={
                        replyCommentData?.profile?.picture?.original?.url?.startsWith(
                          'ipfs'
                        )
                          ? `${LensInfuraEndpoint}${
                              replyCommentData?.profile?.picture?.original?.url.split(
                                '//'
                              )[1]
                            }`
                          : '/gradient.jpg'
                      }
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                    />
                  </div>
                  <div className="w-[2px] min-h-[60px] h-full bg-[#ccc] ml-3"></div>
                </div>
                <div className="flex flex-col">
                  <Link
                    href={`/u/${replyCommentData?.profile?.handle}`}
                    passHref
                  >
                    <div className="hover:underline font-bold text-base">
                      u/{replyCommentData?.profile?.handle}
                    </div>
                  </Link>
                  <div className="pb-4">
                    {replyCommentData?.metadata?.content}
                  </div>
                </div>
              </div>
            )}
            <div className="px-3 sm:px-5 items-center w-full bg-s-bg py-2 sm:rounded-2xl ">
              <div className="flex flex-row justify-between items-center w-full">
                <div className="flex flex-row items-center">
                  <img
                    src={
                      user?.profileImageUrl
                        ? user?.profileImageUrl
                        : '/gradient.jpg'
                    }
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                  />
                  <div className="ml-2 font-bold text-base">
                    {lensProfile?.defaultProfile?.handle}
                  </div>
                </div>
              </div>
              <div className="px-10">
                <textarea
                  ref={commentRef}
                  className={`border-none outline-none w-full mt-1 text-base bg-s-bg ${
                    loading ? 'text-s-text' : 'text-p-text'
                  }`}
                  placeholder="Say it..."
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') createComment()
                  }}
                  disabled={loading}
                  rows={1}
                  style={{ resize: 'none' }}
                  onInput={(e) => {
                    e.target.style.height = 'auto'
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
          </>
        ) : (
          <div className="px-2 sm:px-5 w-full bg-s-bg py-3 fixed z-30 bottom-[50px]">
            <div className="flex flex-row justify-between items-center w-full gap-2 sm:gap-4">
              <div className="flex flex-row gap-2 sm:gap-4 items-center w-full">
                <div className="flex flex-row self-end mb-1.5">
                  <img
                    src={
                      user?.profileImageUrl
                        ? user?.profileImageUrl
                        : '/gradient.jpg'
                    }
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <textarea
                    type="text"
                    ref={commentRef}
                    className={`border-none outline-none w-full text-base sm:text-[18px] py-1 px-4 sm:py-2 rounded-xl bg-p-bg font-medium ${
                      loading ? 'text-s-text' : 'text-p-text'
                    }`}
                    placeholder="What do you think?"
                    onKeyUp={(e) => {
                      if (e.key === 'Enter') createComment()
                    }}
                    onInput={(e) => {
                      e.target.style.height = 'auto'
                      e.target.style.height = `${e.target.scrollHeight}px`
                    }}
                    disabled={loading}
                    rows={1}
                    style={{ resize: 'none' }}
                  />
                </div>
              </div>
              <div className="flex flex-row justify-center self-end mb-3">
                {!loading && (
                  <FiSend
                    onClick={createComment}
                    className="w-5 h-5 sm:w-6 sm:h-6 text-p-text"
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
    </div>
  )
}

export default LensCreateComment
