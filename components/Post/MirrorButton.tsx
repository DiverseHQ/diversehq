import React, { useEffect, useState } from 'react'
import {
  useCreateMirrorTypedDataMutation,
  useCreateMirrorViaDispatcherMutation,
  useHidePublicationMutation
} from '../../graphql/generated'
import { useLensUserContext } from '../../lib/LensUserContext'
import useSignTypedDataAndBroadcast from '../../lib/useSignTypedDataAndBroadcast'
import { useNotify } from '../Common/NotifyContext'
import { useRouter } from 'next/router'
import { postWithCommunityInfoType } from '../../types/post'
import OptionsWrapper from '../Common/OptionsWrapper'
import MoreOptionsModal from '../Common/UI/MoreOptionsModal'
import { Tooltip } from '@mui/material'
import { AiOutlineRetweet } from 'react-icons/ai'

interface Props {
  postInfo: postWithCommunityInfoType
}

const MirrorButton = ({ postInfo }: Props) => {
  const { mutateAsync: mirrorPost } = useCreateMirrorTypedDataMutation()
  const { isSignedIn, data: lensProfile } = useLensUserContext()
  const { notifyError, notifySuccess } = useNotify()
  const { result, signTypedDataAndBroadcast } =
    useSignTypedDataAndBroadcast(false)
  const { mutateAsync: mirrorPostViaDispatcher } =
    useCreateMirrorViaDispatcherMutation()
  const [mirrorCount, setMirrorCount] = useState(
    postInfo?.stats?.totalAmountOfMirrors
      ? postInfo?.stats?.totalAmountOfMirrors
      : 0
  )
  const [isSuccessful, setIsSuccessful] = useState(false)
  const [mirrored, setMirrored] = useState(
    // @ts-ignore
    postInfo?.mirrors?.length > 0
  )
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showOptionsModal, setShowOptionsModal] = useState(false)
  const { mutateAsync: deletePublication } = useHidePublicationMutation()
  const router = useRouter()

  useEffect(() => {
    setMirrored(
      // @ts-ignore
      postInfo?.mirrors?.length > 0
    )
  }, [
    // @ts-ignore
    postInfo?.mirrors?.length
  ])
  const [loading, setLoading] = useState(false)

  const handleMirrorPost = async () => {
    setLoading(true)
    try {
      if (!isSignedIn) {
        notifyError('Please sign in to mirror a post')
        setLoading(false)
        return
      }
      setIsDrawerOpen(false)
      setShowOptionsModal(false)
      if (lensProfile?.defaultProfile?.dispatcher?.canUseRelay) {
        const { createMirrorViaDispatcher } = await mirrorPostViaDispatcher({
          request: {
            profileId: lensProfile?.defaultProfile?.id,
            publicationId: postInfo.id,
            referenceModule: {
              followerOnlyReferenceModule: false
            }
          }
        })
        // @ts-ignore
        if (
          // @ts-ignore

          createMirrorViaDispatcher?.txId ||
          // @ts-ignore

          createMirrorViaDispatcher?.txHash
        ) {
          setIsSuccessful(true)
          // @ts-ignore
        } else if (createMirrorViaDispatcher?.reason) {
          // @ts-ignore
          notifyError(createMirrorViaDispatcher.reason)
        }
        setLoading(false)
        return
      } else {
        const postTypedResult = await mirrorPost({
          request: {
            profileId: lensProfile?.defaultProfile?.id,
            publicationId: postInfo.id,
            referenceModule: {
              followerOnlyReferenceModule: false
            }
          }
        })
        if (!postTypedResult) {
          notifyError('Something went wrong')
          setLoading(false)
          return
        }
        await signTypedDataAndBroadcast(
          postTypedResult.createMirrorTypedData.typedData,
          {
            id: postTypedResult.createMirrorTypedData.id,
            type: 'Mirror'
          }
        )
      }
    } catch (err) {
      console.log(err)
      notifyError('Something went wrong')
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isSuccessful && !loading) {
      setMirrorCount((prev) => prev + 1)
      setMirrored(true)
      notifySuccess('Mirrored')
    }
  }, [loading, isSuccessful])

  useEffect(() => {
    if (result) {
      setIsSuccessful(true)
      setLoading(false)
    }
  }, [result])
  const handleUndoMirror = async () => {
    // @ts-ignore
    let mirrorId = postInfo?.originalMirrorPublication?.id
    try {
      await deletePublication({
        request: {
          publicationId: mirrorId
        }
      })

      notifySuccess('Post deleted successfully')

      // refresh tthe page
      router.reload()
    } catch (err) {
      console.log(err)
      notifyError('Something went wrong')
    }
  }

  return (
    <>
      {mirrored ? (
        <>
          {/* @ts-ignore */}
          {postInfo?.mirroredBy && postInfo?.originalMirrorPublication?.id ? (
            <span onClick={(e) => e.stopPropagation()}>
              <OptionsWrapper
                OptionPopUpModal={() => (
                  <MoreOptionsModal
                    className="z-50"
                    list={[
                      {
                        label: 'Undo Mirror',
                        onClick: handleUndoMirror
                      }
                    ]}
                  />
                )}
                isDrawerOpen={isDrawerOpen}
                setIsDrawerOpen={setIsDrawerOpen}
                showOptionsModal={showOptionsModal}
                setShowOptionsModal={setShowOptionsModal}
                position="top-right"
              >
                <Tooltip title="Undo Mirror" arrow>
                  <div
                    className={`hover:bg-s-hover rounded-md px-2 py-1.5 cursor-pointer flex flex-row items-center text-[#687684] ${
                      mirrored ? 'font-bold' : ''
                    }`}
                  >
                    {loading ? (
                      <div className="spinner ml-2 w-3 h-3" />
                    ) : (
                      <AiOutlineRetweet
                        className={`text-p-btn rounded-md w-4 h-4 `}
                      />
                    )}

                    <p className="ml-2 font-medium text-[#687684]">
                      {mirrorCount}
                    </p>
                  </div>
                </Tooltip>
              </OptionsWrapper>
            </span>
          ) : (
            <span onClick={(e) => e.stopPropagation()}>
              <OptionsWrapper
                OptionPopUpModal={() => (
                  <MoreOptionsModal
                    className="z-50"
                    list={[
                      {
                        label: 'Mirror Again',
                        onClick: handleMirrorPost
                      }
                    ]}
                  />
                )}
                isDrawerOpen={isDrawerOpen}
                setIsDrawerOpen={setIsDrawerOpen}
                showOptionsModal={showOptionsModal}
                setShowOptionsModal={setShowOptionsModal}
                position="top-right"
              >
                <Tooltip title="Mirror" arrow>
                  <div
                    className={`hover:bg-s-hover rounded-md px-2 py-1.5 cursor-pointer flex flex-row items-center text-[#687684] ${
                      mirrored ? 'font-bold' : ''
                    }`}
                  >
                    {loading ? (
                      <div className="spinner ml-2 w-3 h-3" />
                    ) : (
                      <AiOutlineRetweet
                        className={`text-p-btn rounded-md w-4 h-4 `}
                      />
                    )}

                    <p className="ml-2 font-medium text-[#687684]">
                      {mirrorCount}
                    </p>
                  </div>
                </Tooltip>
              </OptionsWrapper>
            </span>
          )}
        </>
      ) : (
        <Tooltip title="Mirror" arrow>
          <button
            onClick={handleMirrorPost}
            className={`hover:bg-s-hover rounded-md px-2 py-1.5 cursor-pointer flex flex-row items-center text-[#687684] ${
              mirrored ? 'font-bold' : ''
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="spinner ml-2 w-3 h-3" />
            ) : (
              <>
                {mirrored ? (
                  <AiOutlineRetweet
                    className={`text-p-btn rounded-md w-4 h-4 `}
                  />
                ) : (
                  <AiOutlineRetweet className={` rounded-md w-4 h-4 `} />
                )}
              </>
            )}

            <p className="ml-2 font-medium text-[#687684]">{mirrorCount}</p>
          </button>
        </Tooltip>
      )}
    </>
  )
}

export default MirrorButton
