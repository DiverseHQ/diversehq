import { Tooltip } from '@mui/material'
import React, { FC, useEffect, useState } from 'react'
import { AiOutlineRetweet } from 'react-icons/ai'
import {
  Publication,
  useCreateMirrorTypedDataMutation
  // useCreateMirrorViaDispatcherMutation
} from '../../graphql/generated'
import { useLensUserContext } from '../../lib/LensUserContext'
import useSignTypedDataAndBroadcast from '../../lib/useSignTypedDataAndBroadcast'
import { useNotify } from '../Common/NotifyContext'

interface Props {
  postInfo: Publication
}

const MirrorButton: FC<Props> = ({ postInfo }) => {
  const isMirror = postInfo.__typename === 'Mirror'
  const { mutateAsync: mirrorPost } = useCreateMirrorTypedDataMutation()
  const { isSignedIn, data: lensProfile } = useLensUserContext()
  const { notifyError, notifySuccess } = useNotify()
  const { result, signTypedDataAndBroadcast } =
    useSignTypedDataAndBroadcast(false)
  // const { mutateAsync: mirrorPostViaDispatcher } =
  //   useCreateMirrorViaDispatcherMutation()
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
    try {
      if (!isSignedIn) {
        notifyError('Please sign in to mirror a post')
        setLoading(false)
        return
      }
      // if (lensProfile?.defaultProfile?.dispatcher?.canUseRelay) {
      //   console.log('using dispatcher')
      //   console.log('postInfo.id', postInfo.id)

      //   const { createMirrorViaDispatcher } = await mirrorPostViaDispatcher({
      //     request: {
      //       profileId: lensProfile?.defaultProfile?.id,
      //       publicationId: postInfo.id,
      //       referenceModule: {
      //         followerOnlyReferenceModule: false
      //       }
      //     }
      //   })

      //   console.log(
      //     'createMirrorViaDispatcher',
      //     createMirrorViaDispatcher.__typename
      //   )
      //   if (createMirrorViaDispatcher.__typename === 'RelayerResult') {
      //     setIsSuccessful(true)
      //   } else if (
      //     !createMirrorViaDispatcher.__typename ||
      //     createMirrorViaDispatcher.__typename === 'RelayError'
      //   ) {
      //     notifyError(createMirrorViaDispatcher.reason)
      //   }
      //   setLoading(false)
      //   return
      // } else {
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
      // }
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
  return (
    <>
      <Tooltip title="Mirror" arrow>
        <button
          onClick={handleMirrorPost}
          className={`hover:bg-s-hover rounded-md px-2 py-1.5 cursor-pointer flex flex-row items-center text-[#687684] ${
            mirrored ? 'font-bold' : ''
          }`}
          disabled={loading || mirrored}
        >
          {loading ? (
            <div className="spinner ml-2 w-3 h-3" />
          ) : (
            <AiOutlineRetweet className={` rounded-md w-4 h-4 `} />
          )}

          <p className="ml-2 font-medium text-[#687684]">{mirrorCount}</p>
        </button>
      </Tooltip>
    </>
  )
}

export default MirrorButton
