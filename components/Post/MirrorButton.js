import { CircularProgress, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { AiOutlineRetweet } from 'react-icons/ai'
import {
  useCreateMirrorTypedDataMutation,
  useCreateMirrorViaDispatcherMutation
} from '../../graphql/generated'
import { useLensUserContext } from '../../lib/LensUserContext'
import useSignTypedDataAndBroadcast from '../../lib/useSignTypedDataAndBroadcast'
import { useNotify } from '../Common/NotifyContext'

const MirrorButton = ({ postInfo }) => {
  const isMirror = postInfo.__typename === 'Mirror'
  const { mutateAsync: mirrorPost } = useCreateMirrorTypedDataMutation()
  const { isSignedIn, data: lensProfile } = useLensUserContext()
  const { notifyError, notifySuccess } = useNotify()
  const { error, result, type, signTypedDataAndBroadcast } =
    useSignTypedDataAndBroadcast()
  const { mutateAsync: mirrorPostViaDispatcher } =
    useCreateMirrorViaDispatcherMutation()
  const [mirrorCount, setMirrorCount] = useState(
    postInfo?.stats?.totalAmountOfMirrors
      ? postInfo?.stats?.totalAmountOfMirrors
      : 0
  )
  const [isSuccessful, setIsSuccessful] = useState(false)
  const [mirrored, setMirrored] = useState(
    isMirror
      ? postInfo?.mirrorOf?.mirrors?.length > 0
      : postInfo?.mirrors?.length > 0
  )
  const [loading, setLoading] = useState(false)

  const handleMirrorPost = async () => {
    setLoading(true)
    console.log('mirroring')
    try {
      if (!isSignedIn) {
        notifyError('Please sign in to mirror a post')
        setLoading(false)
        return
      }
      if (lensProfile?.defaultProfile?.dispatcher?.canUseRelay) {
        const postTypedResult = await mirrorPostViaDispatcher({
          request: {
            profileId: lensProfile?.defaultProfile?.id,
            publicationId: postInfo.id,
            referenceModule: {
              followerOnlyReferenceModule: false
            }
          }
        })
        console.log(postTypedResult)
        if (postTypedResult) {
          setIsSuccessful(true)
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
        console.log(postTypedResult, 'postTypedResult')
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
      notifySuccess('Mirrored successfully!')
      setMirrored(true)
    }
  }, [loading, isSuccessful])

  useEffect(() => {
    if (result) {
      setIsSuccessful(true)
      setLoading(false)
    }
  }, [result])
  return (
    <>
      <Tooltip title="Mirror" arrow>
        <div className="hover:bg-s-hover rounded-md p-0.5 cursor-pointer flex flex-row items-center">
          <button
            onClick={handleMirrorPost}
            className={`hover:bg-s-hover ${
              mirrored ? 'bold' : 'text-[#687684]'
            }`}
            disabled={loading || mirrored}
          >
            {loading ? (
              <CircularProgress size="14px" color="primary" />
            ) : (
              <AiOutlineRetweet className={` rounded-md w-4 h-4 `} />
            )}
          </button>
          <p className="ml-2 font-medium text-[#687684]">{mirrorCount}</p>
        </div>
      </Tooltip>
    </>
  )
}

export default MirrorButton
