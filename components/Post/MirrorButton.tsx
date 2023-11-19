import { Tooltip } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { AiOutlineRetweet } from 'react-icons/ai'
import { TbArrowRampRight, TbTrash } from 'react-icons/tb'
import {
  TriStateValue,
  useCreateMomokaMirrorTypedDataMutation,
  useCreateOnchainMirrorTypedDataMutation,
  useHidePublicationMutation,
  useMirrorOnMomokaMutation,
  useMirrorOnchainMutation
} from '../../graphql/generated'
import { useLensUserContext } from '../../lib/LensUserContext'
import useDASignTypedDataAndBroadcast from '../../lib/useDASignTypedDataAndBroadcast'
import useSignTypedDataAndBroadcast from '../../lib/useSignTypedDataAndBroadcast'
import { postWithCommunityInfoType } from '../../types/post'
import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'
import { useNotify } from '../Common/NotifyContext'
import OptionsWrapper from '../Common/OptionsWrapper'
import MoreOptionsModal from '../Common/UI/MoreOptionsModal'
import CreatePostPopup from '../Home/CreatePostPopup'
import checkDispatcherPermissions from '../../lib/profile/checkPermission'

interface Props {
  postInfo: postWithCommunityInfoType
  isAlone?: boolean
  isComment?: boolean
}

const MirrorButton = ({ postInfo, isAlone, isComment = false }: Props) => {
  const { mutateAsync: mirrorPost } = useMirrorOnchainMutation()
  const { isSignedIn, data: lensProfile } = useLensUserContext()
  const { notifyError, notifySuccess } = useNotify()
  const { result, signTypedDataAndBroadcast } =
    useSignTypedDataAndBroadcast(false)
  const {
    result: daResult,
    type: daType,
    signDATypedDataAndBroadcast
  } = useDASignTypedDataAndBroadcast()
  const { mutateAsync: mirrorPostTypedData } =
    useCreateOnchainMirrorTypedDataMutation()
  const [mirrorCount, setMirrorCount] = useState(postInfo?.stats?.mirrors ?? 0)

  const [isSuccessful, setIsSuccessful] = useState(false)
  const [mirrored, setMirrored] = useState(
    // @ts-ignore
    postInfo?.mirrors?.length > 0
  )
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showOptionsModal, setShowOptionsModal] = useState(false)
  const { mutateAsync: deletePublication } = useHidePublicationMutation()
  const { mutateAsync: createMirrorDAViaDispatcher } =
    useMirrorOnMomokaMutation()
  const { mutateAsync: createDAMirrorTypedData } =
    useCreateMomokaMirrorTypedDataMutation()
  const router = useRouter()

  useEffect(() => {
    setMirrored(
      // @ts-ignore
      postInfo?.mirrors?.length > 0
    )

    setMirrorCount(postInfo?.stats?.mirrors ?? 0)
  }, [
    // @ts-ignore
    postInfo
  ])
  const [loading, setLoading] = useState(false)
  const { showModal } = usePopUpModal()

  const { canUseLensManager } = checkDispatcherPermissions(
    lensProfile?.defaultProfile
  )

  const handleMirrorPost = async () => {
    if (postInfo?.operations?.canMirror === TriStateValue.No) {
      notifyError('You are not allowed to mirror this post')
      return
    }
    setLoading(true)
    setIsDrawerOpen(false)
    setShowOptionsModal(false)
    if (postInfo?.momoka?.proof) {
      try {
        if (!isSignedIn) {
          notifyError('Please sign in to mirror a post')
          setLoading(false)
          return
        }
        setIsDrawerOpen(false)
        setShowOptionsModal(false)
        if (canUseLensManager) {
          const createMirror = (
            await createMirrorDAViaDispatcher({
              request: {
                mirrorOn: postInfo?.id
              }
            })
          ).mirrorOnMomoka

          if (createMirror.__typename === 'LensProfileManagerRelayError') {
            notifyError(createMirror?.reason)
          } else {
            setIsSuccessful(true)
          }
        } else {
          const typedData = (
            await createDAMirrorTypedData({
              request: {
                mirrorOn: postInfo?.id
              }
            })
          ).createMomokaMirrorTypedData

          signDATypedDataAndBroadcast(typedData.typedData, {
            id: typedData.id,
            type: 'DAMirror'
          })
        }
      } catch (error) {
        notifyError('Something went wrong')
        setLoading(false)
      } finally {
        setLoading(false)
      }
      return
    }

    try {
      if (!isSignedIn) {
        notifyError('Please sign in to mirror a post')
        setLoading(false)
        return
      }
      setIsDrawerOpen(false)
      setShowOptionsModal(false)
      if (canUseLensManager) {
        const { mirrorOnchain } = await mirrorPost({
          request: {
            mirrorOn: postInfo?.id
          }
        })

        if (mirrorOnchain.__typename === 'LensProfileManagerRelayError') {
          notifyError(mirrorOnchain?.reason)
        } else {
          setIsSuccessful(true)
        }
        setLoading(false)
        return
      } else {
        const { createOnchainMirrorTypedData } = await mirrorPostTypedData({
          request: {
            mirrorOn: postInfo?.id
          }
        })
        if (!createOnchainMirrorTypedData) {
          notifyError('Something went wrong')
          setLoading(false)
          return
        }
        await signTypedDataAndBroadcast(
          createOnchainMirrorTypedData.typedData,
          {
            id: createOnchainMirrorTypedData.id,
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

  useEffect(() => {
    if (daResult && daType === 'DAMirror') {
      setIsSuccessful(true)
      setLoading(false)
    }
  }, [daResult, daType])

  const handleUndoMirror = async () => {
    // @ts-ignore
    let mirrorId = postInfo?.originalMirrorPublication?.id
    try {
      await deletePublication({
        request: {
          for: mirrorId
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

  const handleCrossPost = () => {
    setIsDrawerOpen(false)
    setShowOptionsModal(false)

    if (!isSignedIn) {
      notifyError('Please sign in to mirror a post')
      setLoading(false)
      return
    }

    showModal({
      component: <CreatePostPopup quotedPublicationId={postInfo?.id} />,
      type: modalType.normal
    })
  }

  return (
    <div className="z-10">
      {mirrored ? (
        <span onClick={(e) => e.stopPropagation()}>
          <OptionsWrapper
            OptionPopUpModal={() => (
              <MoreOptionsModal
                list={[
                  {
                    label: 'Cross Post',
                    onClick: handleCrossPost,
                    icon: () => <TbArrowRampRight />
                  },
                  {
                    label: 'Undo Mirror',
                    onClick: handleUndoMirror,
                    icon: () => <TbTrash />
                  },
                  {
                    label: 'Mirror Again',
                    onClick: handleMirrorPost,
                    icon: () => <AiOutlineRetweet />,
                    hidden: postInfo?.momoka?.proof
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
            <Tooltip title="Mirrored" arrow>
              <div
                className={`hover:bg-s-hover rounded-md px-2 py-1.5 cursor-pointer flex flex-row items-center text-[#687684]`}
              >
                <AiOutlineRetweet
                  className={`text-p-btn rounded-md w-4 h-4 `}
                />
                {(!router.pathname.startsWith('/p') ||
                  isAlone ||
                  isComment) && (
                  <p className="ml-2 font-medium text-[#687684]">
                    {mirrorCount}
                  </p>
                )}
              </div>
            </Tooltip>
          </OptionsWrapper>
        </span>
      ) : (
        <span onClick={(e) => e.stopPropagation()}>
          <OptionsWrapper
            OptionPopUpModal={() => (
              <MoreOptionsModal
                list={[
                  {
                    label: 'Mirror',
                    onClick: handleMirrorPost,
                    icon: () => <AiOutlineRetweet />
                  },
                  {
                    label: 'Cross Post',
                    onClick: handleCrossPost,
                    icon: () => <TbArrowRampRight />
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

                {(!router.pathname.startsWith('/p') ||
                  isAlone ||
                  isComment) && (
                  <p className="ml-2 font-medium text-[#687684]">
                    {mirrorCount}
                  </p>
                )}
              </div>
            </Tooltip>
          </OptionsWrapper>
        </span>
      )}
    </div>
  )
}

export default MirrorButton
